import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { generateAIContent } from '../../utils/ai.js';
import { ACTIVITY_DESCRIPTIONS } from '../registry.js';

const JUDGMENTS = [
  "You chose... poorly.",
  "Interesting choice...",
  "Hmm, okay.",
  "Really? That one?",
  "You do you.",
  "Bold move.",
];

function GalatButton({ activity, onComplete }) {
  const [selected, setSelected] = useState(null);
  const [judgment, setJudgment] = useState(null);

  const handleSelect = async (index) => {
    if (selected !== null) return;
    setSelected(index);
    
    try {
      // Try to generate AI judgment
      const aiJudgment = await generateAIContent('galat_button');
      if (aiJudgment && typeof aiJudgment === 'string') {
        setJudgment(aiJudgment);
      } else {
        // Fallback to hardcoded judgments
        const randomJudgment = JUDGMENTS[Math.floor(Math.random() * JUDGMENTS.length)];
        setJudgment(randomJudgment);
      }
    } catch (error) {
      console.error('Error generating judgment:', error);
      // Fallback to hardcoded judgments
      const randomJudgment = JUDGMENTS[Math.floor(Math.random() * JUDGMENTS.length)];
      setJudgment(randomJudgment);
    }
    
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-start pt-8 pb-16 px-6 bg-gradient-to-br from-[#0a0a0a] via-[#1a0a05] to-[#0a0a0a] overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md w-full"
      >
        <h2 className="text-3xl font-black text-center mb-2">
          <span className="bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 bg-clip-text text-transparent">Galat Button</span> 😏
        </h2>
        <p className="text-center text-white/40 text-sm mb-6">
          {ACTIVITY_DESCRIPTIONS.galat_button}
        </p>

        <div className="space-y-4">
          {[1, 2, 3].map((num) => (
            <motion.button
              key={num}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(num)}
              disabled={selected !== null}
              className={`w-full py-6 rounded-2xl font-bold text-xl transition-all ${
                selected === num
                  ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-2xl shadow-red-500/30'
                  : 'bg-white/10 backdrop-blur-lg hover:bg-white/15 text-white border border-white/10 shadow-lg'
              }`}
            >
              Button {num}
            </motion.button>
          ))}
        </div>

        {judgment && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-6 text-white/80 text-xl"
          >
            {judgment}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}

export default GalatButton;

