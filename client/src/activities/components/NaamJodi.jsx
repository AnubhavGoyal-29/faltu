import React, { useState } from 'react';
import { motion } from 'framer-motion';

const COMPATIBILITY_RESULTS = [
  "Perfect match! 🌟",
  "Good vibes! ✨",
  "Decent compatibility! 👍",
  "Interesting combo! 🤔",
  "Could work! 💫",
  "Surprising match! 🎯",
];

function NaamJodi({ activity, onComplete }) {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name1.trim() && name2.trim()) {
      const randomResult = COMPATIBILITY_RESULTS[
        Math.floor(Math.random() * COMPATIBILITY_RESULTS.length)
      ];
      setResult(randomResult);
      
      setTimeout(() => {
        onComplete();
      }, 2500);
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-pink-900 to-purple-900">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md w-full"
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-white">
          Naam Jodi 💕
        </h2>

        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              value={name1}
              onChange={(e) => setName1(e.target.value)}
              placeholder="First name"
              className="w-full py-4 px-4 rounded-xl bg-white/20 text-white placeholder-white/50 text-center text-lg focus:outline-none focus:bg-white/30"
              required
            />
            <div className="text-center text-white text-2xl">+</div>
            <input
              type="text"
              value={name2}
              onChange={(e) => setName2(e.target.value)}
              placeholder="Second name"
              className="w-full py-4 px-4 rounded-xl bg-white/20 text-white placeholder-white/50 text-center text-lg focus:outline-none focus:bg-white/30"
              required
            />
            <button
              type="submit"
              className="w-full py-4 bg-pink-500 text-white rounded-xl font-bold text-lg hover:bg-pink-600 transition"
            >
              Check Compatibility
            </button>
          </form>
        ) : (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-center"
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-4">
              <p className="text-2xl font-bold text-white mb-2">
                {name1} + {name2}
              </p>
              <p className="text-xl text-white/80">{result}</p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default NaamJodi;

