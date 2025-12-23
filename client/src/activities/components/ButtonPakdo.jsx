import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ACTIVITY_DESCRIPTIONS } from '../registry.js';

function ButtonPakdo({ activity, onComplete }) {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [timeLeft, setTimeLeft] = useState(5);
  const [caught, setCaught] = useState(false);
  const [gameState, setGameState] = useState('ready');
  const buttonRef = useRef(null);
  const lastMoveTime = useRef(0);

  useEffect(() => {
    if (gameState === 'playing' && !caught) {
      // Move button with much larger distances for more dramatic movement
      const moveInterval = setInterval(() => {
        const now = Date.now();
        // Only move if enough time has passed (prevents too rapid movement)
        if (now - lastMoveTime.current > 200) {
          // Much larger movement range - button moves across very wide distances
          setPosition({
            x: Math.random() * 80 + 10, // 10-90% (80% range for very large jumps)
            y: Math.random() * 70 + 15, // 15-85% (70% range for very large jumps)
          });
          lastMoveTime.current = now;
        }
      }, 100); // Faster interval for more frequent large jumps

      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameState('done');
            setTimeout(() => onComplete(), 2000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearInterval(moveInterval);
        clearInterval(timer);
      };
    }
  }, [gameState, caught, onComplete]);

  const handleStart = () => {
    setGameState('playing');
  };

  const handleMouseEnter = () => {
    // When mouse enters button area, move it away quickly with very large distance
    if (gameState === 'playing' && !caught) {
      const now = Date.now();
      if (now - lastMoveTime.current > 100) {
        setPosition({
          x: Math.random() * 80 + 10, // Very large jump away
          y: Math.random() * 70 + 15,
        });
        lastMoveTime.current = now;
      }
    }
  };

  const handleCatch = () => {
    if (gameState === 'playing' && !caught) {
      // Higher chance to "dodge" even on click to make it harder
      const dodgeChance = Math.random();
      if (dodgeChance < 0.35) {
        // 35% chance to dodge the click
        handleMouseEnter();
        return;
      }
      setCaught(true);
      setGameState('done');
      setTimeout(() => onComplete(), 2000);
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-start pt-8 pb-16 px-6 bg-gradient-to-br from-[#0a0a0a] via-[#0a0a1a] to-[#0a0a0a] relative overflow-hidden">
      {gameState === 'ready' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <h2 className="text-3xl font-black mb-2">
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">Button Pakdo!</span> 🎯
          </h2>
          <p className="text-center text-white/40 text-sm mb-6">
            {ACTIVITY_DESCRIPTIONS.button_pakdo}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            className="py-4 px-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50"
          >
            Start
          </motion.button>
        </motion.div>
      )}

      {gameState === 'playing' && (
        <>
          <div className="absolute top-6 left-6 text-white/90 text-2xl font-bold">
            {timeLeft}s
          </div>
          <motion.button
            ref={buttonRef}
            animate={{
              x: `${position.x}%`,
              y: `${position.y}%`,
            }}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 30,
              mass: 0.8
            }}
            onMouseEnter={handleMouseEnter}
            onClick={handleCatch}
            className="absolute w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 text-black rounded-full font-bold text-sm hover:from-yellow-500 hover:to-orange-600 transition cursor-pointer flex items-center justify-center shadow-2xl shadow-yellow-500/50"
            style={{
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'auto',
            }}
            whileHover={{ scale: 1.1 }}
          >
            Catch!
          </motion.button>
        </>
      )}

      {gameState === 'done' && (
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-white/90">
            {caught ? '🎉 Caught!' : '⏰ Time Up!'}
          </h2>
        </motion.div>
      )}
    </div>
  );
}

export default ButtonPakdo;

