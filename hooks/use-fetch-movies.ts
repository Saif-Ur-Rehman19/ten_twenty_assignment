import { MovieList } from "@/models/movie";
import { fetchMovies, searchMovies } from "@/services/movie-service";
import { useEffect, useRef, useState } from "react";

export const useFetchMovies = () => {
    const [movies, setMovies] = useState<MovieList>({ results: [] });
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const loadMovies = async (pageNumber: number = 1, query: string = "") => {
        try {
            if (pageNumber === 1) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }
            setError(null);

            const response = query.trim()
                ? await searchMovies(query.trim(), pageNumber)
                : await fetchMovies(pageNumber);

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
            loadMovies(page + 1, searchQuery);
        }
    };

    const search = (text: string) => {
        setSearchQuery(text);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            loadMovies(1, text);
        }, 1000);
    };

    const clearSearch = () => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        setSearchQuery("");
        loadMovies(1, "");
    };

    useEffect(() => {
        loadMovies(1);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, []);

    return {
        movies,
        loading,
        loadingMore,
        error,
        refetch: () => loadMovies(1, searchQuery),
        loadMore,
        searchQuery,
        search,
        clearSearch,
    };
};