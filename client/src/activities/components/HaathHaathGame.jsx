import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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
    <div className="h-full w-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-pink-900 to-rose-900">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md w-full text-center"
      >
        <h2 className="text-3xl font-bold mb-4 text-white">
          Haath-Haath Game ✂️
        </h2>
        <p className="text-white/70 mb-2">Beat AI 3 times!</p>
        <p className="text-white/50 text-sm mb-8">Wins: {wins}/3</p>

        {!userChoice ? (
          <div className="space-y-4">
            <button
              onClick={() => handleChoice('rock')}
              className="w-full py-6 bg-gray-500 text-white rounded-xl font-bold text-xl hover:bg-gray-600 transition"
            >
              🪨 Rock
            </button>
            <button
              onClick={() => handleChoice('paper')}
              className="w-full py-6 bg-blue-500 text-white rounded-xl font-bold text-xl hover:bg-blue-600 transition"
            >
              📄 Paper
            </button>
            <button
              onClick={() => handleChoice('scissors')}
              className="w-full py-6 bg-green-500 text-white rounded-xl font-bold text-xl hover:bg-green-600 transition"
            >
              ✂️ Scissors
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <p className="text-white mb-2">You: {userChoice === 'rock' ? '🪨' : userChoice === 'paper' ? '📄' : '✂️'}</p>
              <p className="text-white">AI: {aiChoice === 'rock' ? '🪨' : aiChoice === 'paper' ? '📄' : '✂️'}</p>
            </div>
            {roundResult && (
              <motion.p
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-2xl font-bold text-white"
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

