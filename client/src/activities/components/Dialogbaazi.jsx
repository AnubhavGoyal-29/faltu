import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { generateAIContent, parseAIContent } from '../../utils/ai.js';
import { ACTIVITY_DESCRIPTIONS } from '../registry.js';


function Dialogbaazi({ activity, onComplete }) {
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
        // Try to generate AI dialogue
        const aiContent = await generateAIContent('dialogbaazi');
        console.log("aiContent", aiContent);
        const parsed = parseAIContent(aiContent);
        console.log("parsed", parsed);
        if (parsed && parsed.dialogue && parsed.options && Array.isArray(parsed.options) && typeof parsed.answer === 'number') {
          setQuestion(parsed);
        } else {
          throw new Error('Invalid format');
        }
      } catch (error) {
        console.error('Error generating dialogue:', error);
        // Server should always return fallback, but if parsing fails, use default
        setQuestion({
          dialogue: "Kitne aadmi the?",
          options: ["Sholay", "Dilwale", "3 Idiots"],
          answer: 0,
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
        <div className="text-white/50">Generating dialogue...</div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col items-center justify-start pt-8 pb-16 px-6 bg-gradient-to-br from-[#0a0a0a] via-[#1a050a] to-[#0a0a0a] overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md w-full"
      >
        <h2 className="text-3xl font-black text-center mb-2">
          <span className="bg-gradient-to-r from-rose-400 via-pink-500 to-red-500 bg-clip-text text-transparent">Dialogbaazi</span> 🎬
        </h2>
        <p className="text-center text-white/40 text-sm mb-6">
          {ACTIVITY_DESCRIPTIONS.dialogbaazi}
        </p>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 mb-6 border border-white/10">
          <p className="text-xl text-white/90 text-center italic">
            "{question.dialogue}"
          </p>
        </div>

        <div className="space-y-4">
          {question.options.map((opt, idx) => {
            const isSelected = selected === idx;
            const isCorrect = idx === question.answer;
            const showCorrect = selected !== null && selected !== question.answer;
            
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
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${buttonClass}`}
              >
                {opt}
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
            {selected === question.answer ? '🎉 Sahi!' : '❌ Galat!'}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}

export default Dialogbaazi;

