
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { NetworkMode } from '../types';

interface NetworkContextType {
  mode: NetworkMode;
  setMode: (mode: NetworkMode) => void;
  transport: (url: string) => string;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

// Configuration for the "School Mode" Proxy
// In a real deployment, this would be your Doge/Ultraviolet endpoint
const PROXY_BASE_URL = 'https://search.doge.network/service/'; 

export const NetworkProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<NetworkMode>('LOCKED');

  // The Traffic Controller
  const transport = (url: string): string => {
    if (mode === 'HOME' || mode === 'LOCKED') {
      return url;
    }

    // SCHOOL MODE: Logic to route through proxy
    // Simple encoding for demonstration. Complex proxies often use XOR.
    if (mode === 'SCHOOL') {
      // If it's already a relative path or data URL, ignore
      if (url.startsWith('/') || url.startsWith('data:')) return url;
      
      // Basic Ultraviolet/Doge style wrapping
      const encoded = encodeURIComponent(url);
      return `${PROXY_BASE_URL}${encoded}`;
    }

    return url;
  };

  return (
    <NetworkContext.Provider value={{ mode, setMode, transport }}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};
