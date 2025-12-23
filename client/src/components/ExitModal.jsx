import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function ExitModal({ onExit, onOneMore }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-900 rounded-2xl p-8 max-w-sm w-full text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-4">
            That's enough faltu for now.
          </h2>
          
          <div className="flex gap-4 mt-6">
            <button
              onClick={onOneMore}
              className="flex-1 py-3 px-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              One more
            </button>
            <button
              onClick={onExit}
              className="flex-1 py-3 px-4 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
            >
              I'm done
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ExitModal;

