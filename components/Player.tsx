
import React, { useState, useEffect } from 'react';
import { X, Server, MonitorPlay } from 'lucide-react';
import { Movie } from '../types';
import { useNetwork } from '../context/NetworkContext';
import { getTVSeasons } from '../services/tmdb';

interface PlayerProps {
  media: Movie;
  onClose: () => void;
}

export const Player: React.FC<PlayerProps> = ({ media, onClose }) => {
  const { transport } = useNetwork();
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [seasonsData, setSeasonsData] = useState<any[]>([]);
  const [server, setServer] = useState<'vidsrc' | 'vidlink'>('vidlink');

  // Load TV Details if needed
  useEffect(() => {
    if (media.media_type === 'tv') {
      getTVSeasons(media.id).then((data) => {
        if (data.seasons) {
            setSeasonsData(data.seasons.filter((s: any) => s.season_number > 0));
        }
      });
    }
  }, [media.id, media.media_type]);

  // Construct URL based on Server choice
  const getEmbedUrl = () => {
    const isTv = media.media_type === 'tv';
    let base = '';

    if (server === 'vidsrc') {
      base = `https://vidsrc.to/embed/${isTv ? `tv/${media.id}/${season}/${episode}` : `movie/${media.id}`}`;
    } else {
      base = `https://vidlink.pro/${isTv ? 'tv' : 'movie'}/${media.id}${isTv ? `?season=${season}&episode=${episode}` : ''}`;
    }

    return transport(base);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-zinc-900/90 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition">
                <X className="w-6 h-6 text-white" />
            </button>
            <div>
                <h2 className="text-xl font-bold text-white max-w-md truncate">{media.title || media.name}</h2>
                <p className="text-sm text-zinc-400">
                    {media.media_type === 'tv' ? `S${season}:E${episode}` : 'Movie'} • {server.toUpperCase()}
                </p>
            </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
            {/* Server Switch */}
            <div className="flex items-center gap-2 bg-black/50 rounded-lg p-1 border border-white/5">
                <button 
                    onClick={() => setServer('vidlink')}
                    className={`px-3 py-1 rounded text-xs font-medium transition ${server === 'vidlink' ? 'bg-red-600 text-white shadow-lg' : 'text-zinc-400 hover:text-white'}`}
                >
                    VIDLINK
                </button>
                <button 
                    onClick={() => setServer('vidsrc')}
                    className={`px-3 py-1 rounded text-xs font-medium transition ${server === 'vidsrc' ? 'bg-red-600 text-white shadow-lg' : 'text-zinc-400 hover:text-white'}`}
                >
                    VIDSRC
                </button>
            </div>

            {/* TV Controls */}
            {media.media_type === 'tv' && (
                <div className="flex gap-2">
                    <select 
                        value={season}
                        onChange={(e) => setSeason(Number(e.target.value))}
                        className="bg-zinc-800 text-white text-sm rounded px-3 py-2 border border-white/10 outline-none focus:border-red-500"
                    >
                        {seasonsData.map((s) => (
                            <option key={s.id} value={s.season_number}>Season {s.season_number}</option>
                        ))}
                    </select>
                    <input 
                        type="number" 
                        min={1}
                        value={episode}
                        onChange={(e) => setEpisode(Number(e.target.value))}
                        className="bg-zinc-800 text-white text-sm rounded px-3 py-2 border border-white/10 outline-none w-20 focus:border-red-500 text-center"
                    />
                </div>
            )}
        </div>
      </div>

      {/* Iframe Container */}
      <div className="flex-1 relative bg-black w-full h-full overflow-hidden">
        <iframe
            src={getEmbedUrl()}
            className="w-full h-full border-0 absolute inset-0"
            allowFullScreen
            scrolling="no"
            referrerPolicy="origin"
            title="Video Player"
        />
      </div>
    </div>
  );
};
