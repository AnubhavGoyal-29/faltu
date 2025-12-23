import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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
    <div className="h-full w-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-900 to-black">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <h2 className="text-4xl font-bold mb-8 text-white">
          Kuch Nahi 😐
        </h2>

        {!started ? (
          <div>
            <p className="text-xl text-white/70 mb-6">
              Do absolutely nothing for 10 seconds
            </p>
            <button
              onClick={() => setStarted(true)}
              className="py-4 px-8 bg-gray-700 text-white rounded-xl font-bold text-lg hover:bg-gray-600 transition"
            >
              Start Doing Nothing
            </button>
          </div>
        ) : (
          <div>
            <motion.div
              key={timeLeft}
              initial={{ scale: 1.5 }}
              animate={{ scale: 1 }}
              className="text-8xl font-bold text-white mb-4"
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

