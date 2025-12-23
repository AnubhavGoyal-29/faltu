import React from 'react';
import { motion } from 'framer-motion';

function ExitScreen() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-900 via-slate-900 to-black">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="text-8xl mb-6"
        >
          ⏰
        </motion.div>

        <h2 className="text-4xl font-black mb-6 text-white">
          Time's Up!
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-white/80 text-xl mb-8 leading-relaxed"
        >
          You can do something productive now.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-white/60 text-lg mb-12 italic"
        >
          Wasted a lot of time already.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-white/40 text-sm"
        >
          Thanks for playing Faltuverse! 🎮
        </motion.div>
      </motion.div>
    </div>
  );
}

export default ExitScreen;

