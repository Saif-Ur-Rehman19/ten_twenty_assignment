import { MovieDetail, MovieVideo } from "@/models/movie";
import { fetchMovieDetails, fetchMovieVideos, getImageUrl } from "@/services/movie-service";
import { useLocalSearchParams } from "expo-router"
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    Modal,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

const MovieDetailScreen = () => {
    const { width: screenWidth, height: screenHeight } = useWindowDimensions();
    const { id } = useLocalSearchParams();
    const [movie, setMovie] = useState<MovieDetail | null>(null);
    const [trailer, setTrailer] = useState<MovieVideo | null>(null);
    const [loading, setLoading] = useState(true);
    const [showTrailer, setShowTrailer] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [playerReady, setPlayerReady] = useState(false);
    const [playerError, setPlayerError] = useState<string | null>(null);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                const movieId = Number(id);
                const [movieData, videos] = await Promise.all([
                    fetchMovieDetails(movieId),
                    fetchMovieVideos(movieId),
                ]);
                setMovie(movieData);

                const youtubeVideos = videos.filter((v) => v.site === "YouTube");
                const officialTrailer =
                    youtubeVideos.find((v) => v.type === "Trailer" && v.official) ??
                    youtubeVideos.find((v) => v.type === "Trailer") ??
                    youtubeVideos.find((v) => v.type === "Teaser") ??
                    youtubeVideos[0] ??
                    null;
                setTrailer(officialTrailer);
            } catch (err) {
                console.log("Error loading movie details:", err);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [id]);

    const openTrailer = () => {
        setPlayerError(null);
        setPlayerReady(false);
        setPlaying(true); 
        setShowTrailer(true);
    };

    const closeTrailer = () => {
        setPlaying(false);
        setPlayerReady(false);
        setShowTrailer(false);
    };

    const onStateChange = useCallback((state: string) => {
        if (state === "ended") {
            closeTrailer();
        }
    }, []);

    const onPlayerReady = useCallback(() => {
        setPlayerReady(true);
    }, []);

    const onPlayerError = useCallback((error: string) => {
        setPlayerError(error);
        setPlaying(false);
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    if (!movie) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.errorText}>Failed to load movie details</Text>
            </View>
        );
    }

    const backdropUri = getImageUrl(movie.backdrop_path, "original");
    const posterUri = getImageUrl(movie.poster_path);
    const year = movie.release_date?.split("-")[0];
    const hours = Math.floor(movie.runtime / 60);
    const minutes = movie.runtime % 60;
    const runtimeText = `${hours}h ${minutes}m`;
    const rating = movie.vote_average?.toFixed(1);

    return (
        <>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.backdropContainer}>
                    {backdropUri ? (
                        <Image source={{ uri: backdropUri }} style={styles.backdrop} resizeMode="cover" />
                    ) : (
                        <View style={[styles.backdrop, styles.backdropPlaceholder]} />
                    )}
                    <View style={styles.backdropOverlay} />

                    {trailer ? (
                        <TouchableOpacity
                            style={styles.playButton}
                            onPress={openTrailer}
                            activeOpacity={0.8}
                        >
                            <View style={styles.playIcon}>
                                <Text style={styles.playTriangle}>▶</Text>
                            </View>
                            <Text style={styles.playLabel}>Watch Trailer</Text>
                        </TouchableOpacity>
                    ) : null}
                </View>
                <View style={styles.infoSection}>
                    <View style={styles.headerRow}>
                        {posterUri ? (
                            <Image source={{ uri: posterUri }} style={styles.poster} resizeMode="cover" />
                        ) : null}
                        <View style={styles.headerText}>
                            <Text style={styles.title}>{movie.title}</Text>
                            {movie.tagline ? <Text style={styles.tagline}>"{movie.tagline}"</Text> : null}
                            <View style={styles.metaRow}>
                                <Text style={styles.metaText}>{year}</Text>
                                <Text style={styles.metaDot}>•</Text>
                                <Text style={styles.metaText}>{runtimeText}</Text>
                                <Text style={styles.metaDot}>•</Text>
                                <Text style={styles.ratingText}>⭐ {rating}</Text>
                            </View>
                        </View>
                    </View>

                    {movie.genres?.length > 0 ? (
                        <View style={styles.genreRow}>
                            {movie.genres.map((genre) => (
                                <View key={genre.id} style={styles.genreChip}>
                                    <Text style={styles.genreText}>{genre.name}</Text>
                                </View>
                            ))}
                        </View>
                    ) : null}

                    <Text style={styles.sectionTitle}>Overview</Text>
                    <Text style={styles.overview}>{movie.overview}</Text>
                </View>
            </ScrollView>
            <Modal
                visible={showTrailer}
                animationType="slide"
                supportedOrientations={["portrait", "landscape"]}
                onRequestClose={closeTrailer}
            >
                <StatusBar hidden={showTrailer} />
                <View style={styles.modalContainer}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={closeTrailer}
                        activeOpacity={0.7}
                    >
                        <Text numberOfLines={1} style={styles.closeText}>Done</Text>
                    </TouchableOpacity>

                    {playerError ? (
                        <View style={styles.errorFallback}>
                            <Text style={styles.errorFallbackText}>
                                This trailer can't be played in-app right now.
                            </Text>
                            <Text style={styles.errorFallbackCode}>Error: {playerError}</Text>
                        </View>
                    ) : trailer ? (
                        <View style={styles.playerWrapper}>
                            <YoutubePlayer
                                height={Math.min(screenWidth * (9 / 16), screenHeight * 0.9)}
                                width={screenWidth}
                                videoId={trailer.key}
                                play={playing}
                                onReady={onPlayerReady}
                                onChangeState={onStateChange}
                                onError={onPlayerError}
                                initialPlayerParams={{
                                    autoplay: true,
                                    controls: true,
                                    rel: false,
                                    modestbranding: true,
                                }}
                                webViewProps={{
                                    androidLayerType: "hardware",
                                    allowsInlineMediaPlayback: true,
                                    mediaPlaybackRequiresUserAction: false,
                                }}
                            />
                        </View>
                    ) : null}
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    errorText: {
        color: "#999",
        fontSize: 16,
    },
    backdropContainer: {
        width: "100%",
        height: 220,
        position: "relative",
        justifyContent: "center",
        alignItems: "center",
    },
    backdrop: {
        width: "100%",
        height: "100%",
    },
    backdropPlaceholder: {
        backgroundColor: "#1c1c1e",
    },
    backdropOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.35)",
    },
    playButton: {
        position: "absolute",
        alignItems: "center",
        gap: 8,
    },
    playIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "rgba(255,255,255,0.9)",
        justifyContent: "center",
        alignItems: "center",
    },
    playTriangle: {
        fontSize: 22,
        color: "#000",
        marginLeft: 4,
    },
    playLabel: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
    infoSection: {
        padding: 16,
    },
    headerRow: {
        flexDirection: "row",
        gap: 14,
    },
    poster: {
        width: 110,
        height: 165,
        borderRadius: 12,
        marginTop: -50,
    },
    headerText: {
        flex: 1,
        paddingTop: 4,
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        color: "#1c1c1e",
    },
    tagline: {
        fontSize: 13,
        fontStyle: "italic",
        color: "#8e8e93",
        marginTop: 4,
    },
    metaRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
        gap: 6,
    },
    metaText: {
        fontSize: 13,
        color: "#636366",
    },
    metaDot: {
        fontSize: 13,
        color: "#c7c7cc",
    },
    ratingText: {
        fontSize: 13,
        color: "#ff9500",
        fontWeight: "600",
    },
    genreRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginTop: 16,
    },
    genreChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: "#f2f2f7",
    },
    genreText: {
        fontSize: 12,
        color: "#636366",
        fontWeight: "500",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1c1c1e",
        marginTop: 20,
        marginBottom: 8,
    },
    overview: {
        fontSize: 15,
        lineHeight: 22,
        color: "#3a3a3c",
    },
    modalContainer: {
        flex: 1,
        backgroundColor: "#000",
        justifyContent: "center",
    },
    closeButton: {
        position: "absolute",
        top: 50,
        right: 16,
        zIndex: 10,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    closeText: {
        minWidth: 42,
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
        
    },
    playerWrapper: {
        width: "100%",
        justifyContent: "center",
    },
    errorFallback: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 32,
    },
    errorFallbackText: {
        color: "#fff",
        fontSize: 15,
        textAlign: "center",
        lineHeight: 22,
    },
    errorFallbackCode: {
        color: "#8e8e93",
        fontSize: 12,
        marginTop: 8,
    },
});

export default MovieDetailScreen;