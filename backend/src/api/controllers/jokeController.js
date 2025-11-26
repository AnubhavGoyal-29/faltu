const { getRandomJoke } = require('../../services/jokeService');

// Get random joke
const getJoke = async (req, res) => {
  try {
    // req.user already contains user data from auth middleware, no need to query again
    const user = req.user || null;
    const joke = await getRandomJoke(user);
    
    // Format response
    const jokeText = joke.setup 
      ? `${joke.setup} ${joke.punchline}`
      : joke.punchline || joke.joke;
    
    res.json({
      joke: jokeText,
      setup: joke.setup || '',
      punchline: joke.punchline || joke.joke || jokeText,
      category: joke.category || 'random',
      source: joke.source || 'database'
    });
  } catch (error) {
    console.error(`🤖 [JOKES] ❌ Error:`, error.message);
    // Fallback to random joke
    const fallbackJoke = await getRandomJoke();
    const jokeText = fallbackJoke.setup 
      ? `${fallbackJoke.setup} ${fallbackJoke.punchline}`
      : fallbackJoke.punchline || fallbackJoke.joke;
    
    res.json({
      joke: jokeText,
      setup: fallbackJoke.setup || '',
      punchline: fallbackJoke.punchline || fallbackJoke.joke || jokeText,
      category: fallbackJoke.category || 'random',
      source: 'fallback'
    });
  }
};

module.exports = {
  getJoke
};

