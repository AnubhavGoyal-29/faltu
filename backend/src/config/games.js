/**
 * Games Configuration
 * 
 * Central configuration for all games
 * 
 * @version 1.0
 */

module.exports = {
  // Game Registry
  games: {
    wordle: {
      enabled: true,
      dailyLimit: 1,
      pointsPerWin: 20,
      pointsPerPlay: 5,
      maxAttempts: 6,
      wordLength: 5
    },
    
    tambola: {
      enabled: true,
      dailyLimit: null, // unlimited
      pointsPerWin: 50,
      gameInterval: 5 * 60 * 1000, // 5 minutes
      registrationWindow: 30 * 1000, // 30 seconds
      numberCallInterval: 3000 // 3 seconds
    },
    
    bakchodi: {
      enabled: true,
      dailyLimit: 1,
      pointsPerPlay: 0,
      pointsMultiplier: 0.1, // score / 10
      requiresAI: true,
      minScore: 0,
      maxScore: 100
    },
    
    meme: {
      enabled: true,
      dailyLimit: null,
      pointsPerPlay: 0,
      pointsMultiplier: 0.2, // score / 5
      requiresAI: true,
      minScore: 0,
      maxScore: 100
    },
    
    debate: {
      enabled: true,
      dailyLimit: null,
      pointsPerWin: 25,
      pointsPerLoss: 5,
      maxRounds: 5,
      requiresAI: true
    },
    
    wheel: {
      enabled: true,
      dailyLimit: null,
      pointsPerSpin: 0,
      outcomes: {
        roast: { weight: 25, requiresAI: true },
        compliment: { weight: 25, requiresAI: true },
        dare: { weight: 25, requiresAI: true },
        points: { weight: 25, pointsRange: [10, 50] }
      }
    },
    
    future: {
      enabled: true,
      dailyLimit: null,
      pointsPerPlay: 5,
      requiresAI: true
    },
    
    tap: {
      enabled: true,
      dailyLimit: null,
      pointsPerPlay: 1,
      duration: 5000, // 5 seconds
      pointsMultiplier: 0.1 // taps / 10
    },
    
    runaway: {
      enabled: true,
      dailyLimit: null,
      pointsPerWin: 10,
      maxAttempts: 50
    },
    
    dare: {
      enabled: true,
      dailyLimit: null,
      pointsPerPlay: 2,
      requiresAI: true
    },
    
    roast: {
      enabled: true,
      dailyLimit: null,
      pointsPerPlay: 2,
      requiresAI: true
    },
    
    gyaanShot: {
      enabled: true,
      dailyLimit: 5,
      pointsPerPlay: 3,
      pointsPerWin: 15,
      requiresAI: true,
      minScore: 0,
      maxScore: 100,
      pointsMultiplier: 0.15
    },
    
    bakwaasMeter: {
      enabled: true,
      dailyLimit: null,
      pointsPerPlay: 1,
      requiresAI: true,
      minScore: 0,
      maxScore: 100,
      pointsMultiplier: 0.1,
      bonusThreshold: 80
    },
    
    emojiFight: {
      enabled: true,
      dailyLimit: 10,
      pointsPerPlay: 2,
      pointsPerWin: 12,
      maxRounds: 3,
      emojiPool: 50,
      winProbability: 0.5
    },
    
    moodSwitch: {
      enabled: true,
      dailyLimit: 3,
      pointsPerPlay: 5,
      pointsPerWin: 20,
      moodTypes: ['happy', 'sad', 'angry', 'confused', 'excited', 'chill'],
      challengeDuration: 30000,
      requiresAI: false
    },
    
    nonsensePoetry: {
      enabled: true,
      dailyLimit: 2,
      pointsPerPlay: 4,
      pointsPerWin: 18,
      requiresAI: true,
      minLines: 2,
      maxLines: 6,
      ratingMultiplier: 0.2
    },
    
    aukaatCheck: {
      enabled: true,
      dailyLimit: 1,
      pointsPerPlay: 0,
      pointsPerWin: 25,
      requiresAI: true,
      roastProbability: 0.6,
      complimentProbability: 0.4
    },
    
    jhandChallenge: {
      enabled: true,
      dailyLimit: null,
      pointsPerPlay: 1,
      pointsPerWin: 10,
      challengeTypes: ['random', 'chaos', 'cringe', 'funny'],
      completionTime: 60000,
      requiresAI: false
    },
    
    desiSpeedTap: {
      enabled: true,
      dailyLimit: null,
      pointsPerPlay: 1,
      duration: 10000,
      pointsMultiplier: 0.05,
      bonusThreshold: 200,
      bonusMultiplier: 1.5
    },
    
    cringeMeter: {
      enabled: true,
      dailyLimit: null,
      pointsPerPlay: 2,
      requiresAI: true,
      minScore: 0,
      maxScore: 100,
      pointsMultiplier: 0.12,
      cringeThreshold: 70
    },
    
    vibeCheck: {
      enabled: true,
      dailyLimit: 5,
      pointsPerPlay: 3,
      pointsPerWin: 15,
      requiresAI: true,
      vibeCategories: ['chill', 'hype', 'moody', 'wild', 'zen'],
      accuracyBonus: 5
    },
    
    randomFact: {
      enabled: true,
      dailyLimit: 3,
      pointsPerPlay: 5,
      pointsPerWin: 12,
      requiresAI: true,
      factCategories: ['useless', 'weird', 'funny', 'random'],
      verificationBonus: 3
    },
    
    timeBomb: {
      enabled: true,
      dailyLimit: null,
      pointsPerPlay: 2,
      pointsPerWin: 15,
      minTime: 5000,
      maxTime: 20000,
      pressureMultiplier: 1.2,
      requiresAI: false
    },
    
    chaosButton: {
      enabled: true,
      dailyLimit: null,
      pointsPerPlay: 0,
      pointsPerWin: 8,
      chaosEvents: ['points', 'roast', 'compliment', 'dare', 'random'],
      eventWeights: [30, 20, 20, 15, 15],
      requiresAI: true
    },
    
    memeGenerator: {
      enabled: true,
      dailyLimit: null,
      pointsPerPlay: 0,
      pointsMultiplier: 0.25,
      requiresAI: true,
      minScore: 0,
      maxScore: 100,
      viralThreshold: 80,
      viralBonus: 20
    },
    
    desiRoast: {
      enabled: true,
      dailyLimit: null,
      pointsPerPlay: 2,
      pointsPerWin: 12,
      requiresAI: true,
      roastIntensity: 'medium',
      desiFlavor: true
    },
    
    luckDraw: {
      enabled: true,
      dailyLimit: null,
      pointsPerSpin: 0,
      outcomes: {
        jackpot: { weight: 5, pointsRange: [50, 100] },
        win: { weight: 20, pointsRange: [10, 30] },
        smallWin: { weight: 40, pointsRange: [1, 9] },
        nothing: { weight: 35, pointsRange: [0, 0] }
      },
      requiresAI: false
    },
    
    reactionTest: {
      enabled: true,
      dailyLimit: null,
      pointsPerPlay: 1,
      pointsPerWin: 8,
      rounds: 5,
      minDelay: 1000,
      maxDelay: 5000,
      perfectThreshold: 200,
      perfectBonus: 5,
      requiresAI: false
    },
    
    nonsenseGenerator: {
      enabled: true,
      dailyLimit: null,
      pointsPerPlay: 1,
      pointsPerWin: 6,
      requiresAI: true,
      nonsenseTypes: ['word', 'sentence', 'story'],
      creativityBonus: 3
    },
    
    moodRing: {
      enabled: true,
      dailyLimit: 5,
      pointsPerPlay: 3,
      pointsPerWin: 12,
      requiresAI: true,
      moodAccuracy: 0.8,
      moodBonus: 5
    },
    
    bakchodiMeter: {
      enabled: true,
      dailyLimit: null,
      pointsPerPlay: 2,
      requiresAI: true,
      minScore: 0,
      maxScore: 100,
      pointsMultiplier: 0.15,
      legendaryThreshold: 95,
      legendaryBonus: 15
    },
    
    randomDare: {
      enabled: true,
      dailyLimit: null,
      pointsPerPlay: 2,
      pointsPerWin: 10,
      requiresAI: true,
      dareIntensity: 'random',
      completionBonus: 5
    },
    
    speedTyping: {
      enabled: true,
      dailyLimit: null,
      pointsPerPlay: 1,
      duration: 30000,
      pointsMultiplier: 0.08,
      wpmBonus: 2,
      accuracyBonus: 3,
      requiresAI: false
    },
    
    emojiStory: {
      enabled: true,
      dailyLimit: 3,
      pointsPerPlay: 4,
      pointsPerWin: 16,
      requiresAI: true,
      minEmojis: 3,
      maxEmojis: 10,
      creativityMultiplier: 0.2
    },
    
    vibeMeter: {
      enabled: true,
      dailyLimit: null,
      pointsPerPlay: 2,
      requiresAI: true,
      vibeRange: [0, 100],
      pointsMultiplier: 0.1,
      perfectVibeBonus: 10
    },
    
    randomCompliment: {
      enabled: true,
      dailyLimit: null,
      pointsPerPlay: 1,
      pointsPerWin: 8,
      requiresAI: true,
      complimentTypes: ['funny', 'sincere', 'roast-style', 'meme'],
      surpriseBonus: 5
    },
    
    pressureCooker: {
      enabled: true,
      dailyLimit: null,
      pointsPerPlay: 2,
      pointsPerWin: 12,
      rounds: 3,
      timeLimit: 15000,
      pressureMultiplier: 1.3,
      perfectRoundBonus: 5,
      requiresAI: false
    },
    
    nonsenseQuiz: {
      enabled: true,
      dailyLimit: 5,
      pointsPerPlay: 3,
      pointsPerWin: 15,
      questionsPerQuiz: 5,
      requiresAI: true,
      correctAnswerBonus: 2,
      perfectScoreBonus: 10
    },
    
    chaosMode: {
      enabled: true,
      dailyLimit: null,
      pointsPerPlay: 0,
      pointsPerWin: 6,
      chaosLevel: 'random',
      eventsPerSession: 3,
      requiresAI: true,
      survivalBonus: 5
    },
    
    desiChallenge: {
      enabled: true,
      dailyLimit: null,
      pointsPerPlay: 2,
      pointsPerWin: 14,
      requiresAI: true,
      challengeTypes: ['food', 'language', 'culture', 'memes'],
      desiFlavor: true,
      completionBonus: 4
    },
    
    randomRoast: {
      enabled: true,
      dailyLimit: null,
      pointsPerPlay: 2,
      pointsPerWin: 10,
      requiresAI: true,
      roastStyle: 'random',
      intensity: 'medium',
      comebackBonus: 5
    }
  },

  // Global Game Settings
  global: {
    enableAnalytics: true,
    enableLeaderboards: true,
    cacheResults: true,
    defaultPointsPerPlay: 5,
    defaultDailyLimit: null
  }
};

