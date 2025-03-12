'use client';

import { useEffect, useState } from 'react';

interface CheatActivationPopupProps {
  cheatName: string;
}

export function CheatActivationPopup({ cheatName }: CheatActivationPopupProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide the popup after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 left-8 bg-black bg-opacity-80 text-white p-4 rounded-sm font-mono animate-slide-in">
      <div className="text-sm opacity-80">Cheat activated:</div>
      <div className="text-xl font-bold">{cheatName}</div>
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
} 