import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const FACTS = [
  { text: "Bananas are berries, but strawberries aren't.", answer: true },
  { text: "Octopuses have three hearts.", answer: true },
  { text: "Wombats poop in cubes.", answer: true },
  { text: "Sharks have been around longer than trees.", answer: true },
  { text: "Honey never spoils.", answer: true },
  { text: "A group of flamingos is called a 'flamboyance'.", answer: true },
  { text: "Dolphins have names for each other.", answer: true },
  { text: "The human brain uses 20% of the body's energy.", answer: true },
  { text: "Cows have best friends.", answer: true },
  { text: "Penguins can jump 6 feet in the air.", answer: false },
];

function SachYaFaltu({ activity, onComplete }) {
  const [fact, setFact] = useState(null);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const randomFact = FACTS[Math.floor(Math.random() * FACTS.length)];
    setFact(randomFact);
  }, []);

  const handleChoice = (choice) => {
    if (selected) return;
    setSelected(choice);
    setShowResult(true);
    
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  if (!fact) return null;

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-900 to-pink-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-white">
          Sach Ya Faltu?
        </h2>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8">
          <p className="text-xl text-center text-white leading-relaxed">
            {fact.text}
          </p>
        </div>

        {!showResult ? (
          <div className="flex gap-4">
            <button
              onClick={() => handleChoice(true)}
              className="flex-1 py-4 bg-green-500 text-white rounded-xl font-bold text-lg hover:bg-green-600 transition"
            >
              Sach
            </button>
            <button
              onClick={() => handleChoice(false)}
              className="flex-1 py-4 bg-red-500 text-white rounded-xl font-bold text-lg hover:bg-red-600 transition"
            >
              Faltu
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-center"
          >
            <p className="text-2xl font-bold text-white mb-2">
              {selected === fact.answer ? '🎉 Sahi!' : '😅 Galat!'}
            </p>
            <p className="text-white/70">
              {fact.answer ? 'Ye sach hai!' : 'Ye faltu hai!'}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default SachYaFaltu;

