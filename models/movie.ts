export type Movie = {
    id: number;
    title: string;
    release_date: string;
    poster_path: string;
}

export type MovieDetail = {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    backdrop_path: string;
    release_date: string;
    runtime: number;
    vote_average: number;
    vote_count: number;
    genres: { id: number; name: string }[];
    tagline: string;
    status: string;
    revenue: number;
    budget: number;
}

export type MovieVideo = {
    id: string;
    key: string;
    name: string;
    site: string;
    type: string;
    official: boolean;
}

export type MovieList = {
    page?: number;
    results: Movie[];
    total_pages?: number;
    total_results?: number;
}

export type MovieItemProps = {
    movieList: MovieList;
    onLoadMore?: () => void;
    loadingMore?: boolean;
}
