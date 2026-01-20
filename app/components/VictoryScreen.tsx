export function VictoryScreen() {
  return (
    <div 
      className="fixed inset-0 bg-black flex flex-col items-center justify-center text-white font-['Press_Start_2P'] text-center z-50"
      style={{ 
        backgroundColor: '#000000',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh'
      }}
    >
      <div className="space-y-6 text-[8px] sm:text-base md:text-lg">
        <p className="text-lg sm:text-xl md:text-2xl">🎉 CONGRATULATIONS! 🎉</p>
        <p>You've successfully destroyed EssJayKay.dev</p>
        <p>by doing absolutely nothing...</p>
        <p>The paddles did all the work while you</p>
        <p>probably went to make Maggie.</p>
        <p>But hey, at least you stayed idle like a pro!</p>
        <p className="mt-12">- Subhojit Karmakar</p>
      </div>
    </div>
  );
} 