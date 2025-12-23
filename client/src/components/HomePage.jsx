import React from 'react';
import { motion } from 'framer-motion';

const HomePage = ({ onStart, hasProgress, progressCount }) => {
    return (
        <div className="fixed inset-0 w-full h-full bg-black text-white flex flex-col items-center justify-center p-8 overflow-hidden">

            {/* Animated Background */}
            <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 blur-[120px] animate-pulse-slow" />

            {/* Content */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 text-center max-w-2xl w-full"
            >

                {/* Main Title */}
                <motion.h1
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-6xl md:text-7xl font-black mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 bg-clip-text text-transparent drop-shadow-2xl"
                >
                    Enter to Faltuverse
                </motion.h1>

                {/* Tagline */}
                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="text-xl md:text-2xl text-white/60 mb-12 font-medium tracking-wide"
                >
                    20 Random Activities. Zero Sense. Pure Fun.
                </motion.p>

                {/* Progress Indicator (if resuming) */}
                {hasProgress && (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.4 }}
                        className="mb-6 inline-block px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20"
                    >
                        <span className="text-white/80 text-sm font-mono">
                            Progress: {progressCount}/20 completed
                        </span>
                    </motion.div>
                )}

                {/* Start/Resume Button */}
                <motion.button
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onStart}
                    className="px-12 py-5 text-2xl font-black rounded-full bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:shadow-[0_0_60px_rgba(168,85,247,0.6)] transition-all duration-300"
                >
                    {hasProgress ? '→ Resume Journey' : '→ Start Journey'}
                </motion.button>

                {/* Decorative Elements */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="mt-16 text-white/20 text-sm tracking-widest uppercase"
                >
                    Tap to Begin
                </motion.div>

            </motion.div>

            {/* Floating Particles (optional decoration) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-white/10 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.1, 0.3, 0.1],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

        </div>
    );
};

export default HomePage;
