import { API_ROOT, BASE_URL } from "@/constants/url";
import { MovieDetail, MovieList, MovieVideo } from "@/models/movie";

const API_KEY = process.env.EXPO_PUBLIC_MOVIE_DB_API_KEY;
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const headers = {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
}
export const getImageUrl = (path: string | null | undefined, size: 'w200' | 'w342' | 'w500' | 'original' = 'w500') => {
    if (!path) return undefined;
    if (path.startsWith('http')) return path;
    return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const fetchMovies = async (page: number = 1): Promise<MovieList | undefined> => {
    try {
        const response = await fetch(`${BASE_URL}/upcoming?page=${page}`, {
            headers: headers
        });
        const data = await response.json();
        return data;

    } catch (error) {
        console.log(error)
        throw error;
    }
}

export const fetchMovieDetails = async (id: number): Promise<MovieDetail> => {
    try {
        const response = await fetch(`${BASE_URL}/${id}`, { headers: headers });
        const movieData = await response.json();
        return movieData;
    } catch (error) {
        throw new Error("Failed to fetch movie details");
    }
}

export const fetchMovieVideos = async (id: number): Promise<MovieVideo[]> => {
    try {
        const response = await fetch(`${BASE_URL}/${id}/videos`, { headers: headers });
        const data = await response.json();
        return data.results ?? [];
    } catch (error) {
        console.log(error);
        return [];
    }
}

export const searchMovies = async (query: string, page: number = 1): Promise<MovieList> => {
    try {
        const response = await fetch(
            `${API_ROOT}/search/movie?query=${encodeURIComponent(query)}&page=${page}`,
            { headers: headers }
        );
        const data = await response.json();
        return data;
    } catch (error) {
        throw error
    }

};