
import { FilterState, TMDBResponse, Genre, Movie } from '../types';

const API_KEY = '1070730380f5fee0d87cf0382fc008b6'; // Using public key for demo, ideally ENV
const BASE_URL = 'https://api.themoviedb.org/3';

// Helper to construct URL with params
const buildUrl = (endpoint: string, params: Record<string, string | number>) => {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.append('api_key', API_KEY);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });
  return url.toString();
};

export const fetchGenres = async (type: 'movie' | 'tv'): Promise<Genre[]> => {
  try {
    const url = buildUrl(`/genre/${type}/list`, {});
    const res = await fetch(url);
    const data = await res.json();
    return data.genres || [];
  } catch (e) {
    console.error("Genre fetch error", e);
    return [];
  }
};

export const discoverMedia = async (
  page: number,
  filters: FilterState
): Promise<TMDBResponse> => {
  let endpoint = '/trending/all/day';
  const params: Record<string, string | number> = { page };

  // 1. Handle Sort Logic
  if (filters.sortBy === 'top_rated') {
    endpoint = filters.mediaType === 'tv' ? '/tv/top_rated' : '/movie/top_rated';
  } else if (filters.sortBy === 'newest') {
    // Discovery endpoint needed for advanced sorting
    endpoint = filters.mediaType === 'tv' ? '/discover/tv' : '/discover/movie';
    params['sort_by'] = filters.mediaType === 'tv' ? 'first_air_date.desc' : 'primary_release_date.desc';
    params['vote_count.gte'] = 50; // Filter noise
  } else {
    // Trending default
    if (filters.mediaType === 'movie') endpoint = '/trending/movie/day';
    else if (filters.mediaType === 'tv') endpoint = '/trending/tv/day';
  }

  // 2. Handle Genre
  if (filters.genreId && filters.sortBy !== 'trending') {
    // We must use discover endpoint if filtering by genre
    if (!endpoint.includes('discover')) {
        endpoint = filters.mediaType === 'tv' ? '/discover/tv' : '/discover/movie';
        params['sort_by'] = 'popularity.desc';
    }
    params['with_genres'] = filters.genreId;
  }

  try {
    const url = buildUrl(endpoint, params);
    const res = await fetch(url);
    const data = await res.json();
    
    // Sanitize results
    const cleanResults = (data.results || []).map((item: any) => ({
      ...item,
      media_type: item.media_type || (filters.mediaType === 'tv' ? 'tv' : 'movie')
    })).filter((m: Movie) => m.poster_path); // Remove broken images

    return {
        page: data.page,
        results: cleanResults,
        total_pages: data.total_pages,
        total_results: data.total_results
    };
  } catch (error) {
    console.error("TMDB Discovery Error", error);
    return { page: 0, results: [], total_pages: 0, total_results: 0 };
  }
};

export const searchMedia = async (query: string, page: number = 1): Promise<TMDBResponse> => {
    const url = buildUrl('/search/multi', { query, page });
    const res = await fetch(url);
    const data = await res.json();
    return data;
}

export const getTVSeasons = async (id: number) => {
    const url = buildUrl(`/tv/${id}`, {});
    const res = await fetch(url);
    return await res.json();
}
