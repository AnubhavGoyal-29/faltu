import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { generateAIContent } from '../../utils/ai.js';
import { ACTIVITY_DESCRIPTIONS } from '../registry.js';

function BekaarSalah({ activity, onComplete }) {
  const [advice, setAdvice] = useState(null);
  const [showAdvice, setShowAdvice] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    // Prevent duplicate calls (React StrictMode + replay button)
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

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
        // Server should always return fallback, but if parsing fails, use default
        setAdvice("Always trust your first gut feeling, even if it's 3 AM.");
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
    <div className="h-full w-full flex flex-col items-center justify-start pt-8 pb-16 px-6 bg-gradient-to-br from-[#0a0a0a] via-[#1a0a05] to-[#0a0a0a] overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md w-full text-center"
      >
        <h2 className="text-3xl font-black mb-2">
          <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">Bekaar Salah</span> 💡
        </h2>
        <p className="text-center text-white/40 text-sm mb-6">
          {ACTIVITY_DESCRIPTIONS.bekaar_salah}
        </p>

        {showAdvice && advice ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10"
          >
            <p className="text-xl text-white/90 leading-relaxed">
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

