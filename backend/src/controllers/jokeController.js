const { getRandomJoke, getAIJoke } = require('../services/jokeService');

// Get random joke
const getJoke = async (req, res) => {
  try {
    const joke = await getAIJoke();
    res.json(joke);
  } catch (error) {
    console.error('Get joke error:', error);
    // Fallback to random joke
    const fallbackJoke = getRandomJoke();
    res.json(fallbackJoke);
  }
};

module.exports = {
  getJoke
};

