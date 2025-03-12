'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface GameContextType {
  gameSpeed: number;
  setGameSpeed: (speed: number) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameSpeed, setGameSpeed] = useState(1); // Default speed is 1x

  return (
    <GameContext.Provider value={{ gameSpeed, setGameSpeed }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
} 