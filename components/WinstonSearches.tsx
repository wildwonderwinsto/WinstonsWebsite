
import React, { useState } from 'react';
import { useNetwork } from '../context/NetworkContext';
import { Search, Globe, ShieldCheck } from 'lucide-react';

export const WinstonSearches: React.FC = () => {
  const { transport, mode } = useNetwork();
  const [url, setUrl] = useState('');
  const [activeUrl, setActiveUrl] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    let target = url;
    // Basic search engine logic if not a direct URL
    if (!url.includes('.') || url.includes(' ')) {
        target = `https://www.google.com/search?q=${encodeURIComponent(url)}&igu=1`;
    } else if (!url.startsWith('http')) {
        target = `https://${url}`;
    }

    setActiveUrl(transport(target));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
        {/* Header */}
        <div className="bg-slate-900/80 backdrop-blur-md border-b border-blue-500/20 px-6 py-4 flex items-center justify-between z-20 shadow-lg shadow-blue-900/5">
            <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
                <Globe className="text-blue-500" />
                WINSTON<span className="text-blue-400">SEARCHES</span>
            </h1>

            <div className="flex items-center gap-2">
                <div className={`px-2 py-1 rounded text-[10px] font-mono uppercase tracking-wider border ${mode === 'SCHOOL' ? 'border-green-500 text-green-400 bg-green-900/20' : 'border-zinc-700 text-zinc-500'}`}>
                    {mode === 'SCHOOL' ? 'SECURE_TUNNEL' : 'DIRECT_LINK'}
                </div>
            </div>
        </div>

        {/* Search Input Area */}
        {!activeUrl ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in duration-500">
                <div className="w-full max-w-2xl text-center space-y-8">
                    <div className="inline-block p-4 rounded-full bg-blue-500/10 mb-4 ring-1 ring-blue-500/50 shadow-[0_0_50px_-12px_rgba(59,130,246,0.5)]">
                        <Globe className="w-16 h-16 text-blue-500" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                        Where to today?
                    </h2>
                    
                    <form onSubmit={handleSearch} className="relative group">
                        <input 
                            type="text" 
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="Search Google or type a URL..."
                            className="w-full bg-slate-900/50 border-2 border-slate-800 rounded-2xl py-5 pl-14 pr-6 text-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all shadow-2xl"
                            autoFocus
                        />
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 w-6 h-6 group-focus-within:text-blue-500 transition-colors" />
                    </form>

                    <p className="text-slate-500 text-sm">
                        {mode === 'SCHOOL' 
                            ? "Traffic is encrypted and routed through the Winston secure node." 
                            : "Standard browsing mode active."}
                    </p>
                </div>
            </div>
        ) : (
            /* Browser Frame */
            <div className="flex-1 relative bg-white">
                <iframe 
                    src={activeUrl} 
                    className="absolute inset-0 w-full h-full border-0"
                    title="Browser"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
                <button 
                    onClick={() => setActiveUrl(null)}
                    className="absolute bottom-6 right-6 bg-blue-600 text-white px-6 py-3 rounded-full shadow-xl hover:bg-blue-700 transition font-bold z-50 flex items-center gap-2"
                >
                    <Search className="w-4 h-4" /> New Search
                </button>
            </div>
        )}
    </div>
  );
};
