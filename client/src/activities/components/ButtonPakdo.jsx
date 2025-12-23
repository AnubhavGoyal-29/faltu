import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function ButtonPakdo({ activity, onComplete }) {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [timeLeft, setTimeLeft] = useState(5);
  const [caught, setCaught] = useState(false);
  const [gameState, setGameState] = useState('ready');

  useEffect(() => {
    if (gameState === 'playing' && !caught) {
      const moveInterval = setInterval(() => {
        setPosition({
          x: Math.random() * 80 + 10,
          y: Math.random() * 70 + 15,
        });
      }, 800);

      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameState('done');
            setTimeout(() => onComplete(), 2000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearInterval(moveInterval);
        clearInterval(timer);
      };
    }
  }, [gameState, caught, onComplete]);

  const handleStart = () => {
    setGameState('playing');
  };

  const handleCatch = () => {
    if (gameState === 'playing' && !caught) {
      setCaught(true);
      setGameState('done');
      setTimeout(() => onComplete(), 2000);
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-900 to-indigo-900 relative overflow-hidden">
      {gameState === 'ready' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-8 text-white">
            Button Pakdo! 🎯
          </h2>
          <button
            onClick={handleStart}
            className="py-4 px-8 bg-purple-500 text-white rounded-xl font-bold text-lg"
          >
            Start
          </button>
        </motion.div>
      )}

      {gameState === 'playing' && (
        <>
          <div className="absolute top-6 left-6 text-white text-2xl font-bold">
            {timeLeft}s
          </div>
          <motion.button
            animate={{
              x: `${position.x}%`,
              y: `${position.y}%`,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={handleCatch}
            className="absolute py-6 px-8 bg-yellow-400 text-black rounded-xl font-bold text-lg hover:bg-yellow-500 transition"
            style={{
              transform: 'translate(-50%, -50%)',
            }}
          >
            Catch Me!
          </motion.button>
        </>
      )}

      {gameState === 'done' && (
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-white">
            {caught ? '🎉 Caught!' : '⏰ Time Up!'}
          </h2>
        </motion.div>
      )}
    </div>
  );
}

export default ButtonPakdo;

