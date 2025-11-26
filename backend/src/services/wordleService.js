const { isAIEnabled, callAI } = require('../ai/handlers/aiDecisionEngine');
const { addPoints } = require('./pointsService');
const { getOrSet } = require('../utils/redisClient');
const cacheConfig = require('../config/cache');

// Hinglish words for Wordle (5-letter words)
const hinglishWords = [
  'BAKCHOD', 'FALTU', 'MASTI', 'CHAOS', 'FUNNY',
  'HAPPY', 'CRAZY', 'SILLY', 'RANDOM', 'POINT',
  'LAUGH', 'SMILE', 'JOY', 'PARTY', 'DANCE',
  'MUSIC', 'SONG', 'BEAT', 'RHYME', 'LYRIC',
  'GAME', 'PLAY', 'WIN', 'LOSE', 'DRAW',
  'SCORE', 'POINT', 'LEVEL', 'ROUND', 'MATCH',
  'FRIEND', 'BUDDY', 'PAL', 'MATE', 'CHUM',
  'LOVE', 'LIKE', 'CARE', 'HUG', 'KISS',
  'FOOD', 'EAT', 'DRINK', 'TASTE', 'YUMMY',
  'SLEEP', 'DREAM', 'WAKE', 'REST', 'NAP',
  'WORK', 'JOB', 'TASK', 'DONE', 'EASY',
  'HARD', 'TOUGH', 'EASY', 'SIMPLE', 'BASIC'
].map(w => w.substring(0, 5).toUpperCase()); // Ensure 5 letters

// Get daily word (changes every day) - with caching
const getDailyWord = async () => {
  const today = new Date().toISOString().split('T')[0];
  const cacheKey = cacheConfig.keys.wordleDaily(today);
  
  return await getOrSet(
    cacheKey,
    () => {
      const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
      const wordIndex = dayOfYear % hinglishWords.length;
      return hinglishWords[wordIndex];
    },
    cacheConfig.ttl.wordleDaily
  );
};

// Check word guess
const checkWordGuess = (guess, correctWord) => {
  const result = [];
  const correctLetters = correctWord.split('');
  const guessLetters = guess.toUpperCase().split('');
  const used = new Array(5).fill(false);

  // First pass: exact matches
  for (let i = 0; i < 5; i++) {
    if (guessLetters[i] === correctLetters[i]) {
      result[i] = { letter: guessLetters[i], status: 'correct' };
      used[i] = true;
    }
  }

  // Second pass: wrong position
  for (let i = 0; i < 5; i++) {
    if (result[i]) continue;
    
    for (let j = 0; j < 5; j++) {
      if (!used[j] && guessLetters[i] === correctLetters[j]) {
        result[i] = { letter: guessLetters[i], status: 'present' };
        used[j] = true;
        break;
      }
    }
    
    if (!result[i]) {
      result[i] = { letter: guessLetters[i], status: 'absent' };
    }
  }

  return result;
};

// Submit wordle guess
const submitWordleGuess = async (userId, guess, user = null) => {
  const dailyWord = await getDailyWord();
  const guessUpper = guess.toUpperCase().substring(0, 5);
  
  if (guessUpper.length !== 5) {
    return {
      success: false,
      error: 'Word 5 letters ka hona chahiye!'
    };
  }

  const result = checkWordGuess(guessUpper, dailyWord);
  const isCorrect = result.every(r => r.status === 'correct');

  if (isCorrect) {
    // Award points based on attempt number (would need to track attempts)
    await addPoints(userId, 100, 'wordle_win', user, {
      word: dailyWord,
      guess: guessUpper
    });

    return {
      success: true,
      correct: true,
      result: result,
      message: `Sahi hai bhai! ${dailyWord} word mil gaya! 100 points mil gaye! 🎉`,
      correctWord: dailyWord
    };
  }

  return {
    success: true,
    correct: false,
    result: result,
    message: 'Galat hai! Try again!',
    correctWord: null // Don't reveal word yet
  };
};

// Get wordle hint (AI-generated)
const getWordleHint = async (attempts, user = null) => {
  if (isAIEnabled() && user) {
    try {
      const dailyWord = await getDailyWord();
      const aiResponse = await callAI({
        user,
        reason: 'wordle_hint',
        appState: {
          word: dailyWord,
          attempts: attempts,
          action: 'get_hint'
        }
      });

      if (aiResponse && aiResponse.hint) {
        return {
          hint: aiResponse.hint,
          source: 'ai'
        };
      }
    } catch (error) {
      console.error(`🤖 [WORDLE] Hint error:`, error.message);
    }
  }

  // Fallback hint
  const dailyWord = getDailyWord();
  const randomLetter = dailyWord[Math.floor(Math.random() * 5)];
  return {
    hint: `Ek letter hai: ${randomLetter}`,
    source: 'fallback'
  };
};

module.exports = {
  getDailyWord,
  submitWordleGuess,
  getWordleHint,
  checkWordGuess
};

