import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { generateAIContent } from '../../utils/ai.js';
import { ACTIVITY_DESCRIPTIONS } from '../registry.js';

const ROASTS = [
  "You're like a cloud - when you disappear, it's a beautiful day.",
  "You're the human equivalent of a participation trophy.",
  "If I had a dollar for every time you had a good idea, I'd have zero dollars.",
  "You're proof that evolution can go in reverse.",
  "You're not stupid, you just have bad luck thinking.",
  "You're like a dictionary - you add meaning to my life, but I never open you.",
  "You're the reason why instructions exist.",
  "You're like WiFi - I can feel you, but I can't see you doing anything useful.",
  "You're proof that anyone can be anything on the internet.",
  "You're like a fine wine - you get more annoying with age.",
];

function GentleRoast({ activity, onComplete }) {
  const [roast, setRoast] = useState(null);
  const [showRoast, setShowRoast] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleRoastMe = async () => {
    setIsGenerating(true);
    
    try {
      // Try to generate AI roast
      const aiRoast = await generateAIContent('gentle_roast');
      
      if (aiRoast) {
        setRoast(aiRoast);
      } else {
        // Fallback to hardcoded roasts
        const randomRoast = ROASTS[Math.floor(Math.random() * ROASTS.length)];
        setRoast(randomRoast);
      }
    } catch (error) {
      console.error('Error generating roast:', error);
      // Fallback to hardcoded roasts
      const randomRoast = ROASTS[Math.floor(Math.random() * ROASTS.length)];
      setRoast(randomRoast);
    } finally {
      setIsGenerating(false);
      setTimeout(() => {
        setShowRoast(true);
      }, 500);
    }
  };

  useEffect(() => {
    if (showRoast && roast) {
      const timer = setTimeout(() => {
        onComplete();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showRoast, roast, onComplete]);

  return (
    <div className="h-full w-full flex flex-col items-center justify-start pt-8 pb-16 px-6 bg-gradient-to-br from-[#0a0a0a] via-[#1a0505] to-[#0a0a0a] overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
      >
        <h2 className="text-3xl font-black mb-2">
          <span className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">Gentle Roast Machine</span> 🔥
        </h2>
        <p className="text-center text-white/40 text-sm mb-6">
          {ACTIVITY_DESCRIPTIONS.gentle_roast}
        </p>

        {!showRoast ? (
          <div className="space-y-6">
            {isGenerating ? (
              <div className="text-white/60 text-lg">
                Generating your roast... 🔥
              </div>
            ) : (
              <>
                <p className="text-white/60 text-lg mb-4">
                  Ready to get roasted?
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRoastMe}
                  className="w-full py-6 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-2xl font-bold text-xl hover:from-orange-700 hover:to-red-700 transition-all shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50"
                >
                  Roast Me 🔥
                </motion.button>
              </>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10"
          >
            <p className="text-xl text-white/90 leading-relaxed">
              {roast}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default GentleRoast;

