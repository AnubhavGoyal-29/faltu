import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ACTIVITY_DESCRIPTIONS } from '../registry.js';

const CHOICES = ['rock', 'paper', 'scissors'];
const BEATS = {
  rock: 'scissors',
  paper: 'rock',
  scissors: 'paper',
};

const CHOICE_EMOJIS = {
  rock: '🪨',
  paper: '📄',
  scissors: '✂️',
};

const CHOICE_NAMES = {
  rock: 'Stone',
  paper: 'Paper',
  scissors: 'Scissors',
};

const MAX_ROUNDS = 3;

function HaathHaathGame({ activity, onComplete }) {
  const [userWins, setUserWins] = useState(0);
  const [aiWins, setAiWins] = useState(0);
  const [round, setRound] = useState(1);
  const [userChoice, setUserChoice] = useState(null);
  const [aiChoice, setAiChoice] = useState(null);
  const [roundResult, setRoundResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showFinalVerdict, setShowFinalVerdict] = useState(false);
  const [roundHistory, setRoundHistory] = useState([]);

  const handleChoice = (choice) => {
    if (userChoice || showFinalVerdict) return;
    
    const ai = CHOICES[Math.floor(Math.random() * CHOICES.length)];
    setUserChoice(choice);
    setAiChoice(ai);
    
    setTimeout(() => {
      let result;
      if (BEATS[choice] === ai) {
        result = 'win';
        setUserWins(prev => prev + 1);
      } else if (choice === ai) {
        result = 'tie';
      } else {
        result = 'lose';
        setAiWins(prev => prev + 1);
      }
      
      setRoundResult(result);
      setShowResult(true);
      
      // Add to history
      setRoundHistory(prev => [...prev, { round, userChoice: choice, aiChoice: ai, result }]);
      
      // Check if match is over
      if (round >= MAX_ROUNDS) {
        setTimeout(() => {
          setShowFinalVerdict(true);
        }, 2000);
      } else {
        // Continue to next round
        setTimeout(() => {
          setRound(prev => prev + 1);
          setUserChoice(null);
          setAiChoice(null);
          setRoundResult(null);
          setShowResult(false);
        }, 2500);
      }
    }, 800);
  };

  const getFinalWinner = () => {
    if (userWins > aiWins) return 'user';
    if (aiWins > userWins) return 'ai';
    return 'tie';
  };

  // Mark activity as complete when final verdict is shown
  useEffect(() => {
    if (showFinalVerdict) {
      onComplete();
    }
  }, [showFinalVerdict, onComplete]);

  if (showFinalVerdict) {
    const winner = getFinalWinner();
    return (
      <div className="h-full w-full flex flex-col items-center justify-center px-6 bg-gradient-to-br from-[#0a0a0a] via-[#1a050a] to-[#0a0a0a]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-8"
          >
            <h2 className="text-5xl font-black mb-6">
              {winner === 'user' ? (
                <span className="bg-gradient-to-r from-green-400 via-emerald-500 to-green-500 bg-clip-text text-transparent">
                  🏆 You Win!
                </span>
              ) : winner === 'ai' ? (
                <span className="bg-gradient-to-r from-red-400 via-rose-500 to-red-500 bg-clip-text text-transparent">
                  😔 AI Wins!
                </span>
              ) : (
                <span className="bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
                  🤝 It's a Tie!
                </span>
              )}
            </h2>
            <div className="text-3xl font-bold text-white/90">
              <div className="flex justify-center items-center gap-8">
                <div className="text-green-400">You: {userWins}</div>
                <div className="text-white/50">-</div>
                <div className="text-red-400">AI: {aiWins}</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col items-center justify-start pt-8 pb-16 px-6 bg-gradient-to-br from-[#0a0a0a] via-[#1a050a] to-[#0a0a0a] overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md w-full text-center"
      >
        <h2 className="text-4xl font-black mb-2">
          <span className="bg-gradient-to-r from-pink-400 via-rose-500 to-pink-500 bg-clip-text text-transparent">
            Stone Paper Scissors
          </span>
        </h2>
        <p className="text-center text-white/40 text-sm mb-6">
          Best of 3 - Choose your weapon!
        </p>

        {/* Score Display */}
        <div className="mb-8">
          <div className="flex justify-center items-center gap-6 mb-4">
            <div className="bg-white/5 rounded-xl px-6 py-3 border border-white/10">
              <div className="text-white/60 text-xs mb-1">You</div>
              <div className="text-3xl font-bold text-green-400">{userWins}</div>
            </div>
            <div className="text-white/30 text-2xl">vs</div>
            <div className="bg-white/5 rounded-xl px-6 py-3 border border-white/10">
              <div className="text-white/60 text-xs mb-1">AI</div>
              <div className="text-3xl font-bold text-red-400">{aiWins}</div>
            </div>
          </div>
          <div className="text-white/50 text-sm">
            Round {round} of {MAX_ROUNDS}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key="choices"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleChoice('rock')}
                className="w-full py-6 bg-gradient-to-r from-gray-600 to-slate-700 text-white rounded-2xl font-bold text-xl hover:from-gray-700 hover:to-slate-800 transition-all shadow-2xl shadow-gray-500/30 hover:shadow-gray-500/50 border-2 border-transparent hover:border-gray-400/50"
              >
                <span className="text-3xl mr-3">{CHOICE_EMOJIS.rock}</span>
                {CHOICE_NAMES.rock}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleChoice('paper')}
                className="w-full py-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 border-2 border-transparent hover:border-blue-400/50"
              >
                <span className="text-3xl mr-3">{CHOICE_EMOJIS.paper}</span>
                {CHOICE_NAMES.paper}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleChoice('scissors')}
                className="w-full py-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-bold text-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-2xl shadow-green-500/30 hover:shadow-green-500/50 border-2 border-transparent hover:border-green-400/50"
              >
                <span className="text-3xl mr-3">{CHOICE_EMOJIS.scissors}</span>
                {CHOICE_NAMES.scissors}
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="space-y-6"
            >
              {/* Choices Display */}
              <div className="flex justify-center items-center gap-8 mb-6">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="text-center"
                >
                  <div className="text-6xl mb-2">{CHOICE_EMOJIS[userChoice]}</div>
                  <div className="text-white/80 font-semibold">You</div>
                  <div className="text-white/50 text-sm">{CHOICE_NAMES[userChoice]}</div>
                </motion.div>
                <div className="text-4xl text-white/30">vs</div>
                <motion.div
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.4, type: "spring" }}
                  className="text-center"
                >
                  <div className="text-6xl mb-2">{CHOICE_EMOJIS[aiChoice]}</div>
                  <div className="text-white/80 font-semibold">AI</div>
                  <div className="text-white/50 text-sm">{CHOICE_NAMES[aiChoice]}</div>
                </motion.div>
              </div>

              {/* Result Message */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                className={`text-3xl font-black py-4 rounded-2xl ${
                  roundResult === 'win' 
                    ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border-2 border-green-500/30' 
                    : roundResult === 'lose'
                    ? 'bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-400 border-2 border-red-500/30'
                    : 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-400 border-2 border-yellow-500/30'
                }`}
              >
                {roundResult === 'win' ? '🎉 You Win This Round!' : 
                 roundResult === 'lose' ? '😔 AI Wins This Round!' : 
                 '🤝 It\'s a Tie!'}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default HaathHaathGame;

