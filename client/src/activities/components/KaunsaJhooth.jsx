import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const STATEMENTS = [
  {
    statements: [
      "The Great Wall of China is visible from space.",
      "Humans use 100% of their brain capacity.",
      "Bats are blind.",
    ],
    fakeIndex: 0,
  },
  {
    statements: [
      "Sharks can't get cancer.",
      "Goldfish have a 3-second memory.",
      "Humans have five senses.",
    ],
    fakeIndex: 1,
  },
  {
    statements: [
      "Chameleons change color to match their surroundings.",
      "Dogs can't see in color.",
      "The human body has 206 bones.",
    ],
    fakeIndex: 0,
  },
];

function KaunsaJhooth({ activity, onComplete }) {
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const randomQ = STATEMENTS[Math.floor(Math.random() * STATEMENTS.length)];
    setQuestion(randomQ);
  }, []);

  const handleSelect = (index) => {
    if (selected !== null) return;
    setSelected(index);
    
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  if (!question) return null;

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-red-900 to-pink-900">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md w-full"
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-white">
          Kaunsa Jhooth? 🤔
        </h2>

        <div className="space-y-4">
          {question.statements.map((stmt, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(idx)}
              disabled={selected !== null}
              className={`w-full p-6 rounded-xl text-left transition ${
                selected === idx
                  ? selected === question.fakeIndex
                    ? 'bg-green-500'
                    : 'bg-red-500'
                  : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              <p className="text-white text-lg">{stmt}</p>
            </motion.button>
          ))}
        </div>

        {selected !== null && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-6 text-white text-xl font-bold"
          >
            {selected === question.fakeIndex ? '🎉 Sahi!' : '❌ Galat!'}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}

export default KaunsaJhooth;

