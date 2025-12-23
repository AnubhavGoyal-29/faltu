import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ACTIVITY_DESCRIPTIONS } from '../registry.js';

function KuchNahi({ activity, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(10);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (started) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setTimeout(() => onComplete(), 500);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [started, onComplete]);

  return (
    <div className="h-full w-full flex flex-col items-center justify-start pt-8 pb-16 px-6 bg-gradient-to-br from-[#0a0a0a] via-[#0a0a0a] to-[#0a0a0a] overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <h2 className="text-4xl font-black mb-2">
          <span className="bg-gradient-to-r from-gray-400 via-gray-500 to-gray-400 bg-clip-text text-transparent">Kuch Nahi</span> 😐
        </h2>
        <p className="text-center text-white/40 text-sm mb-6">
          {ACTIVITY_DESCRIPTIONS.kuch_nahi}
        </p>

        {!started ? (
          <div>
            <p className="text-xl text-white/60 mb-6">
              Do absolutely nothing for 10 seconds
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStarted(true)}
              className="py-4 px-8 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-2xl font-bold text-lg hover:from-gray-600 hover:to-gray-700 transition-all shadow-2xl shadow-gray-500/20 hover:shadow-gray-500/30"
            >
              Start Doing Nothing
            </motion.button>
          </div>
        ) : (
          <div>
            <motion.div
              key={timeLeft}
              initial={{ scale: 1.5 }}
              animate={{ scale: 1 }}
              className="text-8xl font-bold text-white/90 mb-4"
            >
              {timeLeft}
            </motion.div>
            <p className="text-white/50">Just... wait...</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default KuchNahi;

