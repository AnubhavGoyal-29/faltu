import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { generateAIContent } from '../../utils/ai.js';
import { ACTIVITY_DESCRIPTIONS } from '../registry.js';

const FACTS = [
  { text: "Bananas are berries, but strawberries aren't.", answer: true },
  { text: "Octopuses have three hearts.", answer: true },
  { text: "Wombats poop in cubes.", answer: true },
  { text: "Sharks have been around longer than trees.", answer: true },
  { text: "Honey never spoils.", answer: true },
  { text: "A group of flamingos is called a 'flamboyance'.", answer: true },
  { text: "Dolphins have names for each other.", answer: true },
  { text: "The human brain uses 20% of the body's energy.", answer: true },
  { text: "Cows have best friends.", answer: true },
  { text: "Penguins can jump 6 feet in the air.", answer: false },
];

function SachYaFaltu({ activity, onComplete }) {
  const [fact, setFact] = useState(null);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    const loadFact = async () => {
      try {
        // Try to generate AI fact
        const aiFactText = await generateAIContent('sach_ya_faltu');
        
        if (aiFactText && typeof aiFactText === 'string') {
          // Randomly assign true/false for AI-generated facts
          setFact({ text: aiFactText, answer: Math.random() > 0.5 });
        } else {
          // Fallback to hardcoded facts
          const randomFact = FACTS[Math.floor(Math.random() * FACTS.length)];
          setFact(randomFact);
        }
      } catch (error) {
        console.error('Error generating fact:', error);
        // Fallback to hardcoded facts
        const randomFact = FACTS[Math.floor(Math.random() * FACTS.length)];
        setFact(randomFact);
      } finally {
        setIsGenerating(false);
      }
    };

    loadFact();
  }, []);

  const handleChoice = (choice) => {
    if (selected) return;
    setSelected(choice);
    setShowResult(true);
    
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  if (!fact) return null;

  return (
    <div className="h-full w-full flex flex-col items-center justify-start pt-8 pb-16 px-6 bg-gradient-to-br from-[#0a0a0a] via-[#1a0a1a] to-[#0a0a1a] overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <h2 className="text-3xl font-black text-center mb-2">
          <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">Sach Ya Faltu?</span>
        </h2>
        <p className="text-center text-white/40 text-sm mb-6">
          {ACTIVITY_DESCRIPTIONS.sach_ya_faltu}
        </p>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 mb-8 border border-white/10">
          <p className="text-xl text-center text-white/90 leading-relaxed">
            {fact.text}
          </p>
        </div>

        {!showResult ? (
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleChoice(true)}
              className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-2xl shadow-green-500/30 hover:shadow-green-500/50"
            >
              Sach
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleChoice(false)}
              className="flex-1 py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-2xl font-bold text-lg hover:from-red-600 hover:to-pink-700 transition-all shadow-2xl shadow-red-500/30 hover:shadow-red-500/50"
            >
              Faltu
            </motion.button>
          </div>
        ) : (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-center"
          >
            <p className="text-2xl font-bold text-white mb-2">
              {selected === fact.answer ? '🎉 Sahi!' : '😅 Galat!'}
            </p>
            <p className="text-white/60">
              {fact.answer ? 'Ye sach hai!' : 'Ye faltu hai!'}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default SachYaFaltu;

