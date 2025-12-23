import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { generateAIContent } from '../../utils/ai.js';

function NumberDhoondo({ activity, onComplete }) {
  const [target, setTarget] = useState(0);
  const [hint, setHint] = useState('');
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState(3);
  const [result, setResult] = useState(null);
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    const loadNumber = async () => {
      const num = Math.floor(Math.random() * 100) + 1;
      setTarget(num);
      
      try {
        // Try to generate AI hint
        const aiHint = await generateAIContent('number_dhoondo', { number: num });
        if (aiHint && typeof aiHint === 'string') {
          setHint(aiHint);
        } else {
          // Fallback to simple range hints
          if (num < 33) {
            setHint('Between 1-33');
          } else if (num < 66) {
            setHint('Between 34-66');
          } else {
            setHint('Between 67-100');
          }
        }
      } catch (error) {
        console.error('Error generating hint:', error);
        // Fallback to simple range hints
        if (num < 33) {
          setHint('Between 1-33');
        } else if (num < 66) {
          setHint('Between 34-66');
        } else {
          setHint('Between 67-100');
        }
      } finally {
        setIsGenerating(false);
      }
    };

    loadNumber();
  }, []);

  const handleGuess = () => {
    if (!guess.trim()) return;
    
    const userGuess = parseInt(guess);
    if (userGuess === target) {
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

  if (!target || isGenerating) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-white/50">Generating hint...</div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-900 to-blue-900">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md w-full"
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-white">
          Number Dhoondo 🔢
        </h2>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-6 text-center">
          <p className="text-xl text-white mb-2">Hint: {hint}</p>
          <p className="text-white/70 text-sm">Attempts: {attempts}</p>
        </div>

        {!result && (
          <div>
            <input
              type="number"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
              placeholder="Guess (1-100)"
              className="w-full py-4 px-4 rounded-xl bg-white/20 text-white placeholder-white/50 text-center text-lg mb-4 focus:outline-none focus:bg-white/30"
            />
            <button
              onClick={handleGuess}
              className="w-full py-4 bg-indigo-500 text-white rounded-xl font-bold text-lg hover:bg-indigo-600 transition"
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
            {result === 'win' ? '🎉 Sahi!' : `Answer: ${target}`}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}

export default NumberDhoondo;

