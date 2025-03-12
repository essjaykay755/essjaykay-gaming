'use client';

import { useEffect, useState } from 'react';

interface CheatCodeProps {
  onCheatActivated: (cheat: string) => void;
}

export function CheatCode({ onCheatActivated }: CheatCodeProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [input, setInput] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for tilde key (both with and without shift)
      if (e.key === '`' || e.key === '~') {
        e.preventDefault();
        setIsVisible(true);
      }
      // Check for Escape key to close
      if (e.key === 'Escape') {
        setIsVisible(false);
        setInput('');
      }
      // Check for Enter key to submit cheat
      if (e.key === 'Enter' && isVisible) {
        if (input.toUpperCase() === 'FASTER') {
          onCheatActivated('FASTER');
        }
        setIsVisible(false);
        setInput('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, input, onCheatActivated]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative w-full max-w-md">
        <div className="bg-black border-2 border-white p-4 text-white">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-transparent text-white text-2xl font-mono uppercase border-none outline-none"
            placeholder="ENTER CHEAT CODE"
            autoFocus
          />
          <div className="absolute bottom-[-24px] left-0 text-white text-sm opacity-70">
            Press ESC to close
          </div>
        </div>
      </div>
    </div>
  );
} 