import { MovieItemProps, MovieList } from "@/models/movie";
import { getImageUrl } from "@/services/movie-service";
import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";



const MovieItem = ({ movieList, onLoadMore, loadingMore }: MovieItemProps) => {
    const router = useRouter();
    const goToMovieDetailScreen = (movieId: number) => {
        router.navigate({
            pathname: '/[id]',
            params: { id: movieId },
        });
    }
    return (
        <FlatList
            style={{ width: "100%" }}
            contentContainerStyle={styles.listContent}
            columnWrapperStyle={styles.columnWrapper}
            data={movieList?.results}
            renderItem={({ item }) => {
                const posterUri = getImageUrl(item.poster_path);

                return (
                    <TouchableOpacity onPress={() => goToMovieDetailScreen(item.id)} activeOpacity={0.8} style={styles.card}>
                        {posterUri ? (
                            <Image
                                source={{ uri: posterUri }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                        ) : (
                            <View style={[styles.image, styles.imagePlaceholder]}>
                                <Text style={styles.placeholderText}>No Image</Text>
                            </View>
                        )}
                        <View style={styles.infoBar}>
                            <Text style={styles.title} numberOfLines={2}>
                                {item.title}
                            </Text>
                        </View>
                    </TouchableOpacity>
                );
            }}
            numColumns={2}
            keyExtractor={(item, index) => `${item?.id}-${index}`}
            showsVerticalScrollIndicator={false}

            ListFooterComponent={
                onLoadMore && movieList?.results?.length > 0 ? (
                    <View style={styles.footerContainer}>
                        <TouchableOpacity
                            style={styles.loadMoreButton}
                            onPress={onLoadMore}
                            disabled={loadingMore}
                            activeOpacity={0.7}
                        >
                            {loadingMore ? (
                                <ActivityIndicator size="small" color="#ffffff" />
                            ) : (
                                <Text style={styles.loadMoreText}>Load More</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                ) : null
            }
        />
    );
};


const styles = StyleSheet.create({
    listContent: {
        backgroundColor: 'white',
        paddingHorizontal: 10,
        paddingTop: 8,
        paddingBottom: 24,
        gap: 16,
    },
    columnWrapper: {
        gap: 14,
    },
    card: {
        flex: 1,
       // aspectRatio: 2 / 3,
        borderRadius: 16,
        overflow: "hidden",
    },
    image: {
        width: 200,
        height: 200,

    },
    imagePlaceholder: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#2c2c2e",
    },
    placeholderText: {
        color: "#8e8e93",
        fontSize: 13,
    },
    infoBar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    title: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 14,
        lineHeight: 18,
    },
    year: {
        color: "rgba(255,255,255,0.7)",
        fontSize: 12,
        marginTop: 2,
    },
    footerContainer: {
        marginTop: 16,
        marginBottom: 8,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    loadMoreButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 28,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 140,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    loadMoreText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '600',
    },
});

export default MovieItem;