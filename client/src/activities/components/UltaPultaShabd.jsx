import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { generateAIContent, parseAIContent } from '../../utils/ai.js';
import { ACTIVITY_DESCRIPTIONS } from '../registry.js';

function UltaPultaShabd({ activity, onComplete }) {
  const [word, setWord] = useState(null);
  const [guess, setGuess] = useState('');
  const [timeLeft, setTimeLeft] = useState(15);
  const [result, setResult] = useState(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    // Prevent duplicate calls (React StrictMode + replay button)
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    const loadWord = async () => {
      try {
        // Try to generate AI scrambled word
        const aiContent = await generateAIContent('ulta_pulta_shabd');
        const parsed = parseAIContent(aiContent);
        
        if (parsed && parsed.scrambled && parsed.answer) {
          setWord(parsed);
        } else {
          throw new Error('Invalid format');
        }
      } catch (error) {
        console.error('Error generating word:', error);
        // Server should always return fallback, but if parsing fails, use default
        setWord({ scrambled: "TAIHH", answer: "HATHI" });
      } finally {
        setIsGenerating(false);
      }
    };

    loadWord();
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

  if (!word || isGenerating) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-white/50">Generating word...</div>
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
          <span className="bg-gradient-to-r from-violet-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">Ulta-Pulta Shabd</span> 🔤
        </h2>
        <p className="text-center text-white/40 text-sm mb-6">
          {ACTIVITY_DESCRIPTIONS.ulta_pulta_shabd}
        </p>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 mb-6 text-center border border-white/10">
          <p className="text-4xl font-bold text-white/90 mb-4">
            {word.scrambled}
          </p>
          <p className="text-white/60">Time: {timeLeft}s</p>
        </div>

        {!result && (
          <div>
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
              placeholder="Unscramble"
              className="w-full py-4 px-4 rounded-2xl bg-white/10 backdrop-blur-lg text-white placeholder-white/50 text-center text-lg mb-4 focus:outline-none focus:bg-white/15 focus:ring-2 focus:ring-violet-500/50 border border-white/10"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGuess}
              className="w-full py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-2xl font-bold text-lg hover:from-violet-700 hover:to-purple-700 transition-all shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50"
            >
              Check
            </motion.button>
          </div>
        )}

        {result && (
          <motion.p
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-center text-2xl font-bold text-white/90"
          >
            {result === 'win' ? '🎉 Sahi!' : `Answer: ${word.answer}`}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}

export default UltaPultaShabd;

