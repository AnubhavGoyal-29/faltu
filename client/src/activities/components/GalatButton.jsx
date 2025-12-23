import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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

  const handleSelect = (index) => {
    if (selected !== null) return;
    setSelected(index);
    const randomJudgment = JUDGMENTS[Math.floor(Math.random() * JUDGMENTS.length)];
    setJudgment(randomJudgment);
    
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-amber-900 to-yellow-900">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md w-full"
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-white">
          Galat Button 😏
        </h2>

        <div className="space-y-4">
          {[1, 2, 3].map((num) => (
            <motion.button
              key={num}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(num)}
              disabled={selected !== null}
              className={`w-full py-6 rounded-xl font-bold text-xl transition ${
                selected === num
                  ? 'bg-red-500'
                  : 'bg-white/20 hover:bg-white/30 text-white'
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
            className="text-center mt-6 text-white text-xl"
          >
            {judgment}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}

export default GalatButton;

