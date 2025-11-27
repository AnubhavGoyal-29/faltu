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
    
    // NEW 30 GAMES START HERE
    
    bakwaasBattle: {
      enabled: true,
      dailyLimit: null,
      pointsPerPlay: 2,
      pointsPerWin: 12,
      requiresAI: true,
      battleRounds: 3,
      nonsenseMultiplier: 0.15,
      winBonus: 8
    },
    
    emojiMashup: {
      enabled: true,
      dailyLimit: 5,
      pointsPerPlay: 3,
      pointsPerWin: 15,
      requiresAI: true,
      emojiCount: [3, 8],
      creativityMultiplier: 0.2,
      viralBonus: 10
    },
    
    moodSwinger: {
      enabled: true,
      dailyLimit: null,
      pointsPerPlay: 2,
      pointsPerWin: 10,
      moodChanges: 5,
      timeLimit: 20000,
      perfectMoodBonus: 5,
      requiresAI: false
    },
    
    poetryChaos: {
      enabled: true,
      dailyLimit: 2,
      pointsPerPlay: 4,
      pointsPerWin: 20,
      requiresAI: true,
      poetryStyles: ['haiku', 'limerick', 'free', 'nonsense'],
      rhymeBonus: 5,
      creativityMultiplier: 0.22
    },
    
    desiSpeedRush: {
      enabled: true,
      dailyLimit: null,
      pointsPerPlay: 1,
      duration: 8000,
      pointsMultiplier: 0.06,
      speedThreshold: 250,
      speedBonus: 1.8,
      requiresAI: false
    },
    
    cringeLevel: {
      enabled: true,
      dailyLimit: null,
      pointsPerPlay: 2,
      requiresAI: true,
      cringeScore: [0, 100],
      pointsMultiplier: 0.13,
      extremeCringeThreshold: 85,
      extremeBonus: 12
    },
    
    vibeDetector: {
      enabled: true,
      dailyLimit: 5,
      pointsPerPlay: 3,
      pointsPerWin: 16,
      requiresAI: true,
      vibeTypes: ['chill', 'hype', 'moody', 'wild', 'zen', 'chaos'],
      accuracyThreshold: 0.75,
      accuracyBonus: 6
    },
    
    uselessFact: {
      enabled: true,
      dailyLimit: 3,
      pointsPerPlay: 5,
      pointsPerWin: 14,
      requiresAI: true,
      factTypes: ['useless', 'weird', 'funny', 'random', 'absurd'],
      uselessnessBonus: 4,
      surpriseFactor: 3
    },
    
    bombTimer: {
      enabled: true,
      dailyLimit: null,
      pointsPerPlay: 2,
      pointsPerWin: 18,
      minTime: 3000,
      maxTime: 25000,
      pressureMultiplier: 1.4,
      perfectTimingBonus: 8,
      requiresAI: false
    },
    
    memeMaster: {
      enabled: true,
      dailyLimit: null,
      pointsPerPlay: 0,
      pointsMultiplier: 0.28,
      requiresAI: true,
      memeScore: [0, 100],
      viralThreshold: 85,
      viralBonus: 25,
      legendaryThreshold: 95,
      legendaryBonus: 35
    },
    
    reflexMaster: {
      enabled: true,
      dailyLimit: null,
      pointsPerPlay: 1,
      pointsPerWin: 10,
      rounds: 7,
      minDelay: 800,
      maxDelay: 6000,
      perfectThreshold: 150,
      perfectBonus: 7,
      requiresAI: false
    },
    
    nonsenseFactory: {
      enabled: true,
      dailyLimit: null,
      pointsPerPlay: 1,
      pointsPerWin: 8,
      requiresAI: true,
      nonsenseTypes: ['word', 'sentence', 'story', 'poem', 'quote'],
      creativityBonus: 4,
      absurdityMultiplier: 0.12
    },
    
    moodReader: {
      enabled: true,
      dailyLimit: 5,
      pointsPerPlay: 3,
      pointsPerWin: 14,
      requiresAI: true,
      moodAccuracy: 0.85,
      moodBonus: 6,
      perfectReadBonus: 8
    },
    
    bakchodiLevel: {
      enabled: true,
      dailyLimit: null,
      pointsPerPlay: 2,
      requiresAI: true,
      bakchodiScore: [0, 100],
      pointsMultiplier: 0.16,
      legendaryThreshold: 98,
      legendaryBonus: 20,
      godLevelThreshold: 100,
      godLevelBonus: 30
    },
    
    typingChaos: {
      enabled: true,
      dailyLimit: null,
      pointsPerPlay: 1,
      duration: 35000,
      pointsMultiplier: 0.09,
      wpmBonus: 3,
      accuracyBonus: 4,
      perfectTypingBonus: 10,
      requiresAI: false
    },
    
    emojiTale: {
      enabled: true,
      dailyLimit: 3,
      pointsPerPlay: 4,
      pointsPerWin: 18,
      requiresAI: true,
      minEmojis: 4,
      maxEmojis: 12,
      creativityMultiplier: 0.23,
      storytellingBonus: 8
    },
    
    vibeScanner: {
      enabled: true,
      dailyLimit: null,
      pointsPerPlay: 2,
      requiresAI: true,
      vibeRange: [0, 100],
      pointsMultiplier: 0.11,
      perfectVibeBonus: 12,
      vibeMatchBonus: 8
    },
    
    complimentChaos: {
      enabled: true,
      dailyLimit: null,
      pointsPerPlay: 1,
      pointsPerWin: 10,
      requiresAI: true,
      complimentTypes: ['funny', 'sincere', 'roast-style', 'meme', 'absurd'],
      surpriseBonus: 6,
      creativityBonus: 4
    },
    
    pressureTest: {
      enabled: true,
      dailyLimit: null,
      pointsPerPlay: 2,
      pointsPerWin: 14,
      rounds: 4,
      timeLimit: 12000,
      pressureMultiplier: 1.5,
      perfectRoundBonus: 6,
      survivalBonus: 8,
      requiresAI: false
    },
    
    quizChaos: {
      enabled: true,
      dailyLimit: 5,
      pointsPerPlay: 3,
      pointsPerWin: 18,
      questionsPerQuiz: 6,
      requiresAI: true,
      correctAnswerBonus: 3,
      perfectScoreBonus: 12,
      speedBonus: 2
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

