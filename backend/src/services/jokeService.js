// Fallback jokes if AI is not available
const fallbackJokes = [
  "Why don't scientists trust atoms? Because they make up everything!",
  "Why did the scarecrow win an award? He was outstanding in his field!",
  "Why don't eggs tell jokes? They'd crack each other up!",
  "What do you call a fake noodle? An impasta!",
  "Why did the math book look so sad? Because it had too many problems!",
  "What do you call a bear with no teeth? A gummy bear!",
  "Why don't programmers like nature? It has too many bugs!",
  "What's the best thing about Switzerland? I don't know, but the flag is a big plus!",
  "Why did the coffee file a police report? It got mugged!",
  "What do you call a sleeping bull? A bulldozer!",
  "Why don't skeletons fight each other? They don't have the guts!",
  "What's orange and sounds like a parrot? A carrot!",
  "Why did the tomato turn red? Because it saw the salad dressing!",
  "What do you call a fish wearing a bowtie? Sofishticated!",
  "Why don't oysters donate to charity? Because they're shellfish!",
  "What do you call a factory that makes okay products? A satisfactory!",
  "Why did the golfer bring two pairs of pants? In case he got a hole in one!",
  "What's the difference between a poorly dressed man on a trampoline and a well-dressed man on a trampoline? Attire!",
  "Why don't scientists trust stairs? Because they're always up to something!",
  "What do you call a bear in the rain? A drizzly bear!"
];

// Generate a random joke
const getRandomJoke = () => {
  // For now, return a random fallback joke
  // In production, you could integrate with an AI API here
  const randomIndex = Math.floor(Math.random() * fallbackJokes.length);
  return {
    joke: fallbackJokes[randomIndex],
    source: 'fallback'
  };
};

// AI-generated joke (placeholder - can be integrated with OpenAI, etc.)
const getAIJoke = async () => {
  // This is a placeholder for AI integration
  // You can integrate with OpenAI API, Hugging Face, etc.
  // For now, return a fallback joke
  return getRandomJoke();
};

module.exports = {
  getRandomJoke,
  getAIJoke
};

