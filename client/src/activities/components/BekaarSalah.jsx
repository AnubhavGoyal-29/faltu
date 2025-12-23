import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { generateAIContent } from '../../utils/ai.js';

const ADVICE = [
  "Always trust your first gut feeling, even if it's 3 AM.",
  "If something's hard, just don't do it.",
  "The best way to save money is to never check your bank account.",
  "Procrastination is just future you's problem.",
  "If you can't decide, flip a coin and then do the opposite.",
  "The early bird gets the worm, but the second mouse gets the cheese.",
  "If at first you don't succeed, blame someone else.",
  "Life's too short to make your bed.",
  "When in doubt, add more butter.",
  "The best time to plant a tree was 20 years ago. The second best time is never.",
];

function BekaarSalah({ activity, onComplete }) {
  const [advice, setAdvice] = useState(null);
  const [showAdvice, setShowAdvice] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    const loadAdvice = async () => {
      try {
        // Try to generate AI advice
        const aiAdvice = await generateAIContent('bekaar_salah');
        
        if (aiAdvice) {
          setAdvice(aiAdvice);
        } else {
          // Fallback to hardcoded advice
          const randomAdvice = ADVICE[Math.floor(Math.random() * ADVICE.length)];
          setAdvice(randomAdvice);
        }
      } catch (error) {
        console.error('Error generating advice:', error);
        // Fallback to hardcoded advice
        const randomAdvice = ADVICE[Math.floor(Math.random() * ADVICE.length)];
        setAdvice(randomAdvice);
      } finally {
        setIsGenerating(false);
        setTimeout(() => {
          setShowAdvice(true);
        }, 500);
      }
    };

    loadAdvice();
  }, []);

  useEffect(() => {
    if (showAdvice && advice) {
      const timer = setTimeout(() => {
        onComplete();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showAdvice, advice, onComplete]);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-yellow-900 to-orange-900">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md w-full text-center"
      >
        <h2 className="text-3xl font-bold mb-8 text-white">
          Bekaar Salah 💡
        </h2>

        {showAdvice && advice ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8"
          >
            <p className="text-xl text-white leading-relaxed">
              {advice}
            </p>
            <p className="text-white/50 text-sm mt-4">
              (Please don't follow this advice)
            </p>
          </motion.div>
        ) : (
          <div className="text-white/50">
            {isGenerating ? 'Generating useless advice...' : 'Loading...'}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default BekaarSalah;

