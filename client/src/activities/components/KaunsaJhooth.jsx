import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { generateAIContent, parseAIContent } from '../../utils/ai.js';
import { ACTIVITY_DESCRIPTIONS } from '../registry.js';

function KaunsaJhooth({ activity, onComplete }) {
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    // Prevent duplicate calls (React StrictMode + replay button)
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    const loadQuestion = async () => {
      try {
        // Try to generate AI statements
        const aiContent = await generateAIContent('kaunsa_jhooth');
        const parsed = parseAIContent(aiContent);
        
        if (parsed && parsed.statements && Array.isArray(parsed.statements) && typeof parsed.fakeIndex === 'number') {
          setQuestion(parsed);
        } else {
          throw new Error('Invalid format');
        }
      } catch (error) {
        console.error('Error generating statements:', error);
        // Server should always return fallback, but if parsing fails, use default
        setQuestion({
          statements: [
            "The Great Wall of China is visible from space.",
            "Humans use 100% of their brain capacity.",
            "Bats are blind.",
          ],
          fakeIndex: 0,
        });
      } finally {
        setIsGenerating(false);
      }
    };

    loadQuestion();
  }, []);

  const handleSelect = (index) => {
    if (selected !== null) return;
    setSelected(index);
    
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  if (!question || isGenerating) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-white/50">Generating statements...</div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col items-center justify-start pt-8 pb-16 px-6 bg-gradient-to-br from-[#0a0a0a] via-[#1a0505] to-[#0a0a0a] overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md w-full"
      >
        <h2 className="text-3xl font-black text-center mb-2">
          <span className="bg-gradient-to-r from-red-400 via-pink-500 to-red-500 bg-clip-text text-transparent">Kaunsa Jhooth?</span> 🤔
        </h2>
        <p className="text-center text-white/40 text-sm mb-6">
          {ACTIVITY_DESCRIPTIONS.kaunsa_jhooth}
        </p>

        <div className="space-y-4">
          {question.statements.map((stmt, idx) => {
            const isSelected = selected === idx;
            const isCorrect = idx === question.fakeIndex;
            const showCorrect = selected !== null && selected !== question.fakeIndex;
            
            let buttonClass = 'bg-white/10 backdrop-blur-lg hover:bg-white/15 text-white border border-white/10';
            
            if (isSelected) {
              // User's selected answer
              buttonClass = isCorrect
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-2xl shadow-green-500/30'
                : 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-2xl shadow-red-500/30';
            } else if (showCorrect && isCorrect) {
              // Show correct answer when user selected wrong
              buttonClass = 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-2xl shadow-green-500/30';
            }
            
            return (
              <motion.button
                key={idx}
                whileHover={selected === null ? { scale: 1.02 } : {}}
                whileTap={selected === null ? { scale: 0.98 } : {}}
                onClick={() => handleSelect(idx)}
                disabled={selected !== null}
                className={`w-full p-6 rounded-2xl text-left transition-all ${buttonClass}`}
              >
                <p className="text-white/90 text-lg">{stmt}</p>
              </motion.button>
            );
          })}
        </div>

        {selected !== null && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-6 text-white/90 text-xl font-bold"
          >
            {selected === question.fakeIndex ? '🎉 Sahi!' : '❌ Galat!'}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}

export default KaunsaJhooth;

