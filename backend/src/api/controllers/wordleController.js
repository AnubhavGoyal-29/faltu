const { submitWordleGuess, getDailyWord, getWordleHint } = require('../../services/wordleService');

// Submit wordle guess
const submitGuess = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { guess } = req.body;
    const user = req.user; // Already fetched in auth middleware

    if (!guess || guess.length !== 5) {
      return res.status(400).json({ error: 'Word 5 letters ka hona chahiye!' });
    }

    const result = await submitWordleGuess(userId, guess, user);
    res.json(result);
  } catch (error) {
    console.error('Wordle guess error:', error);
    res.status(500).json({ error: 'Wordle guess failed' });
  }
};

// Get wordle hint
const getHint = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const user = req.user; // Already fetched in auth middleware
    const attempts = parseInt(req.query.attempts) || 0;

    const hint = await getWordleHint(attempts, user);
    res.json(hint);
  } catch (error) {
    console.error('Wordle hint error:', error);
    res.status(500).json({ error: 'Hint generate nahi hua' });
  }
};

// Get daily word info (reveals word only if game is lost)
const getDailyInfo = async (req, res) => {
  try {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const revealWord = req.query.reveal === 'true'; // Only reveal if explicitly requested
    
    const dailyWord = await getDailyWord();
    
    res.json({
      day: dayOfYear,
      wordLength: 5,
      message: 'Aaj ka word 5 letters ka hai! Guess karo!',
      correctWord: revealWord ? dailyWord : null // Only reveal if game is lost
    });
  } catch (error) {
    console.error('Wordle info error:', error);
    res.status(500).json({ error: 'Info fetch nahi hua' });
  }
};

module.exports = {
  submitGuess,
  getHint,
  getDailyInfo
};

