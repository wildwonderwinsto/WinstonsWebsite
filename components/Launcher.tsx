
import React, { useState } from 'react';
import { useNetwork } from '../context/NetworkContext';
import { NetworkMode, ViewState } from '../types';
import { WinstonStreams } from './WinstonStreams';
import { WinstonSearches } from './WinstonSearches';
import { Monitor, Globe, Shield, Lock, Wifi, WifiOff } from 'lucide-react';

export const Launcher: React.FC = () => {
  const { mode, setMode } = useNetwork();
  const [view, setView] = useState<ViewState>('LAUNCHER');

  // If a sub-app is open, render it instead
  if (view === 'STREAMS') return <WinstonStreams />;
  if (view === 'SEARCHES') return <WinstonSearches />;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center relative overflow-x-hidden selection:bg-white/20">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Content Container */}
      <div className="z-10 w-full max-w-5xl px-6 py-12 flex flex-col items-center flex-grow justify-center space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4">
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter">
                WINSTON<span className="text-zinc-600">V2</span>
            </h1>
            <p className="text-zinc-500 font-mono text-sm tracking-[0.2em] uppercase">
                Secure Environment Launcher
            </p>
        </div>

        {/* The Toggle System */}
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 p-2 rounded-2xl flex items-center relative w-[320px] h-[60px] shadow-2xl">
            {/* Sliding Indicator */}
            <div 
                className={`absolute top-2 bottom-2 w-[calc(33.33%-8px)] bg-zinc-800 rounded-xl shadow-inner transition-all duration-300 ease-out border border-white/5
                ${mode === 'HOME' ? 'left-2 bg-gradient-to-br from-green-500/20 to-green-900/20 border-green-500/30' : ''}
                ${mode === 'LOCKED' ? 'left-1/2 -translate-x-1/2 bg-zinc-800' : ''}
                ${mode === 'SCHOOL' ? 'left-[calc(66.66%+4px)] bg-gradient-to-br from-red-500/20 to-red-900/20 border-red-500/30' : ''}
                `}
            />

            <button onClick={() => setMode('HOME')} className="flex-1 relative z-10 flex justify-center items-center text-zinc-400 hover:text-white transition group">
                <Wifi className={`w-5 h-5 ${mode === 'HOME' ? 'text-green-400' : ''}`} />
            </button>
            <button onClick={() => setMode('LOCKED')} className="flex-1 relative z-10 flex justify-center items-center text-zinc-400 hover:text-white transition">
                {mode === 'LOCKED' ? <Lock className="w-5 h-5 text-zinc-300" /> : <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />}
            </button>
            <button onClick={() => setMode('SCHOOL')} className="flex-1 relative z-10 flex justify-center items-center text-zinc-400 hover:text-white transition">
                <Shield className={`w-5 h-5 ${mode === 'SCHOOL' ? 'text-red-400' : ''}`} />
            </button>
        </div>

        {/* App Cards - Disabled if LOCKED */}
        <div className={`grid md:grid-cols-2 gap-8 w-full transition-all duration-500 ${mode === 'LOCKED' ? 'opacity-30 pointer-events-none blur-sm' : 'opacity-100 blur-0'}`}>
            
            {/* Streams Card */}
            <div 
                onClick={() => setView('STREAMS')}
                className="group relative bg-zinc-900/40 border border-zinc-800 hover:border-red-500/50 rounded-3xl p-8 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:bg-zinc-900/60 overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-900/20">
                        <Monitor className="text-white w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-2">WinstonStreams</h3>
                        <p className="text-zinc-500 text-sm">Access the global TMDB database. Features infinite scroll, filters, and high-speed playback.</p>
                    </div>
                    <span className="text-red-400 text-xs font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">Launch Application &rarr;</span>
                </div>
            </div>

            {/* Searches Card */}
            <div 
                onClick={() => setView('SEARCHES')}
                className="group relative bg-zinc-900/40 border border-zinc-800 hover:border-blue-500/50 rounded-3xl p-8 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:bg-zinc-900/60 overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-900/20">
                        <Globe className="text-white w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-2">WinstonSearches</h3>
                        <p className="text-zinc-500 text-sm">Secure browser environment. Supports direct URL entry and keyword search with proxy injection.</p>
                    </div>
                    <span className="text-blue-400 text-xs font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">Launch Application &rarr;</span>
                </div>
            </div>
        </div>
        
      </div>

      {/* Status Footer - Pushed to bottom */}
      <div className="py-6 font-mono text-xs text-zinc-600 z-10">
            STATUS: {mode === 'LOCKED' ? 'AWAITING_INPUT' : 'SYSTEM_READY'} // MODE: {mode}
      </div>

    </div>
  );
};
