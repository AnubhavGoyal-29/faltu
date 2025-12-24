import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { generateAIContent, parseAIContent } from '../../utils/ai.js';
import { ACTIVITY_DESCRIPTIONS } from '../registry.js';

// Function to create word with missing letters
function createWordWithBlanks(word, missingRatio = 0.4) {
  const wordArray = word.split('');
  const totalLetters = wordArray.length;
  const numToHide = Math.max(1, Math.floor(totalLetters * missingRatio));
  
  // Create array of indices
  const indices = wordArray.map((_, i) => i);
  
  // Shuffle and pick random indices to hide
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  
  const hiddenIndices = indices.slice(0, numToHide);
  const displayWord = wordArray.map((char, i) => 
    hiddenIndices.includes(i) ? '_' : char
  );
  
  return displayWord.join(' ');
}

function Shabdbaazi({ activity, onComplete }) {
  const [word, setWord] = useState(null);
  const [displayWord, setDisplayWord] = useState('');
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState(3);
  const [result, setResult] = useState(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    // Prevent duplicate calls (React StrictMode + replay button)
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    const loadWord = async () => {
      try {
        // Try to generate AI word
        const aiContent = await generateAIContent('shabdbaazi');
        console.log("aiContent", aiContent);
        const parsed = parseAIContent(aiContent);
        console.log("parsed", parsed);
        if (parsed && parsed.word && parsed.hint && parsed.answer) {
          setWord(parsed);
          setDisplayWord(createWordWithBlanks(parsed.answer));
        } else {
          throw new Error('Invalid format');
        }
      } catch (error) {
        console.error('Error generating word:', error);
        // Server should always return fallback, but if parsing fails, use default
        const defaultWord = { word: "CHUTKULA", hint: "Funny thing", answer: "CHUTKULA" };
        setWord(defaultWord);
        setDisplayWord(createWordWithBlanks(defaultWord.answer));
      } finally {
        setIsGenerating(false);
      }
    };

    loadWord();
  }, []);

  const handleGuess = () => {
    if (!guess.trim()) return;
    
    if (guess.toUpperCase() === word.answer) {
      setResult('win');
      setTimeout(() => onComplete(), 2000);
    } else {
      setAttempts(attempts - 1);
      if (attempts - 1 === 0) {
        setResult('lose');
        setTimeout(() => onComplete(), 2000);
      }
      setGuess('');
    }
  };

  if (!word || isGenerating) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-white/50">Generating word...</div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col items-center justify-start pt-8 pb-16 px-6 bg-gradient-to-br from-[#0a0a0a] via-[#0a0a1a] to-[#0a0a0a] overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md w-full"
      >
        <h2 className="text-3xl font-black text-center mb-2">
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">Shabdbaazi</span> 📝
        </h2>
        <p className="text-center text-white/40 text-sm mb-6">
          {ACTIVITY_DESCRIPTIONS.shabdbaazi}
        </p>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 mb-6 border border-white/10">
          <p className="text-center text-white/70 mb-4">Hint: {word.hint}</p>
          <p className="text-center text-white/90 text-3xl font-bold mb-4 tracking-wider">
            {displayWord.split(' ').map((char, i) => (
              <span key={i} className="mx-1 inline-block min-w-[0.5em]">
                {char === '_' ? (
                  <span className="text-cyan-400 border-b-2 border-cyan-400 pb-1">{char}</span>
                ) : (
                  char
                )}
              </span>
            ))}
          </p>
          <p className="text-center text-white/60 text-sm">
            Attempts left: {attempts}
          </p>
        </div>

        {!result && (
          <div>
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
              placeholder="Guess the word"
              className="w-full py-4 px-4 rounded-2xl bg-white/10 backdrop-blur-lg text-white placeholder-white/50 text-center text-lg mb-4 focus:outline-none focus:bg-white/15 focus:ring-2 focus:ring-cyan-500/50 border border-white/10"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGuess}
              className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-2xl font-bold text-lg hover:from-cyan-700 hover:to-blue-700 transition-all shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50"
            >
              Guess
            </motion.button>
          </div>
        )}

        {result && (
          <motion.p
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-center text-2xl font-bold text-white/90"
          >
            {result === 'win' ? '🎉 Sahi!' : `Answer: ${word.answer}`}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}

export default Shabdbaazi;

