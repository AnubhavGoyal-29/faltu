import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ACTIVITY_DESCRIPTIONS } from '../registry.js';

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
      setCount(prevCount => {
        const newCount = prevCount + 1;
        if (newCount === target) {
          setGameState('done');
          setTimeout(() => onComplete(), 2000);
        }
        return newCount;
      });
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-start pt-8 pb-16 px-6 bg-gradient-to-br from-[#0a0a0a] via-[#050a0a] to-[#0a0a0a] overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md w-full text-center"
      >
        <h2 className="text-3xl font-black mb-2">
          <span className="bg-gradient-to-r from-green-400 via-teal-500 to-cyan-500 bg-clip-text text-transparent">Perfect Tap</span> 👆
        </h2>
        <p className="text-center text-white/40 text-sm mb-6">
          {ACTIVITY_DESCRIPTIONS.perfect_tap}
        </p>

        {gameState === 'ready' && (
          <div>
            <p className="text-xl text-white/90 mb-6">
              Tap exactly <span className="font-bold text-2xl">{target}</span> times!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleTap}
              className="py-4 px-8 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-2xl font-bold text-lg hover:from-green-700 hover:to-teal-700 transition-all shadow-2xl shadow-green-500/30 hover:shadow-green-500/50"
            >
              Start
            </motion.button>
          </div>
        )}

        {gameState === 'playing' && (
          <div>
            <p className="text-4xl font-bold text-white/90 mb-4">{count} / {target}</p>
            <p className="text-white/60 mb-6">Time: {timeLeft}s</p>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleTap}
              className="w-full py-16 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-2xl font-bold text-3xl hover:from-green-700 hover:to-teal-700 transition-all shadow-2xl shadow-green-500/40 hover:shadow-green-500/60"
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
            <p className="text-3xl font-bold text-white/90 mb-2">
              {count === target ? '🎉 Perfect!' : `Got ${count}, needed ${target}`}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default PerfectTap;

