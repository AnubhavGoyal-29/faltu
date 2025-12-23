import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { generateAIContent } from '../../utils/ai.js';
import { ACTIVITY_DESCRIPTIONS } from '../registry.js';

const COMPATIBILITY_COMMENTS = [
  "Perfect match! 🌟",
  "Good vibes! ✨",
  "Decent compatibility! 👍",
  "Interesting combo! 🤔",
  "Could work! 💫",
  "Surprising match! 🎯",
];

// Calculate compatibility percentage based on names (fun algorithm)
function calculateCompatibility(name1, name2) {
  const n1 = name1.toLowerCase().trim();
  const n2 = name2.toLowerCase().trim();
  
  // Base compatibility from name length similarity
  const lengthDiff = Math.abs(n1.length - n2.length);
  const lengthScore = Math.max(0, 100 - lengthDiff * 5);
  
  // Check for common letters
  const commonLetters = new Set();
  for (const char of n1) {
    if (n2.includes(char)) {
      commonLetters.add(char);
    }
  }
  const commonScore = (commonLetters.size / Math.max(n1.length, n2.length)) * 50;
  
  // Random factor for fun (adds 0-30%)
  const randomFactor = Math.random() * 30;
  
  // Combine scores
  const total = (lengthScore * 0.3 + commonScore * 0.4 + randomFactor);
  return Math.min(100, Math.max(20, Math.round(total))); // Clamp between 20-100%
}

function NaamJodi({ activity, onComplete }) {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [compatibility, setCompatibility] = useState(null);
  const [comment, setComment] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name1.trim() && name2.trim()) {
      setIsGenerating(true);
      
      // Calculate compatibility percentage
      const percentage = calculateCompatibility(name1.trim(), name2.trim());
      setCompatibility(percentage);
      
      try {
        // Try to generate AI compatibility comment
        const aiResult = await generateAIContent('naam_jodi', {
          name1: name1.trim(),
          name2: name2.trim()
        });
        
        if (aiResult) {
          setComment(aiResult);
        } else {
          // Fallback to hardcoded comments
          const randomComment = COMPATIBILITY_COMMENTS[
            Math.floor(Math.random() * COMPATIBILITY_COMMENTS.length)
          ];
          setComment(randomComment);
        }
      } catch (error) {
        console.error('Error generating compatibility:', error);
        // Fallback to hardcoded comments
        const randomComment = COMPATIBILITY_COMMENTS[
          Math.floor(Math.random() * COMPATIBILITY_COMMENTS.length)
        ];
        setComment(randomComment);
      } finally {
        setIsGenerating(false);
        setTimeout(() => {
          onComplete();
        }, 3000);
      }
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-start pt-8 pb-16 px-6 bg-gradient-to-br from-[#0a0a0a] via-[#1a050a] to-[#0a0a0a] overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md w-full"
      >
        <h2 className="text-3xl font-black text-center mb-2">
          <span className="bg-gradient-to-r from-pink-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">Naam Jodi</span> 💕
        </h2>
        <p className="text-center text-white/40 text-sm mb-6">
          {ACTIVITY_DESCRIPTIONS.naam_jodi}
        </p>

        {compatibility === null ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              value={name1}
              onChange={(e) => setName1(e.target.value)}
              placeholder="First name"
              className="w-full py-4 px-4 rounded-2xl bg-white/10 backdrop-blur-lg text-white placeholder-white/50 text-center text-lg focus:outline-none focus:bg-white/15 focus:ring-2 focus:ring-pink-500/50 border border-white/10"
              required
            />
            <div className="text-center text-white/80 text-2xl">+</div>
            <input
              type="text"
              value={name2}
              onChange={(e) => setName2(e.target.value)}
              placeholder="Second name"
              className="w-full py-4 px-4 rounded-2xl bg-white/10 backdrop-blur-lg text-white placeholder-white/50 text-center text-lg focus:outline-none focus:bg-white/15 focus:ring-2 focus:ring-pink-500/50 border border-white/10"
              required
            />
            <motion.button
              whileHover={{ scale: isGenerating ? 1 : 1.02 }}
              whileTap={{ scale: isGenerating ? 1 : 0.98 }}
              type="submit"
              disabled={isGenerating}
              className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-2xl font-bold text-lg hover:from-pink-700 hover:to-purple-700 transition-all shadow-2xl shadow-pink-500/30 hover:shadow-pink-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {isGenerating ? 'Checking...' : 'Check Compatibility'}
            </motion.button>
          </form>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 mb-4 border border-white/10">
              <p className="text-2xl font-bold text-white mb-4">
                {name1} + {name2}
              </p>
              
              {/* Compatibility Percentage */}
              <div className="mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="inline-block"
                >
                  <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-2">
                    {compatibility}%
                  </div>
                </motion.div>
                <div className="text-white/60 text-sm mb-4">Compatibility Score</div>
                
                {/* Progress bar */}
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${compatibility}%` }}
                    transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                  />
                </div>
              </div>
              
              {/* Comment */}
              {comment && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-xl text-white/90 font-semibold"
                >
                  {comment}
                </motion.p>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default NaamJodi;

