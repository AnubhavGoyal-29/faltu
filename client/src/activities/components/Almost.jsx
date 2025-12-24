import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ACTIVITY_DESCRIPTIONS } from '../registry.js';

function Almost({ activity, onComplete }) {
  const [progress, setProgress] = useState(0);
  const [stopped, setStopped] = useState(false);
  const [targetMin, setTargetMin] = useState(0);
  const [targetMax, setTargetMax] = useState(0);
  const [difference, setDifference] = useState(null);
  const intervalRef = useRef(null);
  const directionRef = useRef(1); // 1 for increasing, -1 for decreasing

  useEffect(() => {
    // Generate a target range (e.g., 30-40%, 45-55%, etc.)
    const rangeSize = 10; // 10% range
    const minTarget = Math.floor(Math.random() * (90 - rangeSize)) + 5; // 5-85
    const maxTarget = minTarget + rangeSize;
    setTargetMin(minTarget);
    setTargetMax(maxTarget);
    
    directionRef.current = 1; // Reset direction
    
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (directionRef.current === 1) {
          if (prev >= 100) {
            directionRef.current = -1;
            return 100;
          }
          return prev + 2;
        } else {
          if (prev <= 0) {
            directionRef.current = 1;
            return 0;
          }
          return prev - 2;
        }
      });
    }, 50);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleStop = () => {
    if (!stopped) {
      // Stop the interval immediately
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      setStopped(true);
      
      // Check if progress is within target range
      const inRange = progress >= targetMin && progress <= targetMax;
      
      if (inRange) {
        setDifference(0);
      } else {
        // Calculate distance to nearest edge of range
        const distToMin = Math.abs(progress - targetMin);
        const distToMax = Math.abs(progress - targetMax);
        setDifference(Math.min(distToMin, distToMax));
      }
      
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-start pt-8 pb-16 px-6 bg-gradient-to-br from-[#0a0a0a] via-[#0a0a1a] to-[#0a0a0a] overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md w-full"
      >
        <h2 className="text-3xl font-black text-center mb-2">
          <span className="bg-gradient-to-r from-indigo-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">Almost!</span> 🎯
        </h2>
        <p className="text-center text-white/40 text-sm mb-6">
          {ACTIVITY_DESCRIPTIONS.almost}
        </p>

        {!stopped && (
          <p className="text-center text-white/70 mb-4">
            Stop between {targetMin}% and {targetMax}%
          </p>
        )}

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 mb-6 border border-white/10">
          <div className="relative h-12 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              style={{ width: `${progress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
            {!stopped && (
              <>
                {/* Target range highlight */}
                <div
                  className="absolute top-0 h-full bg-green-400/30 border-l-2 border-r-2 border-green-400"
                  style={{ 
                    left: `${targetMin}%`,
                    width: `${targetMax - targetMin}%`
                  }}
                />
                {/* Min marker */}
                <div
                  className="absolute top-0 h-full w-1 bg-green-400"
                  style={{ left: `${targetMin}%` }}
                />
                {/* Max marker */}
                <div
                  className="absolute top-0 h-full w-1 bg-green-400"
                  style={{ left: `${targetMax}%` }}
                />
              </>
            )}
          </div>
          <div className="text-center mt-4 text-white/90 text-lg font-semibold">
            {progress.toFixed(0)}%
          </div>
        </div>

        {!stopped ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStop}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50"
          >
            STOP!
          </motion.button>
        ) : (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-center"
          >
            <p className="text-2xl font-bold text-white/90">
              {difference === 0 
                ? '🎉 Perfect! In range!' 
                : difference < 5 
                ? `🎯 Almost! Off by ${difference.toFixed(0)}%` 
                : `Off by ${difference.toFixed(0)}%`}
            </p>
            {difference !== 0 && (
              <p className="text-white/60 mt-2">
                Target was {targetMin}% - {targetMax}%
              </p>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default Almost;

