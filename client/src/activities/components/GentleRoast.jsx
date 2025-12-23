import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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

  useEffect(() => {
    const randomRoast = ROASTS[Math.floor(Math.random() * ROASTS.length)];
    setRoast(randomRoast);
    
    setTimeout(() => {
      setShowRoast(true);
    }, 500);
  }, []);

  useEffect(() => {
    if (showRoast) {
      const timer = setTimeout(() => {
        onComplete();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showRoast, onComplete]);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-orange-900 to-red-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
      >
        <h2 className="text-3xl font-bold mb-8 text-white">
          Gentle Roast Machine 🔥
        </h2>

        {showRoast && roast ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8"
          >
            <p className="text-xl text-white leading-relaxed">
              {roast}
            </p>
          </motion.div>
        ) : (
          <div className="text-white/50">Generating roast...</div>
        )}
      </motion.div>
    </div>
  );
}

export default GentleRoast;

