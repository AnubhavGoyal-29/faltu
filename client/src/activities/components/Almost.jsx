import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function Almost({ activity, onComplete }) {
  const [progress, setProgress] = useState(0);
  const [stopped, setStopped] = useState(false);
  const [target, setTarget] = useState(0);
  const [difference, setDifference] = useState(null);

  useEffect(() => {
    const randomTarget = Math.floor(Math.random() * 80) + 10; // 10-90
    setTarget(randomTarget);
    
    const interval = setInterval(() => {
      if (!stopped) {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }
    }, 50);

    return () => clearInterval(interval);
  }, [stopped]);

  const handleStop = () => {
    if (!stopped) {
      setStopped(true);
      const diff = Math.abs(progress - target);
      setDifference(diff);
      
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-900 to-blue-900">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md w-full"
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-white">
          Almost! 🎯
        </h2>

        {!stopped && (
          <p className="text-center text-white/70 mb-4">
            Stop at exactly {target}%
          </p>
        )}

        <div className="bg-white/10 rounded-2xl p-8 mb-6">
          <div className="relative h-8 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              style={{ width: `${progress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
            {!stopped && (
              <div
                className="absolute top-0 h-full w-1 bg-yellow-400"
                style={{ left: `${target}%` }}
              />
            )}
          </div>
          <div className="text-center mt-4 text-white">
            {progress.toFixed(0)}%
          </div>
        </div>

        {!stopped ? (
          <button
            onClick={handleStop}
            className="w-full py-4 bg-blue-500 text-white rounded-xl font-bold text-lg hover:bg-blue-600 transition"
          >
            STOP!
          </button>
        ) : (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-center"
          >
            <p className="text-2xl font-bold text-white">
              {difference < 5 ? '🎉 Almost perfect!' : `Off by ${difference.toFixed(0)}%`}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default Almost;

