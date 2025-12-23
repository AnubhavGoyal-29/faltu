import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ACTIVITY_DESCRIPTIONS } from '../registry.js';

function KismatFlip({ activity, onComplete }) {
  const [choice, setChoice] = useState(null);
  const [flipped, setFlipped] = useState(false);
  const [result, setResult] = useState(null);

  const handleChoice = (side) => {
    if (choice !== null) return;
    setChoice(side);
    
    setTimeout(() => {
      const coinResult = Math.random() > 0.5 ? 'smart' : 'dumb';
      setResult(coinResult);
      setFlipped(true);
      
      setTimeout(() => {
        onComplete();
      }, 2000);
    }, 500);
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-start pt-8 pb-16 px-6 bg-gradient-to-br from-[#0a0a0a] via-[#050a0a] to-[#0a0a0a] overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md w-full text-center"
      >
        <h2 className="text-3xl font-black mb-2">
          <span className="bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 bg-clip-text text-transparent">Kismat Flip</span> 🪙
        </h2>
        <p className="text-center text-white/40 text-sm mb-6">
          {ACTIVITY_DESCRIPTIONS.kismat_flip}
        </p>

        {!choice && (
          <div className="space-y-4">
            <p className="text-white/60 mb-6">Pick Smart or Dumb</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleChoice('smart')}
              className="w-full py-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-bold text-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-2xl shadow-green-500/30 hover:shadow-green-500/50"
            >
              Smart
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleChoice('dumb')}
              className="w-full py-6 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-2xl font-bold text-xl hover:from-red-700 hover:to-pink-700 transition-all shadow-2xl shadow-red-500/30 hover:shadow-red-500/50"
            >
              Dumb
            </motion.button>
          </div>
        )}

        {choice && (
          <div>
            {/* Coin with Smart/Dumb sides */}
            <div 
              className="relative w-40 h-40 mx-auto mb-6"
              style={{ perspective: '1000px' }}
            >
              <motion.div
                animate={{ rotateY: flipped ? 1800 : 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                style={{ 
                  transformStyle: 'preserve-3d',
                  position: 'relative',
                  width: '100%',
                  height: '100%'
                }}
              >
                {/* Front side - Smart (Green) */}
                <div 
                  className="absolute w-full h-full rounded-full flex items-center justify-center font-black text-xl shadow-xl"
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    transform: 'rotateY(0deg)',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    border: '4px solid rgba(255, 255, 255, 0.3)'
                  }}
                >
                  <span className="text-white drop-shadow-lg">SMART</span>
                </div>
                
                {/* Back side - Dumb (Red) */}
                <div 
                  className="absolute w-full h-full rounded-full flex items-center justify-center font-black text-xl shadow-xl"
                  style={{
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    transform: 'rotateY(180deg)',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    border: '4px solid rgba(255, 255, 255, 0.3)'
                  }}
                >
                  <span className="text-white drop-shadow-lg">DUMB</span>
                </div>
              </motion.div>
            </div>
            
            {flipped && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <p className="text-3xl font-bold text-white/90 mb-2">
                  {result === 'smart' ? '🎯 Smart!' : '🤪 Dumb!'}
                </p>
                <p className="text-white/60 text-lg">
                  {result === 'smart' 
                    ? 'You got the smart side!' 
                    : 'You got the dumb side!'}
                </p>
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default KismatFlip;

