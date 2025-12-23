import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ACTIVITY_DESCRIPTIONS } from '../registry.js';

function GalatTohGaya({ activity, onComplete }) {
  const [circles, setCircles] = useState([]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [clicked, setClicked] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const count = 9;
    const correct = Math.floor(Math.random() * count);
    setCorrectIndex(correct);
    setCircles(Array(count).fill(false));
  }, []);

  const handleClick = (index) => {
    if (gameOver || clicked.includes(index)) return;
    
    if (index === correctIndex) {
      const newClicked = [...clicked, index];
      setClicked(newClicked);
      
      if (newClicked.length === circles.length) {
        setGameOver(true);
        setTimeout(() => onComplete(), 2000);
      } else {
        // Generate new correct index
        const remaining = circles.map((_, i) => i).filter(i => !newClicked.includes(i));
        setCorrectIndex(remaining[Math.floor(Math.random() * remaining.length)]);
      }
    } else {
      setGameOver(true);
      setTimeout(() => onComplete(), 2000);
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-start pt-8 pb-16 px-6 bg-gradient-to-br from-[#0a0a0a] via-[#1a0505] to-[#0a0a0a] overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md w-full"
      >
        <h2 className="text-3xl font-black text-center mb-2">
          <span className="bg-gradient-to-r from-red-400 via-orange-500 to-red-500 bg-clip-text text-transparent">Galat Toh Gaya</span> ⭕
        </h2>
        <p className="text-center text-white/40 text-sm mb-6">
          {ACTIVITY_DESCRIPTIONS.galat_toh_gaya}
        </p>

        <p className="text-center text-white/60 mb-6">
          Tap only the correct circles. One mistake = game over!
        </p>

        <div className="grid grid-cols-3 gap-4">
          {circles.map((_, index) => (
            <motion.button
              key={index}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleClick(index)}
              disabled={gameOver || clicked.includes(index)}
              className={`aspect-square rounded-full transition-all shadow-lg ${
                clicked.includes(index)
                  ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-2xl shadow-green-500/40'
                  : index === correctIndex && !gameOver
                  ? 'bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-2xl shadow-blue-500/40'
                  : gameOver && index !== correctIndex
                  ? 'bg-gradient-to-br from-red-500 to-pink-600 shadow-2xl shadow-red-500/40'
                  : 'bg-white/10 backdrop-blur-lg hover:bg-white/15 border border-white/10'
              }`}
            />
          ))}
        </div>

        {gameOver && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-6 text-white/90 text-xl font-bold"
          >
            {clicked.length === circles.length ? '🎉 Perfect!' : '❌ Game Over!'}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}

export default GalatTohGaya;

