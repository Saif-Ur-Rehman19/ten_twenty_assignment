import MovieItem from "@/components/movie-item";
import SearchBar from "@/components/search-input";
import { useFetchMovies } from "@/hooks/use-fetch-movies";
import { useLayoutEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


const HomeScreen = () => {
   const { movies, loading, loadingMore, error, loadMore, searchQuery, search, clearSearch } = useFetchMovies();
    useLayoutEffect(() => {
        
    }, [])
    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Error: {error}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
           
             <SearchBar
                value={searchQuery}
                onChangeText={search}
                onClear={clearSearch}
            />
            <MovieItem
                movieList={movies}
                onLoadMore={loadMore}
                loadingMore={loadingMore}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    }
})

export default HomeScreen;