import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CHOICES = [
  { left: "Pizza", right: "Burger" },
  { left: "Summer", right: "Winter" },
  { left: "Beach", right: "Mountains" },
  { left: "Coffee", right: "Tea" },
  { left: "Cats", right: "Dogs" },
  { left: "Netflix", right: "YouTube" },
  { left: "Morning", right: "Night" },
  { left: "Sweet", right: "Spicy" },
  { left: "City", right: "Village" },
  { left: "Books", right: "Movies" },
];

function YeYaWo({ activity, onComplete }) {
  const [choice, setChoice] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const randomChoice = CHOICES[Math.floor(Math.random() * CHOICES.length)];
    setChoice(randomChoice);
  }, []);

  const handleSelect = (side) => {
    if (selected) return;
    setSelected(side);
    
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  if (!choice) return null;

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-900 to-purple-900">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center mb-12 text-white">
          Ye Ya Wo?
        </h2>

        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect('left')}
            disabled={selected}
            className={`flex-1 py-16 rounded-2xl font-bold text-2xl transition ${
              selected === 'left'
                ? 'bg-green-500 text-white'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            {choice.left}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect('right')}
            disabled={selected}
            className={`flex-1 py-16 rounded-2xl font-bold text-2xl transition ${
              selected === 'right'
                ? 'bg-green-500 text-white'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            {choice.right}
          </motion.button>
        </div>

        {selected && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-6 text-white/70 text-lg"
          >
            Nice choice! 🎯
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}

export default YeYaWo;

