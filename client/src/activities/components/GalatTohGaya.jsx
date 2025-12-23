import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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
    <div className="h-full w-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-red-900 to-orange-900">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md w-full"
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-white">
          Galat Toh Gaya ⭕
        </h2>

        <p className="text-center text-white/70 mb-6">
          Tap only the correct circles. One mistake = game over!
        </p>

        <div className="grid grid-cols-3 gap-4">
          {circles.map((_, index) => (
            <motion.button
              key={index}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleClick(index)}
              disabled={gameOver || clicked.includes(index)}
              className={`aspect-square rounded-full transition ${
                clicked.includes(index)
                  ? 'bg-green-500'
                  : index === correctIndex && !gameOver
                  ? 'bg-blue-500 hover:bg-blue-600'
                  : gameOver && index !== correctIndex
                  ? 'bg-red-500'
                  : 'bg-white/20 hover:bg-white/30'
              }`}
            />
          ))}
        </div>

        {gameOver && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-6 text-white text-xl font-bold"
          >
            {clicked.length === circles.length ? '🎉 Perfect!' : '❌ Game Over!'}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}

export default GalatTohGaya;

