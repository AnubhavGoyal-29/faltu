import React from 'react';
import { motion } from 'framer-motion';

function CompletionScreen({ onRestart, onExit }) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900">
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
          🎉
        </motion.div>

        <h2 className="text-4xl font-black mb-4 text-white">
          You've Finished All Activities!
        </h2>

        <p className="text-white/70 text-lg mb-12">
          You've completed all 20 faltu activities. Amazing!
        </p>

        <div className="flex flex-col gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRestart}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition"
          >
            Restart
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onExit}
            className="w-full py-4 bg-white/10 text-white rounded-xl font-bold text-lg hover:bg-white/20 transition backdrop-blur-sm"
          >
            Exit
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export default CompletionScreen;

