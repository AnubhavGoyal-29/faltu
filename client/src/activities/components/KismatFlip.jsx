import React, { useState } from 'react';
import { motion } from 'framer-motion';

function KismatFlip({ activity, onComplete }) {
  const [choice, setChoice] = useState(null);
  const [flipped, setFlipped] = useState(false);
  const [result, setResult] = useState(null);

  const handleChoice = (side) => {
    if (choice !== null) return;
    setChoice(side);
    
    setTimeout(() => {
      const coinResult = Math.random() > 0.5 ? 'heads' : 'tails';
      setResult(coinResult);
      setFlipped(true);
      
      setTimeout(() => {
        onComplete();
      }, 2000);
    }, 500);
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-emerald-900 to-teal-900">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md w-full text-center"
      >
        <h2 className="text-3xl font-bold mb-8 text-white">
          Kismat Flip 🪙
        </h2>

        {!choice && (
          <div className="space-y-4">
            <p className="text-white/70 mb-6">Pick Smart or Dumb</p>
            <button
              onClick={() => handleChoice('smart')}
              className="w-full py-6 bg-green-500 text-white rounded-xl font-bold text-xl hover:bg-green-600 transition"
            >
              Smart
            </button>
            <button
              onClick={() => handleChoice('dumb')}
              className="w-full py-6 bg-red-500 text-white rounded-xl font-bold text-xl hover:bg-red-600 transition"
            >
              Dumb
            </button>
          </div>
        )}

        {choice && (
          <div>
            <motion.div
              animate={{ rotateY: flipped ? 360 : 0 }}
              transition={{ duration: 0.5 }}
              className="w-32 h-32 mx-auto mb-6 bg-yellow-400 rounded-full flex items-center justify-center text-4xl"
            >
              {flipped ? (result === 'heads' ? '🪙' : '🪙') : '🪙'}
            </motion.div>
            {flipped && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-2xl font-bold text-white"
              >
                {result === 'heads' ? 'Heads!' : 'Tails!'}
              </motion.p>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default KismatFlip;

