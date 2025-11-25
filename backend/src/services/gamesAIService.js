const { callAI } = require('./aiDecisionEngine');

// Generate daily bakchodi challenge
const generateDailyChallenge = async (user) => {
  const challenges = [
    "Explain your day using only emojis",
    "Take a photo of something that looks like a dinosaur but isn't",
    "Describe your mood using only food names",
    "Write a haiku about your last meal",
    "Tell a story where you're the villain",
    "Describe yourself as a superhero with the worst superpower",
    "Write a breakup letter to your alarm clock",
    "Explain quantum physics using only memes",
    "Describe your ideal day using only movie quotes",
    "Write a love letter to your WiFi router"
  ];

  const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];

  if (user) {
    try {
      const aiResponse = await callAI({
        user,
        reason: 'games',
        appState: {
          game: 'bakchodi_challenge',
          action: 'generate_challenge'
        }
      });

      if (aiResponse && aiResponse.challenge) {
        return aiResponse.challenge;
      }
    } catch (error) {
      console.error('🎮 [GAMES AI] Challenge generation error:', error);
    }
  }

  return randomChallenge;
};

// Score and review bakchodi submission
const scoreBakchodiSubmission = async (user, challenge, submission) => {
  try {
    const aiResponse = await callAI({
      user,
      reason: 'games',
      appState: {
        game: 'bakchodi_challenge',
        action: 'score_submission',
        challenge,
        submission
      }
    });

    if (aiResponse) {
      return {
        score: aiResponse.score || Math.floor(Math.random() * 50) + 50,
        review: aiResponse.review || 'Bhai mast hai! Keep it up!'
      };
    }
  } catch (error) {
    console.error('🎮 [GAMES AI] Scoring error:', error);
  }

  // Fallback
  return {
    score: Math.floor(Math.random() * 50) + 50,
    review: 'Bhai mast hai! Keep it up!'
  };
};

// Generate debate topic
const generateDebateTopic = async () => {
  const topics = [
    "Is aloo paratha superior to pizza?",
    "Should we replace all meetings with memes?",
    "Is sleeping a superpower?",
    "Are socks with sandals actually cool?",
    "Should we rename Monday to 'Whyday'?",
    "Is pineapple on pizza a crime or a blessing?",
    "Should we have a national holiday for naps?",
    "Are emojis a language?",
    "Should we replace passwords with 'favorite snack'?",
    "Is procrastination actually productive?"
  ];

  return topics[Math.floor(Math.random() * topics.length)];
};

// Generate counter argument and determine winner
const generateDebateResponse = async (user, topic, userArgument) => {
  try {
    const aiResponse = await callAI({
      user,
      reason: 'games',
      appState: {
        game: 'debate',
        topic,
        user_argument: userArgument
      }
    });

    if (aiResponse) {
      return {
        counterArgument: aiResponse.counter_argument || 'Tum galat ho bhai!',
        winner: aiResponse.winner || (Math.random() > 0.5 ? 'user' : 'ai'),
        explanation: aiResponse.explanation || 'Mast debate thi!'
      };
    }
  } catch (error) {
    console.error('🎮 [GAMES AI] Debate response error:', error);
  }

  // Fallback
  return {
    counterArgument: 'Tum galat ho bhai! Main sahi bol raha hoon!',
    winner: Math.random() > 0.5 ? 'user' : 'ai',
    explanation: 'Mast debate thi! Dono ne achha kiya!'
  };
};

// Score meme caption
const scoreMemeCaption = async (user, imageUrl, caption) => {
  try {
    const aiResponse = await callAI({
      user,
      reason: 'games',
      appState: {
        game: 'meme_battle',
        caption
      }
    });

    if (aiResponse) {
      return {
        humor: aiResponse.humor_score || Math.floor(Math.random() * 30) + 50,
        creativity: aiResponse.creativity_score || Math.floor(Math.random() * 30) + 50,
        nonsense: aiResponse.nonsense_score || Math.floor(Math.random() * 30) + 50
      };
    }
  } catch (error) {
    console.error('🎮 [GAMES AI] Meme scoring error:', error);
  }

  // Fallback
  return {
    humor: Math.floor(Math.random() * 30) + 50,
    creativity: Math.floor(Math.random() * 30) + 50,
    nonsense: Math.floor(Math.random() * 30) + 50
  };
};

// Generate future prediction
const generateFuturePrediction = async (user, name, mood, favSnack) => {
  try {
    const aiResponse = await callAI({
      user,
      reason: 'games',
      appState: {
        game: 'future_prediction',
        name,
        mood,
        fav_snack: favSnack
      }
    });

    if (aiResponse && aiResponse.prediction) {
      return aiResponse.prediction;
    }
  } catch (error) {
    console.error('🎮 [GAMES AI] Future prediction error:', error);
  }

  // Fallback predictions
  const fallbackPredictions = [
    `Tum ${favSnack} ke raja banoge!`,
    `Tumhara mood ${mood} rahega har din!`,
    `Tum ek din ${name} the Great banoge!`,
    `Tumhara future bright hai... literally, tum light bulb banoge!`,
    `Tum ek din famous hoge... apne snacks ke liye!`
  ];

  return fallbackPredictions[Math.floor(Math.random() * fallbackPredictions.length)];
};

// Generate dare
const generateDare = async (user) => {
  try {
    const aiResponse = await callAI({
      user,
      reason: 'games',
      appState: {
        game: 'dare_machine',
        action: 'generate_dare'
      }
    });

    if (aiResponse && aiResponse.dare) {
      return aiResponse.dare;
    }
  } catch (error) {
    console.error('🎮 [GAMES AI] Dare generation error:', error);
  }

  // Fallback dares
  const dares = [
    'Apne phone ko 1 minute ke liye upside down rakho',
    'Apne best friend ko "I love you" bolo... in front of everyone',
    'Next 5 minutes mein sirf Hindi mein baat karo',
    'Apne favorite song ko full volume pe gaao',
    'Ek random person ko compliment do',
    'Apne pet ko 10 baar "good boy/girl" bolo',
    'Apne reflection ko 30 seconds tak stare karo',
    'Ek funny dance karo for 10 seconds'
  ];

  return dares[Math.floor(Math.random() * dares.length)];
};

// Generate roast
const generateRoast = async (user) => {
  try {
    const aiResponse = await callAI({
      user,
      reason: 'games',
      appState: {
        game: 'roast_me',
        action: 'generate_roast'
      }
    });

    if (aiResponse && aiResponse.roast) {
      return aiResponse.roast;
    }
  } catch (error) {
    console.error('🎮 [GAMES AI] Roast generation error:', error);
  }

  // Fallback roasts (funny, not abusive)
  const roasts = [
    'Tumhara WiFi password "password123" hai, na?',
    'Tumhara phone battery life tumhare attention span se zyada hai',
    'Tumhara favorite emoji 😂 hai kyunki tum actually funny nahi ho',
    'Tumhara Netflix "Are you still watching?" tumhare liye hi hai',
    'Tumhara alarm clock tumse zyada productive hai',
    'Tumhara Google search history: "how to be cool"',
    'Tumhara Spotify playlist: "songs I pretend to like"',
    'Tumhara Instagram bio: "Living my best life" (while scrolling memes)'
  ];

  return roasts[Math.floor(Math.random() * roasts.length)];
};

module.exports = {
  generateDailyChallenge,
  scoreBakchodiSubmission,
  generateDebateTopic,
  generateDebateResponse,
  scoreMemeCaption,
  generateFuturePrediction,
  generateDare,
  generateRoast
};

