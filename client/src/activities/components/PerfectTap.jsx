import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function PerfectTap({ activity, onComplete }) {
  const [target, setTarget] = useState(0);
  const [count, setCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameState, setGameState] = useState('ready'); // ready, playing, done

  useEffect(() => {
    if (gameState === 'ready') {
      const randomTarget = Math.floor(Math.random() * 15) + 10; // 10-25
      setTarget(randomTarget);
      setTimeLeft(5);
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'playing' && timeLeft === 0) {
      setGameState('done');
      setTimeout(() => onComplete(), 2000);
    }
  }, [gameState, timeLeft, onComplete]);

  const handleTap = () => {
    if (gameState === 'ready') {
      setGameState('playing');
    } else if (gameState === 'playing') {
      setCount(count + 1);
      if (count + 1 === target) {
        setGameState('done');
        setTimeout(() => onComplete(), 2000);
      }
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-900 to-teal-900">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md w-full text-center"
      >
        <h2 className="text-3xl font-bold mb-8 text-white">
          Perfect Tap 👆
        </h2>

        {gameState === 'ready' && (
          <div>
            <p className="text-xl text-white mb-6">
              Tap exactly <span className="font-bold text-2xl">{target}</span> times!
            </p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleTap}
              className="py-4 px-8 bg-green-500 text-white rounded-xl font-bold text-lg"
            >
              Start
            </motion.button>
          </div>
        )}

        {gameState === 'playing' && (
          <div>
            <p className="text-4xl font-bold text-white mb-4">{count} / {target}</p>
            <p className="text-white/70 mb-6">Time: {timeLeft}s</p>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleTap}
              className="w-full py-16 bg-green-500 text-white rounded-2xl font-bold text-3xl hover:bg-green-600 transition"
            >
              TAP!
            </motion.button>
          </div>
        )}

        {gameState === 'done' && (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            <p className="text-3xl font-bold text-white mb-2">
              {count === target ? '🎉 Perfect!' : `Got ${count}, needed ${target}`}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default PerfectTap;

