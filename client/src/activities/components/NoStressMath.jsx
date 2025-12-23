import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ACTIVITY_DESCRIPTIONS } from '../registry.js';

function NoStressMath({ activity, onComplete }) {
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    const num1 = Math.floor(Math.random() * 20) + 1;
    const num2 = Math.floor(Math.random() * 20) + 1;
    setQuestion({ num1, num2, answer: num1 + num2 });
  }, []);

  const handleSubmit = () => {
    if (!answer.trim()) return;
    
    const userAnswer = parseInt(answer);
    if (userAnswer === question.answer) {
      setResult('correct');
    } else {
      setResult('wrong');
    }
    
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  if (!question) return null;

  return (
    <div className="h-full w-full flex flex-col items-center justify-start pt-8 pb-16 px-6 bg-gradient-to-br from-[#0a0a0a] via-[#0a0a0a] to-[#0a0a0a] overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md w-full"
      >
        <h2 className="text-3xl font-black text-center mb-2">
          <span className="bg-gradient-to-r from-slate-400 via-gray-500 to-slate-400 bg-clip-text text-transparent">No-Stress Math</span> ➕
        </h2>
        <p className="text-center text-white/40 text-sm mb-6">
          {ACTIVITY_DESCRIPTIONS.no_stress_math}
        </p>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 mb-6 text-center border border-white/10">
          <p className="text-5xl font-bold text-white/90 mb-4">
            {question.num1} + {question.num2} = ?
          </p>
        </div>

        {!result && (
          <div>
            <input
              type="number"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Answer"
              className="w-full py-4 px-4 rounded-2xl bg-white/10 backdrop-blur-lg text-white placeholder-white/50 text-center text-2xl mb-4 focus:outline-none focus:bg-white/15 focus:ring-2 focus:ring-slate-500/50 border border-white/10"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              className="w-full py-4 bg-gradient-to-r from-slate-600 to-gray-700 text-white rounded-2xl font-bold text-lg hover:from-slate-700 hover:to-gray-800 transition-all shadow-2xl shadow-slate-500/30 hover:shadow-slate-500/50"
            >
              Submit
            </motion.button>
          </div>
        )}

        {result && (
          <motion.p
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-center text-3xl font-bold text-white/90"
          >
            {result === 'correct' ? '🎉 Correct!' : `Answer: ${question.answer}`}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}

export default NoStressMath;

