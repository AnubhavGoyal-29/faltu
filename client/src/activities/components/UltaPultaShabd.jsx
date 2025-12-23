import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const WORDS = [
  { scrambled: "HALP", answer: "PHAL" },
  { scrambled: "KAMAB", answer: "KAMAB" },
  { scrambled: "RATAP", answer: "PATAR" },
  { scrambled: "MALG", answer: "GALM" },
];

function UltaPultaShabd({ activity, onComplete }) {
  const [word, setWord] = useState(null);
  const [guess, setGuess] = useState('');
  const [timeLeft, setTimeLeft] = useState(15);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setWord(randomWord);
  }, []);

  useEffect(() => {
    if (word && !result) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setResult('timeup');
            setTimeout(() => onComplete(), 2000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [word, result, onComplete]);

  const handleGuess = () => {
    if (!guess.trim()) return;
    
    if (guess.toUpperCase() === word.answer) {
      setResult('win');
      setTimeout(() => onComplete(), 2000);
    } else {
      setGuess('');
    }
  };

  if (!word) return null;

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-violet-900 to-purple-900">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md w-full"
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-white">
          Ulta-Pulta Shabd 🔤
        </h2>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-6 text-center">
          <p className="text-4xl font-bold text-white mb-4">
            {word.scrambled}
          </p>
          <p className="text-white/70">Time: {timeLeft}s</p>
        </div>

        {!result && (
          <div>
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
              placeholder="Unscramble"
              className="w-full py-4 px-4 rounded-xl bg-white/20 text-white placeholder-white/50 text-center text-lg mb-4 focus:outline-none focus:bg-white/30"
            />
            <button
              onClick={handleGuess}
              className="w-full py-4 bg-violet-500 text-white rounded-xl font-bold text-lg hover:bg-violet-600 transition"
            >
              Check
            </button>
          </div>
        )}

        {result && (
          <motion.p
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-center text-2xl font-bold text-white"
          >
            {result === 'win' ? '🎉 Sahi!' : `Answer: ${word.answer}`}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}

export default UltaPultaShabd;

