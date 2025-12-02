
export type NetworkMode = 'HOME' | 'SCHOOL' | 'LOCKED';

export interface Movie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  media_type: 'movie' | 'tv';
  release_date?: string;
  first_air_date?: string;
}

export interface TMDBResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface FilterState {
  sortBy: 'trending' | 'top_rated' | 'newest';
  mediaType: 'all' | 'movie' | 'tv';
  genreId: number | null;
}

export type ViewState = 'LAUNCHER' | 'STREAMS' | 'SEARCHES';
