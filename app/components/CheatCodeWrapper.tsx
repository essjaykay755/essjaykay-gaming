'use client';

import { useState } from 'react';
import { CheatCode } from './CheatCode';
import { CheatActivationPopup } from './CheatActivationPopup';
import { useGame } from '../context/GameContext';

export function CheatCodeWrapper() {
  const { setGameSpeed } = useGame();
  const [activeCheat, setActiveCheat] = useState<string | null>(null);

  const handleCheatActivated = (cheat: string) => {
    if (cheat === 'FASTER') {
      setGameSpeed(4); // Change from 8x to 4x speed
      setActiveCheat('4x Game Speed');
    }
  };

  return (
    <>
      <CheatCode onCheatActivated={handleCheatActivated} />
      {activeCheat && <CheatActivationPopup cheatName={activeCheat} />}
    </>
  );
} 