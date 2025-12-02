
import React from 'react';
import { NetworkProvider } from './context/NetworkContext';
import { Launcher } from './components/Launcher';

function App() {
  return (
    <NetworkProvider>
      <Launcher />
    </NetworkProvider>
  );
}

export default App;
