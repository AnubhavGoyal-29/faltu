import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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

  useEffect(() => {
    const randomJoke = JOKES[Math.floor(Math.random() * JOKES.length)];
    setJoke(randomJoke);
    
    setTimeout(() => {
      setShowJoke(true);
    }, 500);
  }, []);

  useEffect(() => {
    if (showJoke) {
      const timer = setTimeout(() => {
        onComplete();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showJoke, onComplete]);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-fuchsia-900 to-purple-900">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md w-full text-center"
      >
        <h2 className="text-3xl font-bold mb-8 text-white">
          Faltu Joke Drop 😂
        </h2>

        {showJoke && joke ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8"
          >
            <p className="text-xl text-white leading-relaxed">
              {joke}
            </p>
          </motion.div>
        ) : (
          <div className="text-white/50">Loading joke...</div>
        )}
      </motion.div>
    </div>
  );
}

export default FaltuJokeDrop;

