import { MovieList } from "@/models/movie";
import { fetchMovies } from "@/services/movie-service";
import { useEffect, useState } from "react";

export const useFetchMovies = () => {
    const [movies, setMovies] = useState<MovieList>({ results: [] });
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [error, setError] = useState<string | null>(null);

    const loadMovies = async (pageNumber: number = 1) => {
        try {
            if (pageNumber === 1) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }
            setError(null);
            const response = await fetchMovies(pageNumber);
            if (response && response.results) {
                setMovies((prev) => ({
                    ...response,
                    results: pageNumber === 1 ? response.results : [...prev.results, ...response.results],
                }));
                setPage(pageNumber);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch movies");
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const loadMore = () => {
        if (!loading && !loadingMore) {
            loadMovies(page + 1);
        }
    };

    useEffect(() => {
        loadMovies(1);
    }, []);

    return { movies, loading, loadingMore, error, refetch: () => loadMovies(1), loadMore };
};
