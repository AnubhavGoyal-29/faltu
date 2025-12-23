import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ACTIVITY_DESCRIPTIONS } from '../registry.js';

const CHOICES = ['rock', 'paper', 'scissors'];
const BEATS = {
  rock: 'scissors',
  paper: 'rock',
  scissors: 'paper',
};

function HaathHaathGame({ activity, onComplete }) {
  const [wins, setWins] = useState(0);
  const [round, setRound] = useState(1);
  const [userChoice, setUserChoice] = useState(null);
  const [aiChoice, setAiChoice] = useState(null);
  const [roundResult, setRoundResult] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleChoice = (choice) => {
    if (userChoice || isCompleted) return;
    
    const ai = CHOICES[Math.floor(Math.random() * CHOICES.length)];
    setUserChoice(choice);
    setAiChoice(ai);
    
    setTimeout(() => {
      if (BEATS[choice] === ai) {
        // Use functional update to avoid stale state
        setWins(prevWins => {
          const newWins = prevWins + 1;
          setRoundResult('win');
          
          if (newWins >= 3) {
            // User won 3 times - complete activity
            setIsCompleted(true);
            setTimeout(() => onComplete(), 2000);
          } else {
            // Continue to next round
            setTimeout(() => {
              setRound(prevRound => prevRound + 1);
              setUserChoice(null);
              setAiChoice(null);
              setRoundResult(null);
            }, 2000);
          }
          
          return newWins;
        });
      } else if (choice === ai) {
        setRoundResult('tie');
        setTimeout(() => {
          setUserChoice(null);
          setAiChoice(null);
          setRoundResult(null);
        }, 2000);
      } else {
        // User lost - complete activity
        setRoundResult('lose');
        setIsCompleted(true);
        setTimeout(() => onComplete(), 2000);
      }
    }, 500);
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-start pt-8 pb-16 px-6 bg-gradient-to-br from-[#0a0a0a] via-[#1a050a] to-[#0a0a0a] overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md w-full text-center"
      >
        <h2 className="text-3xl font-black mb-2">
          <span className="bg-gradient-to-r from-pink-400 via-rose-500 to-pink-500 bg-clip-text text-transparent">Haath-Haath Game</span> ✂️
        </h2>
        <p className="text-center text-white/40 text-sm mb-2">
          {ACTIVITY_DESCRIPTIONS.haath_haath_game}
        </p>
        <p className="text-white/60 mb-2">Beat AI 3 times!</p>
        <p className="text-white/50 text-sm mb-8">Wins: {wins}/3</p>

        {!userChoice ? (
          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleChoice('rock')}
              className="w-full py-6 bg-gradient-to-r from-gray-600 to-slate-700 text-white rounded-2xl font-bold text-xl hover:from-gray-700 hover:to-slate-800 transition-all shadow-2xl shadow-gray-500/30 hover:shadow-gray-500/50"
            >
              🪨 Rock
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleChoice('paper')}
              className="w-full py-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50"
            >
              📄 Paper
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleChoice('scissors')}
              className="w-full py-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-bold text-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-2xl shadow-green-500/30 hover:shadow-green-500/50"
            >
              ✂️ Scissors
            </motion.button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <p className="text-white/90 mb-2">You: {userChoice === 'rock' ? '🪨' : userChoice === 'paper' ? '📄' : '✂️'}</p>
              <p className="text-white/90">AI: {aiChoice === 'rock' ? '🪨' : aiChoice === 'paper' ? '📄' : '✂️'}</p>
            </div>
            {roundResult && (
              <motion.p
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-2xl font-bold text-white/90"
              >
                {roundResult === 'win' ? '🎉 You win!' : roundResult === 'tie' ? '🤝 Tie!' : '❌ You lose!'}
              </motion.p>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default HaathHaathGame;

