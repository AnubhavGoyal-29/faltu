import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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
    <div className="h-full w-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-900 to-gray-900">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md w-full"
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-white">
          No-Stress Math ➕
        </h2>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-6 text-center">
          <p className="text-5xl font-bold text-white mb-4">
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
              className="w-full py-4 px-4 rounded-xl bg-white/20 text-white placeholder-white/50 text-center text-2xl mb-4 focus:outline-none focus:bg-white/30"
            />
            <button
              onClick={handleSubmit}
              className="w-full py-4 bg-slate-500 text-white rounded-xl font-bold text-lg hover:bg-slate-600 transition"
            >
              Submit
            </button>
          </div>
        )}

        {result && (
          <motion.p
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-center text-3xl font-bold text-white"
          >
            {result === 'correct' ? '🎉 Correct!' : `Answer: ${question.answer}`}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}

export default NoStressMath;

