import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ACTIVITY_DESCRIPTIONS } from '../registry.js';

function NumberDhoondo({ activity, onComplete }) {
  const [target, setTarget] = useState(0);
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState('');
  const [attemptCount, setAttemptCount] = useState(0);
  const [result, setResult] = useState(null);

  useEffect(() => {
    // Generate random number between 1-100
    const num = Math.floor(Math.random() * 100) + 1;
    setTarget(num);
  }, []);

  const handleGuess = () => {
    if (!guess.trim()) return;
    
    const userGuess = parseInt(guess);
    
    // Validate input
    if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
      setFeedback('Please enter a number between 1 and 100');
      return;
    }
    
    setAttemptCount(prev => prev + 1);
    
    if (userGuess === target) {
      setResult('win');
      setFeedback(`🎉 Correct! The number was ${target}!`);
      setTimeout(() => onComplete(), 2000);
    } else if (userGuess > target) {
      setFeedback(`${userGuess} is too high!`);
      setGuess('');
    } else {
      setFeedback(`${userGuess} is too low!`);
      setGuess('');
    }
  };

  if (!target) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-white/50">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col items-center justify-start pt-8 pb-16 px-6 bg-gradient-to-br from-[#0a0a0a] via-[#0a0a1a] to-[#0a0a0a] overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md w-full"
      >
        <h2 className="text-3xl font-black text-center mb-2">
          <span className="bg-gradient-to-r from-indigo-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">Number Dhoondo</span> 🔢
        </h2>
        <p className="text-center text-white/40 text-sm mb-6">
          {ACTIVITY_DESCRIPTIONS.number_dhoondo}
        </p>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 mb-6 text-center border border-white/10">
          <p className="text-xl text-white/90 mb-2">Guess a number between 1-100</p>
          {attemptCount > 0 && (
            <p className="text-white/60 text-sm">Attempts: {attemptCount}</p>
          )}
        </div>

        {/* Feedback message */}
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-center"
          >
            <p className={`text-xl font-semibold ${
              result === 'win' 
                ? 'text-green-400' 
                : feedback.includes('too high')
                ? 'text-red-400'
                : feedback.includes('too low')
                ? 'text-blue-400'
                : 'text-yellow-400'
            }`}>
              {feedback}
            </p>
          </motion.div>
        )}

        {!result && (
          <div>
            <input
              type="number"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
              placeholder="Enter your guess (1-100)"
              min="1"
              max="100"
              className="w-full py-4 px-4 rounded-2xl bg-white/10 backdrop-blur-lg text-white placeholder-white/50 text-center text-lg mb-4 focus:outline-none focus:bg-white/15 focus:ring-2 focus:ring-indigo-500/50 border border-white/10"
              autoFocus
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGuess}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50"
            >
              Guess
            </motion.button>
          </div>
        )}

        {result === 'win' && (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-center mt-4"
          >
            <p className="text-2xl font-bold text-green-400">
              🎉 Perfect! You found it in {attemptCount} {attemptCount === 1 ? 'attempt' : 'attempts'}!
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default NumberDhoondo;

