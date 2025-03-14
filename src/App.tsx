import React, { useState, useEffect, useCallback } from 'react';
import { Timer, Zap, Medal } from 'lucide-react';
import AttemptHistory from './AttemptHistory';
import GridDistortion from './GridDistortion';




type GameState = 'idle' | 'waiting' | 'ready' | 'clicked';

function App() {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [startTime, setStartTime] = useState<number>(0);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [attempts, setAttempts] = useState<number[]>([]);

  const getFeedback = (time: number) => {
    if (time < 200) return { text: 'Lightning Fast! 🚀', color: 'text-purple-600' };
    if (time < 300) return { text: 'Super Quick! ⚡', color: 'text-green-600' };
    if (time < 400) return { text: 'Great! 👍', color: 'text-blue-600' };
    if (time < 500) return { text: 'Good 👌', color: 'text-yellow-600' };
    return { text: 'Keep Practicing! 💪', color: 'text-red-600' };
  };

  const startGame = useCallback(() => {
    setGameState('waiting');
    setReactionTime(null);
    const delay = Math.floor(Math.random() * 3000) + 2000; // Random delay between 2-5 seconds
    setCountdown(Math.ceil(delay / 1000));

    const countdownInterval = setInterval(() => {
      setCountdown(prev => prev !== null ? prev - 1 : null);
    }, 1000);

    const timer = setTimeout(() => {
      setGameState('ready');
      setStartTime(Date.now());
      clearInterval(countdownInterval);
    }, delay);

    return () => {
      clearTimeout(timer);
      clearInterval(countdownInterval);
    };
  }, []);

  const handleClick = () => {
    if (gameState === 'ready') {
      const time = Date.now() - startTime;
      setReactionTime(time);
      if (!bestTime || time < bestTime) {
        setBestTime(time);
      }
      setAttempts(prev => [time, ...prev.slice(0, 4)]);
      setGameState('clicked');
    } else if (gameState === 'waiting') {
      setGameState('clicked');
      setReactionTime(-1); // Indicates a too early click
      setAttempts(prev => [-1, ...prev.slice(0, 4)]);
    }
  };

  useEffect(() => {
    if (gameState === 'waiting') {
      return startGame();
    }
  }, [gameState === 'waiting', startGame]);

  const getBackgroundColor = () => {
    switch (gameState) {
      case 'idle':
        return 'bg-gray-200';
      case 'waiting':
        return 'bg-yellow-300';
      case 'ready':
        return 'bg-green-400';
      case 'clicked':
        return 'bg-blue-400';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    

    <div 
      className={`min-h-screen ${getBackgroundColor()} transition-colors duration-300 flex items-center justify-center`}
      onClick={gameState === 'ready' || gameState === 'waiting' ? handleClick : undefined}
      
    >
      
      <div className="max-w-md w-full mx-6">
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
        
          <h1 className="text-3xl font-bold text-center text-gray-800 flex items-center justify-center gap-2">
            <Zap className="w-8 h-8 text-yellow-500" />
            Reaction Speed Test
          </h1>

          <div className="space-y-4">
            {gameState === 'idle' && (
              <button
                onClick={() => setGameState('waiting')}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                Start Test
              </button>
            )}

            {gameState === 'waiting' && (
              <div className="text-center space-y-2">
                <Timer className="w-12 h-12 mx-auto text-yellow-500 animate-pulse" />
                <p className="text-xl font-semibold text-gray-700">Wait for green...</p>
                
              </div>
            )}

            {gameState === 'ready' && (
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600 animate-bounce">CLICK NOW!</p>
              </div>
            )}

            {gameState === 'clicked' && (
              <div className="space-y-4 text-center">
                {reactionTime === -1 ? (
                  <p className="text-xl font-semibold text-red-600">Too early! Try again.</p>
                ) : (
                  <>
                    <p className="text-4xl font-bold">{reactionTime}ms</p>
                    <p className={`text-xl font-semibold ${getFeedback(reactionTime!).color}`}>
                      {getFeedback(reactionTime!).text}
                    </p>
                  </>
                )}
                <button
                  onClick={() => setGameState('waiting')}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {bestTime && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-center gap-2 text-lg font-semibold text-gray-700">
                  <Medal className="w-5 h-5 text-yellow-500" />
                  Best Time: <span className="text-yellow-600">{bestTime}ms</span>
                </div>
              </div>
            )}

            <AttemptHistory attempts={attempts} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;