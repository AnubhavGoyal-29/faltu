import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const DIALOGUES = [
  {
    dialogue: "Kitne aadmi the?",
    options: ["Sholay", "Dilwale", "3 Idiots"],
    answer: 0,
  },
  {
    dialogue: "Mogambo khush hua",
    options: ["Mr. India", "Don", "Agneepath"],
    answer: 0,
  },
  {
    dialogue: "All is well",
    options: ["3 Idiots", "PK", "Zindagi Na Milegi Dobara"],
    answer: 0,
  },
];

function Dialogbaazi({ activity, onComplete }) {
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const randomQ = DIALOGUES[Math.floor(Math.random() * DIALOGUES.length)];
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
    <div className="h-full w-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-rose-900 to-pink-900">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md w-full"
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-white">
          Dialogbaazi 🎬
        </h2>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-6">
          <p className="text-xl text-white text-center italic">
            "{question.dialogue}"
          </p>
        </div>

        <div className="space-y-4">
          {question.options.map((opt, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(idx)}
              disabled={selected !== null}
              className={`w-full py-4 rounded-xl font-bold text-lg transition ${
                selected === idx
                  ? selected === question.answer
                    ? 'bg-green-500'
                    : 'bg-red-500'
                  : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
            >
              {opt}
            </motion.button>
          ))}
        </div>

        {selected !== null && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-6 text-white text-xl font-bold"
          >
            {selected === question.answer ? '🎉 Sahi!' : '❌ Galat!'}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}

export default Dialogbaazi;

