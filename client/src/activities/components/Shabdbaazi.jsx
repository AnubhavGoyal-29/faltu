import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const WORDS = [
  { word: "CHUTKULA", hint: "Funny thing", answer: "CHUTKULA" },
  { word: "JUGAAD", hint: "Creative solution", answer: "JUGAAD" },
  { word: "FIRANGI", hint: "Foreigner", answer: "FIRANGI" },
  { word: "BHAI", hint: "Brother/friend", answer: "BHAI" },
];

function Shabdbaazi({ activity, onComplete }) {
  const [word, setWord] = useState(null);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState(3);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setWord(randomWord);
  }, []);

  const handleGuess = () => {
    if (!guess.trim()) return;
    
    if (guess.toUpperCase() === word.answer) {
      setResult('win');
      setTimeout(() => onComplete(), 2000);
    } else {
      setAttempts(attempts - 1);
      if (attempts - 1 === 0) {
        setResult('lose');
        setTimeout(() => onComplete(), 2000);
      }
      setGuess('');
    }
  };

  if (!word) return null;

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-cyan-900 to-blue-900">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md w-full"
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-white">
          Shabdbaazi 📝
        </h2>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-6">
          <p className="text-center text-white/70 mb-4">Hint: {word.hint}</p>
          <p className="text-center text-white text-2xl font-bold mb-4">
            {word.word.split('').map((char, i) => (
              <span key={i} className="mx-1">{char}</span>
            ))}
          </p>
          <p className="text-center text-white/50 text-sm">
            Attempts left: {attempts}
          </p>
        </div>

        {!result && (
          <div>
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
              placeholder="Guess the word"
              className="w-full py-4 px-4 rounded-xl bg-white/20 text-white placeholder-white/50 text-center text-lg mb-4 focus:outline-none focus:bg-white/30"
            />
            <button
              onClick={handleGuess}
              className="w-full py-4 bg-cyan-500 text-white rounded-xl font-bold text-lg hover:bg-cyan-600 transition"
            >
              Guess
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

export default Shabdbaazi;

