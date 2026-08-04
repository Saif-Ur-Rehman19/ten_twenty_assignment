import { Ionicons } from "@expo/vector-icons";
import { MovieDetail, MovieVideo } from "@/models/movie";
import { fetchMovieDetails, fetchMovieVideos, getImageUrl } from "@/services/movie-service";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    Linking,
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
import { SafeAreaView } from "react-native-safe-area-context";

const GENRE_COLORS = ["#15D2BC", "#E26CA5", "#564CA3", "#E8B84B", "#6C5CE7", "#00B894"];

const MovieDetailScreen = () => {
    const { width: screenWidth, height: screenHeight } = useWindowDimensions();
    const { id } = useLocalSearchParams();

    const router = useRouter();
    const [movie, setMovie] = useState<MovieDetail | null>(null);
    const [trailer, setTrailer] = useState<MovieVideo | null>(null);
    const [loading, setLoading] = useState(true);
    const [showTrailer, setShowTrailer] = useState(false);
    const [playing, setPlaying] = useState(false);
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
        setPlaying(true);
        setShowTrailer(true);
    };

    const closeTrailer = () => {
        setPlaying(false);
        setShowTrailer(false);
    };

    const onStateChange = useCallback((state: string) => {
        if (state === "ended") closeTrailer();
    }, []);

    const onPlayerError = useCallback((error: string) => {
        setPlayerError(error);
        setPlaying(false);
    }, []);

    const openTicketLink = () => {

        router.navigate({ pathname: '/seat-mapping-screen', params: { title: movie?.title, releaseDate: movie?.release_date,  } })
    };

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
    const releaseDate = movie.release_date
        ? new Date(movie.release_date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        })
        : null;

    return (
        <>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false} bounces={false}>
                <View style={styles.backdropContainer}>
                    {backdropUri ? (
                        <Image source={{ uri: backdropUri }} style={styles.backdrop} resizeMode="cover" />
                    ) : (
                        <View style={[styles.backdrop, styles.backdropPlaceholder]} />
                    )}
                    <View style={styles.backdropOverlay} />

                    <SafeAreaView style={styles.heroContent} edges={["top"]}>

                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
                                <Ionicons name="chevron-back" size={26} color="#fff" />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>Watch</Text>
                            <View style={{ width: 26 }} />
                        </View>
                        <View style={styles.heroBottom}>
                            <Text style={styles.title} numberOfLines={2}>
                                {movie.title}
                            </Text>
                            {releaseDate ? (
                                <Text style={styles.releaseText}>In Theaters {releaseDate}</Text>
                            ) : null}


                            <TouchableOpacity
                                style={styles.ticketButton}
                                onPress={openTicketLink}
                                activeOpacity={0.85}
                            >
                                <Text style={styles.ticketButtonText}>Get Tickets</Text>
                            </TouchableOpacity>


                            {trailer ? (
                                <TouchableOpacity
                                    style={styles.trailerButton}
                                    onPress={openTrailer}
                                    activeOpacity={0.85}
                                >
                                    <Ionicons name="play" size={16} color="#fff" style={{ marginRight: 8 }} />
                                    <Text style={styles.trailerButtonText}>Watch Trailer</Text>
                                </TouchableOpacity>
                            ) : null}
                        </View>
                    </SafeAreaView>
                </View>

                <View style={styles.detailsCard}>
                    {movie.genres?.length > 0 ? (
                        <>
                            <Text style={styles.sectionTitle}>Genres</Text>
                            <View style={styles.genreRow}>
                                {movie.genres.map((genre, index) => (
                                    <View
                                        key={genre.id}
                                        style={[
                                            styles.genreChip,
                                            { backgroundColor: GENRE_COLORS[index % GENRE_COLORS.length] },
                                        ]}
                                    >
                                        <Text style={styles.genreText}>{genre.name}</Text>
                                    </View>
                                ))}
                            </View>
                            <View style={styles.divider} />
                        </>
                    ) : null}
                    <SafeAreaView>
                        <Text style={styles.sectionTitle}>Overview</Text>
                        <Text style={styles.overview}>{movie.overview.toLocaleUpperCase()}</Text>
                    </SafeAreaView>

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
                        <Text style={styles.closeText}>Done</Text>
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
        height: 450,
        position: "relative",
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
        backgroundColor: "rgba(0,0,0,0.1)",
    },
    heroContent: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "space-between",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    headerTitle: {
        color: "#fff",
        fontSize: 17,
        fontWeight: "600",
    },
    heroBottom: {
        paddingHorizontal: 24,
        paddingBottom: 40,
        alignItems: "center",
    },
    title: {
        color: "#D9B45C",
        fontSize: 30,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 12,
    },
    releaseText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "500",
        fontFamily: 'Poppins',
        marginBottom: 20,
    },
    ticketButton: {
        width: 243,
        height: 50,
        backgroundColor: "#61C3F2",
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: "center",
        marginBottom: 12,
    },
    ticketButtonText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "600",
        fontFamily: 'Poppins',
        lineHeight: 20,
        letterSpacing: 0.2
    },
    trailerButton: {
        width: 243,
        height: 50,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#61C3F2",
    },
    trailerButtonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
        fontFamily: 'Poppins',
        lineHeight: 20,
        letterSpacing: 0.2
    },
    detailsCard: {
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingTop: 28,

    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "500",
        color: "#202C43",
        marginBottom: 14,
    },
    genreRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
    },
    genreChip: {
        paddingHorizontal: 16,
        paddingVertical: 4,
        borderRadius: 16,
    },
    genreText: {
        fontSize: 12,
        color: "#FFFFFF",
        fontWeight: "600",
        lineHeight: 20,
        letterSpacing: 0,
        fontFamily: "Poppins"
    },
    divider: {
        height: 1,
        backgroundColor: "#ececec",
        marginTop: 22,
    },
    overview: {
        fontSize: 16,
        fontWeight: '400',
        fontFamily: 'Poppins',
        color: "#8F8F8F",
        lineHeight: 25,
        marginBottom: 16
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
        paddingHorizontal: 14,
        height: 36,
        borderRadius: 18,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    closeText: {
        color: "#fff",
        fontSize: 15,
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