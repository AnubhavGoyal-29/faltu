const { callAI } = require('./aiDecisionEngine');
const { getFormattedPrompt } = require('../prompt-loaders/promptLoader');

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
          action: 'generate_challenge',
          mode: 'generate_challenge'
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
        mode: 'score_submission',
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

// Generate AI debate response (multi-round)
const generateDebateResponse = async (user, topic, recentMessages) => {
  try {
    const messageHistory = recentMessages.map(m => `${m.sender}: ${m.message}`).join('\n');
    const messageCount = recentMessages.length;
    
    const aiResponse = await callAI({
      user,
      reason: 'games',
      appState: {
        game: 'debate',
        mode: 'generate_response',
        topic,
        recent_messages: messageHistory,
        message_count: messageCount,
        should_end: messageCount >= 10 // Suggest ending after 10+ messages
      }
    });

    if (aiResponse) {
      return {
        message: aiResponse.message || aiResponse.counter_argument || 'Tum galat ho bhai!',
        shouldEnd: aiResponse.should_end || (messageCount >= 10),
        winner: aiResponse.winner || null, // Only set if shouldEnd is true
        explanation: aiResponse.explanation || null
      };
    }
  } catch (error) {
    console.error('🎮 [GAMES AI] Debate response error:', error);
  }

  // Fallback
  const fallbackMessages = [
    'Tum galat ho bhai! Main sahi bol raha hoon!',
    'Nahi bhai, tumhara logic galat hai!',
    'Arey yaar, tum samajh nahi rahe ho!',
    'Bhai main sahi keh raha hoon, tum suno!',
    'Tumhara argument weak hai bhai!'
  ];
  
  return {
    message: fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)],
    shouldEnd: recentMessages.length >= 10,
    winner: recentMessages.length >= 10 ? (Math.random() > 0.5 ? 'user' : 'ai') : null,
    explanation: recentMessages.length >= 10 ? 'Mast debate thi! Dono ne achha kiya!' : null
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
        mode: 'score_caption',
        caption,
        imageUrl: imageUrl
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

// Generate roast - Always use AI, ensure Hinglish
const generateRoast = async (user) => {
  try {
    console.log('🔥 [ROAST] Generating AI roast for:', user.name);
    
    const aiResponse = await callAI({
      user,
      reason: 'roast', // Use specific roast reason
      appState: {
        game: 'roast_me',
        action: 'generate_roast',
        user_name: user.name,
        ensure_hinglish: true
      },
      temperature: 0.95,
      maxTokens: 200
    });

    if (aiResponse && (aiResponse.roast || aiResponse.roast_text)) {
      const roastText = aiResponse.roast || aiResponse.roast_text;
      console.log('🔥 [ROAST] ✅ AI roast generated:', roastText.substring(0, 50));
      return roastText;
    }
  } catch (error) {
    console.error('🔥 [ROAST] ❌ AI error:', error.message);
    // Don't fallback - throw error so user knows AI is required
    throw new Error('AI roast generate nahi hui. Please try again.');
  }

  // Only fallback if AI completely fails
  throw new Error('Roast generate nahi hui. AI service unavailable.');
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

