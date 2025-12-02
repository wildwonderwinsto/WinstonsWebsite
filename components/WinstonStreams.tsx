
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FilterState, Movie, Genre } from '../types';
import { discoverMedia, fetchGenres, searchMedia } from '../services/tmdb';
import { Player } from './Player';
import { Search, Filter, Play, Star } from 'lucide-react';

export const WinstonStreams: React.FC = () => {
  // State
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  
  // Filters
  const [filters, setFilters] = useState<FilterState>({
    sortBy: 'trending',
    mediaType: 'all',
    genreId: null
  });
  const [genres, setGenres] = useState<Genre[]>([]);

  // Infinite Scroll Observer
  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPage(prev => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading]);

  // Load Genres on mount
  useEffect(() => {
    const loadGenres = async () => {
        const m = await fetchGenres('movie');
        const t = await fetchGenres('tv');
        // Deduplicate
        const combined = [...m, ...t].filter((v,i,a)=>a.findIndex(v2=>(v2.id===v.id))===i);
        setGenres(combined);
    };
    loadGenres();
  }, []);

  // Fetch Data Logic
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let res;
        if (searchQuery.trim().length > 0) {
            res = await searchMedia(searchQuery, page);
        } else {
            res = await discoverMedia(page, filters);
        }

        setMovies(prev => page === 1 ? res.results : [...prev, ...res.results]);
      } catch (err) {
        console.error("Fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search slightly
    const timer = setTimeout(() => fetchData(), 500);
    return () => clearTimeout(timer);
  }, [page, filters, searchQuery]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
    setMovies([]);
  }, [filters, searchQuery]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-red-500/30">
        {selectedMovie && <Player media={selectedMovie} onClose={() => setSelectedMovie(null)} />}

        {/* Header */}
        <div className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-xl border-b border-red-900/20 shadow-2xl shadow-black">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                    <h1 className="text-3xl font-black tracking-tighter italic text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">
                        WINSTON<span className="text-white not-italic">STREAMS</span>
                    </h1>
                    
                    {/* Search Bar */}
                    <div className="relative w-full md:w-96 group">
                        <input 
                            type="text"
                            placeholder="Find a movie..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all shadow-inner"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4 group-focus-within:text-red-500 transition-colors" />
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="flex flex-wrap items-center gap-3 mt-4 text-sm">
                   <div className="flex items-center gap-2 text-zinc-500 mr-2">
                        <Filter className="w-4 h-4" />
                        <span className="font-mono text-xs uppercase tracking-widest">Config</span>
                   </div>
                   
                   {/* Sort */}
                   <select 
                        className="bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 hover:border-red-900/50 focus:border-red-600 outline-none transition cursor-pointer"
                        value={filters.sortBy}
                        onChange={(e) => setFilters({...filters, sortBy: e.target.value as any})}
                    >
                        <option value="trending">Trending</option>
                        <option value="top_rated">Top Rated</option>
                        <option value="newest">Newest</option>
                   </select>

                   {/* Type */}
                   <select 
                        className="bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 hover:border-red-900/50 focus:border-red-600 outline-none transition cursor-pointer"
                        value={filters.mediaType}
                        onChange={(e) => setFilters({...filters, mediaType: e.target.value as any})}
                    >
                        <option value="all">All Types</option>
                        <option value="movie">Movies</option>
                        <option value="tv">TV Shows</option>
                   </select>

                   {/* Genre */}
                   <select 
                        className="bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 hover:border-red-900/50 focus:border-red-600 outline-none transition cursor-pointer max-w-[150px]"
                        onChange={(e) => setFilters({...filters, genreId: Number(e.target.value) || null})}
                    >
                        <option value="">All Genres</option>
                        {genres.map(g => (
                            <option key={g.id} value={g.id}>{g.name}</option>
                        ))}
                   </select>
                </div>
            </div>
        </div>

        {/* Content Grid */}
        <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {movies.map((movie, index) => (
                    <div 
                        key={`${movie.id}-${index}`} 
                        ref={index === movies.length - 1 ? lastElementRef : null}
                        onClick={() => setSelectedMovie(movie)}
                        className="group relative aspect-[2/3] bg-zinc-900 rounded-lg overflow-hidden cursor-pointer shadow-lg hover:shadow-red-900/20 transition-all duration-300 hover:scale-[1.02] ring-1 ring-white/5 hover:ring-red-500/50"
                    >
                        <img 
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                            alt={movie.title}
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                            loading="lazy"
                        />
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />
                        
                        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform">
                            <h3 className="text-white font-bold text-sm line-clamp-1">{movie.title || movie.name}</h3>
                            <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                                <span className="flex items-center gap-1 text-yellow-500">
                                    <Star className="w-3 h-3 fill-current" />
                                    {movie.vote_average.toFixed(1)}
                                </span>
                                <span>•</span>
                                <span className="uppercase">{movie.media_type}</span>
                            </div>
                        </div>

                        {/* Play Icon */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-red-600 p-3 rounded-full shadow-xl shadow-red-900/50">
                                <Play className="w-6 h-6 text-white fill-current ml-1" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {loading && (
                <div className="w-full py-12 flex justify-center">
                    <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
                </div>
            )}
        </div>
    </div>
  );
};
