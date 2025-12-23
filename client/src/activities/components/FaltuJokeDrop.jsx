import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { generateAIContent } from '../../utils/ai.js';
import { ACTIVITY_DESCRIPTIONS } from '../registry.js';

const JOKES = [
  "Why don't scientists trust atoms? Because they make up everything!",
  "I told my wife she was drawing her eyebrows too high. She looked surprised.",
  "Why don't eggs tell jokes? They'd crack each other up!",
  "What do you call a fake noodle? An impasta!",
  "Why did the scarecrow win an award? He was outstanding in his field!",
  "I'm reading a book about anti-gravity. It's impossible to put down!",
  "Why don't skeletons fight each other? They don't have the guts!",
  "What do you call a bear with no teeth? A gummy bear!",
  "Why did the math book look so sad? Because it had too many problems!",
  "I used to be a baker, but I couldn't make enough dough.",
];

function FaltuJokeDrop({ activity, onComplete }) {
  const [joke, setJoke] = useState(null);
  const [showJoke, setShowJoke] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleJokeDrop = async () => {
    setIsGenerating(true);
    
    try {
      // Try to generate AI joke
      const aiJoke = await generateAIContent('faltu_joke');
      
      if (aiJoke) {
        setJoke(aiJoke);
      } else {
        // Fallback to hardcoded jokes
        const randomJoke = JOKES[Math.floor(Math.random() * JOKES.length)];
        setJoke(randomJoke);
      }
    } catch (error) {
      console.error('Error generating joke:', error);
      // Fallback to hardcoded jokes
      const randomJoke = JOKES[Math.floor(Math.random() * JOKES.length)];
      setJoke(randomJoke);
    } finally {
      setIsGenerating(false);
      setTimeout(() => {
        setShowJoke(true);
      }, 500);
    }
  };

  useEffect(() => {
    if (showJoke && joke) {
      const timer = setTimeout(() => {
        onComplete();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showJoke, joke, onComplete]);

  return (
    <div className="h-full w-full flex flex-col items-center justify-start pt-8 pb-16 px-6 bg-gradient-to-br from-[#0a0a0a] via-[#1a0a1a] to-[#0a0a0a] overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md w-full text-center"
      >
        <h2 className="text-3xl font-black mb-2">
          <span className="bg-gradient-to-r from-fuchsia-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">Faltu Joke Drop</span> 😂
        </h2>
        <p className="text-center text-white/40 text-sm mb-6">
          {ACTIVITY_DESCRIPTIONS.faltu_joke_drop}
        </p>

        {!showJoke ? (
          <div className="space-y-6">
            {isGenerating ? (
              <div className="text-white/60 text-lg">
                Generating joke... 😂
              </div>
            ) : (
              <>
                <p className="text-white/60 text-lg mb-4">
                  Ready for a joke?
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleJokeDrop}
                  className="w-full py-6 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white rounded-2xl font-bold text-xl hover:from-fuchsia-700 hover:to-purple-700 transition-all shadow-2xl shadow-fuchsia-500/30 hover:shadow-fuchsia-500/50"
                >
                  Drop Joke 😂
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
              {joke}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default FaltuJokeDrop;

