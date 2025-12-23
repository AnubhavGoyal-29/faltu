import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { generateAIContent, parseAIContent } from '../../utils/ai.js';
import { ACTIVITY_DESCRIPTIONS } from '../registry.js';

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
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    const loadChoice = async () => {
      try {
        // Try to generate AI choice pair
        const aiContent = await generateAIContent('ye_ya_wo');
        const parsed = parseAIContent(aiContent);
        
        if (parsed && typeof parsed === 'string') {
          // Parse "Option1, Option2" format
          const parts = parsed.split(',').map(s => s.trim());
          if (parts.length === 2) {
            setChoice({ left: parts[0], right: parts[1] });
          } else {
            throw new Error('Invalid format');
          }
        } else if (parsed && parsed.left && parsed.right) {
          setChoice(parsed);
        } else {
          throw new Error('Invalid format');
        }
      } catch (error) {
        console.error('Error generating choice:', error);
        // Fallback to hardcoded choices
        const randomChoice = CHOICES[Math.floor(Math.random() * CHOICES.length)];
        setChoice(randomChoice);
      } finally {
        setIsGenerating(false);
      }
    };

    loadChoice();
  }, []);

  const handleSelect = (side) => {
    if (selected) return;
    setSelected(side);
    
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  if (!choice || isGenerating) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-white/50">Loading choices...</div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col items-center justify-start pt-8 pb-16 px-6 bg-gradient-to-br from-[#0a0a0a] via-[#0a0a1a] to-[#0a0a0a] overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-md"
      >
        <h2 className="text-3xl font-black text-center mb-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Ye Ya Wo?
        </h2>
        <p className="text-center text-white/40 text-sm mb-10">
          {ACTIVITY_DESCRIPTIONS.ye_ya_wo}
        </p>

        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect('left')}
            disabled={selected}
            className={`flex-1 py-16 rounded-2xl font-bold text-2xl transition-all ${
              selected === 'left'
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-2xl shadow-green-500/30'
                : 'bg-white/10 backdrop-blur-lg text-white hover:bg-white/15 border border-white/10 shadow-lg'
            }`}
          >
            {choice.left}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect('right')}
            disabled={selected}
            className={`flex-1 py-16 rounded-2xl font-bold text-2xl transition-all ${
              selected === 'right'
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-2xl shadow-green-500/30'
                : 'bg-white/10 backdrop-blur-lg text-white hover:bg-white/15 border border-white/10 shadow-lg'
            }`}
          >
            {choice.right}
          </motion.button>
        </div>

        {selected && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-6 text-white/60 text-lg"
          >
            Nice choice! 🎯
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}

export default YeYaWo;

