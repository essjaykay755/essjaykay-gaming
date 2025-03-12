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
      setGameSpeed(4); // 4x speed
      setActiveCheat('4x Game Speed');
    } else if (cheat === 'FASTEST') {
      setGameSpeed(8); // 8x speed
      setActiveCheat('8x Game Speed');
    }
  };

  return (
    <>
      <CheatCode onCheatActivated={handleCheatActivated} />
      {activeCheat && <CheatActivationPopup cheatName={activeCheat} />}
    </>
  );
} 