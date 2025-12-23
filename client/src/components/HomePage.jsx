import React from 'react';
import { motion } from 'framer-motion';

function HomePage({ onEnter }) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#0a0a0a] via-[#1a0a1a] to-[#0a0a1a]">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-6xl font-black mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent tracking-tighter"
        >
          Welcome to Faltuverse
        </motion.h1>

        <motion.p
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-white/60 text-lg mb-12 font-medium"
        >
          20 Faltu Activities. Infinite Fun.
        </motion.p>

        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEnter}
          className="w-full py-6 text-2xl font-bold rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl shadow-pink-500/30 hover:shadow-pink-500/50 transition-all"
        >
          Enter
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 text-white/20 text-xs"
        >
          Scroll up to change activity
        </motion.p>
      </motion.div>
    </div>
  );
}

export default HomePage;

