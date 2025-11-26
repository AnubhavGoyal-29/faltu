const {
  getTodayChallenge,
  submitBakchodiChallenge,
  startDebate,
  submitDebateMessage: submitDebateMsg,
  forfeitDebate: forfeitDebateService,
  getRandomMemeImage,
  submitMemeCaption,
  spinWheel,
  getFuturePrediction,
  submitTapScore,
  getTapLeaderboard,
  recordRunawayButtonWin,
  getDare,
  getRoast,
  // NEW 30 GAMES
  startBakwaasBattle,
  submitBakwaas,
  getEmojiMashup,
  submitEmojiMashup,
  startMoodSwinger,
  submitMoodSwitch,
  getPoetryChallenge,
  submitPoetry,
  submitDesiSpeedRush,
  getCringeLevel,
  getVibeDetector,
  getUselessFact,
  startBombTimer,
  defuseBomb,
  submitMemeMaster,
  startReflexMaster,
  submitReflex,
  getNonsensePrompt,
  submitNonsense,
  getMoodReading,
  getBakchodiLevel,
  startTypingChaos,
  submitTypingScore,
  getEmojiTale,
  submitEmojiTale,
  scanVibe,
  getComplimentChaos,
  startPressureTest,
  submitPressureRound,
  completePressureTest,
  getQuizChaos,
  submitQuizAnswers,
  // MISSING 29 GAMES
  getGyaanShot,
  submitGyaanShotRating,
  getBakwaasMeter,
  startEmojiFight,
  submitEmojiFight,
  startMoodSwitch: startMoodSwitchGame,
  submitMoodSwitch: submitMoodSwitchGame,
  getNonsensePoetryChallenge,
  submitNonsensePoetry,
  submitDesiSpeedTap,
  getCringeMeter,
  getVibeCheck,
  startTimeBomb,
  defuseTimeBomb,
  submitMemeGenerator,
  startReactionTest,
  submitReaction,
  getNonsenseGeneratorPrompt,
  submitNonsenseGenerator,
  getMoodRing,
  getBakchodiMeter,
  startSpeedTyping,
  submitSpeedTyping,
  getEmojiStory,
  submitEmojiStory,
  getVibeMeter,
  startPressureCooker,
  submitPressureCookerRound,
  completePressureCooker,
  getNonsenseQuiz,
  submitNonsenseQuiz,
} = require('../../services/gamesService');
const { BakchodiChallenge, Debate, MemeBattle, FuturePrediction, Dare, Roast } = require('../../models');

// Daily Bakchodi Challenge
const getChallenge = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const challenge = await getTodayChallenge(userId);
    res.json({ success: true, challenge });
  } catch (error) {
    console.error('🎮 [GAMES] Get challenge error:', error);
    res.status(500).json({ success: false, error: 'Challenge fetch nahi hua' });
  }
};

const submitChallenge = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { submission } = req.body;
    const challenge = await submitBakchodiChallenge(userId, submission);
    res.json({ success: true, challenge });
  } catch (error) {
    console.error('🎮 [GAMES] Submit challenge error:', error);
    res.status(500).json({ success: false, error: error.message || 'Submission failed' });
  }
};

const getChallengeHistory = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const challenges = await BakchodiChallenge.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
      limit: 10
    });
    res.json({ success: true, challenges });
  } catch (error) {
    console.error('🎮 [GAMES] Get history error:', error);
    res.status(500).json({ success: false, error: 'History fetch nahi hui' });
  }
};

// Debate - Start new debate
const getDebateTopic = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const result = await startDebate(userId);
    res.json({ success: true, debate_id: result.debate_id, topic: result.topic });
  } catch (error) {
    console.error('🎮 [GAMES] Get debate topic error:', error);
    res.status(500).json({ success: false, error: 'Topic fetch nahi hua' });
  }
};

// Debate - Get debate by ID
const getDebate = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { debate_id } = req.params;
    const debate = await Debate.findByPk(debate_id);
    
    if (!debate || debate.user_id !== userId) {
      return res.status(404).json({ success: false, error: 'Debate nahi mila' });
    }
    
    res.json({ success: true, debate });
  } catch (error) {
    console.error('🎮 [GAMES] Get debate error:', error);
    res.status(500).json({ success: false, error: 'Debate fetch nahi hua' });
  }
};

// Debate - Submit message
const submitDebateMessage = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { debate_id, message } = req.body;
    
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, error: 'Message required' });
    }
    
    const debate = await submitDebateMsg(debate_id, userId, message.trim());
    res.json({ success: true, debate });
  } catch (error) {
    console.error('🎮 [GAMES] Submit debate message error:', error);
    res.status(500).json({ success: false, error: error.message || 'Message submit nahi hui' });
  }
};

// Debate - Forfeit
const forfeitDebate = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { debate_id } = req.body;
    const debate = await forfeitDebateService(debate_id, userId);
    res.json({ success: true, debate });
  } catch (error) {
    console.error('🎮 [GAMES] Forfeit debate error:', error);
    res.status(500).json({ success: false, error: error.message || 'Forfeit nahi hua' });
  }
};

// Meme Battle
const getMemeImage = async (req, res) => {
  try {
    const imageUrl = getRandomMemeImage();
    res.json({ success: true, image_url: imageUrl });
  } catch (error) {
    console.error('🎮 [GAMES] Get meme image error:', error);
    res.status(500).json({ success: false, error: 'Image fetch nahi hui' });
  }
};

const submitMeme = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { caption } = req.body;
    
    // Validate caption
    if (!caption || typeof caption !== 'string') {
      return res.status(400).json({ success: false, error: 'Caption required' });
    }
    
    const trimmedCaption = caption.trim();
    if (trimmedCaption.length === 0) {
      return res.status(400).json({ success: false, error: 'Caption cannot be empty' });
    }
    
    if (trimmedCaption.length > 500) {
      return res.status(400).json({ success: false, error: 'Caption too long (max 500 characters)' });
    }
    
    const battle = await submitMemeCaption(userId, trimmedCaption, req.user);
    res.json({ success: true, battle });
  } catch (error) {
    console.error('🎮 [GAMES] Submit meme error:', error);
    res.status(500).json({ success: false, error: error.message || 'Meme submit nahi hui' });
  }
};

// Wheel Spin
const spin = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const result = await spinWheel(userId);
    res.json({ success: true, result });
  } catch (error) {
    console.error('🎮 [GAMES] Spin wheel error:', error);
    res.status(500).json({ success: false, error: 'Wheel spin nahi hui' });
  }
};

// Future Prediction
const predictFuture = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { name, mood, fav_snack } = req.body;
    const prediction = await getFuturePrediction(userId, name, mood, fav_snack);
    res.json({ success: true, prediction });
  } catch (error) {
    console.error('🎮 [GAMES] Predict future error:', error);
    res.status(500).json({ success: false, error: 'Prediction nahi hui' });
  }
};

// Tap Game
const submitTap = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { taps } = req.body;
    const score = await submitTapScore(userId, taps);
    res.json({ success: true, score });
  } catch (error) {
    console.error('🎮 [GAMES] Submit tap error:', error);
    res.status(500).json({ success: false, error: 'Score submit nahi hua' });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await getTapLeaderboard(10);
    res.json({ success: true, leaderboard });
  } catch (error) {
    console.error('🎮 [GAMES] Get leaderboard error:', error);
    res.status(500).json({ success: false, error: 'Leaderboard fetch nahi hui' });
  }
};

// Runaway Button
const recordWin = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { attempts } = req.body;
    const win = await recordRunawayButtonWin(userId, attempts);
    res.json({ success: true, win });
  } catch (error) {
    console.error('🎮 [GAMES] Record win error:', error);
    res.status(500).json({ success: false, error: 'Win record nahi hui' });
  }
};

// Dare Machine
const getDareForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const dare = await getDare(userId);
    res.json({ success: true, dare });
  } catch (error) {
    console.error('🎮 [GAMES] Get dare error:', error);
    res.status(500).json({ success: false, error: 'Dare fetch nahi hui' });
  }
};

// Roast Me
const getRoastForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const roast = await getRoast(userId);
    res.json({ success: true, roast });
  } catch (error) {
    console.error('🎮 [GAMES] Get roast error:', error);
    res.status(500).json({ success: false, error: 'Roast fetch nahi hui' });
  }
};

// NEW 30 GAMES CONTROLLERS

// Gyaan Guru
const getGyaanGuruForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const gyaan = await getGyaanGuru(userId);
    res.json({ success: true, gyaan });
  } catch (error) {
    console.error('🎮 [GAMES] Get gyaan guru error:', error);
    res.status(500).json({ success: false, error: 'Gyaan fetch nahi hua' });
  }
};

const submitGyaanRatingForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { gyaan_id, rating } = req.body;
    const result = await submitGyaanRating(userId, gyaan_id, rating);
    res.json({ success: true, result });
  } catch (error) {
    console.error('🎮 [GAMES] Submit gyaan rating error:', error);
    res.status(500).json({ success: false, error: 'Rating submit nahi hui' });
  }
};

// Bakwaas Battle
const startBakwaasBattleForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const battle = await startBakwaasBattle(userId);
    res.json({ success: true, battle });
  } catch (error) {
    console.error('🎮 [GAMES] Start bakwaas battle error:', error);
    res.status(500).json({ success: false, error: 'Battle start nahi hui' });
  }
};

const submitBakwaasForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { battle_id, bakwaas } = req.body;
    const result = await submitBakwaas(userId, battle_id, bakwaas);
    res.json({ success: true, result });
  } catch (error) {
    console.error('🎮 [GAMES] Submit bakwaas error:', error);
    res.status(500).json({ success: false, error: 'Bakwaas submit nahi hui' });
  }
};

// Emoji Mashup
const getEmojiMashupForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const mashup = await getEmojiMashup(userId);
    res.json({ success: true, mashup });
  } catch (error) {
    console.error('🎮 [GAMES] Get emoji mashup error:', error);
    res.status(500).json({ success: false, error: 'Mashup fetch nahi hua' });
  }
};

const submitEmojiMashupForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { mashup_id, emoji_story } = req.body;
    const result = await submitEmojiMashup(userId, mashup_id, emoji_story);
    res.json({ success: true, result });
  } catch (error) {
    console.error('🎮 [GAMES] Submit emoji mashup error:', error);
    res.status(500).json({ success: false, error: 'Mashup submit nahi hui' });
  }
};

// Mood Swinger
const startMoodSwingerForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const session = await startMoodSwinger(userId);
    res.json({ success: true, session });
  } catch (error) {
    console.error('🎮 [GAMES] Start mood swinger error:', error);
    res.status(500).json({ success: false, error: 'Session start nahi hui' });
  }
};

const submitMoodSwitchForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { session_id, mood } = req.body;
    const result = await submitMoodSwitch(userId, session_id, mood);
    res.json({ success: true, result });
  } catch (error) {
    console.error('🎮 [GAMES] Submit mood switch error:', error);
    res.status(500).json({ success: false, error: 'Mood submit nahi hui' });
  }
};

// Poetry Chaos
const getPoetryChallengeForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const challenge = await getPoetryChallenge(userId);
    res.json({ success: true, challenge });
  } catch (error) {
    console.error('🎮 [GAMES] Get poetry challenge error:', error);
    res.status(500).json({ success: false, error: 'Challenge fetch nahi hua' });
  }
};

const submitPoetryForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { poetry_id, poem } = req.body;
    const result = await submitPoetry(userId, poetry_id, poem);
    res.json({ success: true, result });
  } catch (error) {
    console.error('🎮 [GAMES] Submit poetry error:', error);
    res.status(500).json({ success: false, error: 'Poetry submit nahi hui' });
  }
};

// Desi Speed Rush
const submitDesiSpeedRushForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { taps } = req.body;
    const result = await submitDesiSpeedRush(userId, taps);
    res.json({ success: true, result });
  } catch (error) {
    console.error('🎮 [GAMES] Submit desi speed rush error:', error);
    res.status(500).json({ success: false, error: 'Score submit nahi hua' });
  }
};

// Cringe Level
const getCringeLevelForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { cringe_text } = req.body;
    const result = await getCringeLevel(userId, cringe_text);
    res.json({ success: true, result });
  } catch (error) {
    console.error('🎮 [GAMES] Get cringe level error:', error);
    res.status(500).json({ success: false, error: 'Cringe level check nahi hua' });
  }
};

// Vibe Detector
const getVibeDetectorForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { vibe_input } = req.body;
    const result = await getVibeDetector(userId, vibe_input);
    res.json({ success: true, result });
  } catch (error) {
    console.error('🎮 [GAMES] Get vibe detector error:', error);
    res.status(500).json({ success: false, error: 'Vibe detect nahi hua' });
  }
};

// Useless Fact
const getUselessFactForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const fact = await getUselessFact(userId);
    res.json({ success: true, fact });
  } catch (error) {
    console.error('🎮 [GAMES] Get useless fact error:', error);
    res.status(500).json({ success: false, error: 'Fact fetch nahi hua' });
  }
};

// Bomb Timer
const startBombTimerForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const bomb = await startBombTimer(userId);
    res.json({ success: true, bomb });
  } catch (error) {
    console.error('🎮 [GAMES] Start bomb timer error:', error);
    res.status(500).json({ success: false, error: 'Bomb timer start nahi hua' });
  }
};

const defuseBombForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { bomb_id, defuse_time } = req.body;
    const result = await defuseBomb(userId, bomb_id, defuse_time);
    res.json({ success: true, result });
  } catch (error) {
    console.error('🎮 [GAMES] Defuse bomb error:', error);
    res.status(500).json({ success: false, error: 'Bomb defuse nahi hua' });
  }
};

// Chaos Generator
const generateChaosForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const chaos = await generateChaos(userId);
    res.json({ success: true, chaos });
  } catch (error) {
    console.error('🎮 [GAMES] Generate chaos error:', error);
    res.status(500).json({ success: false, error: 'Chaos generate nahi hua' });
  }
};

// Meme Master
const submitMemeMasterForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { meme_caption } = req.body;
    const result = await submitMemeMaster(userId, meme_caption);
    res.json({ success: true, result });
  } catch (error) {
    console.error('🎮 [GAMES] Submit meme master error:', error);
    res.status(500).json({ success: false, error: 'Meme submit nahi hui' });
  }
};

// Desi Burn
const getDesiBurnForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const burn = await getDesiBurn(userId);
    res.json({ success: true, burn });
  } catch (error) {
    console.error('🎮 [GAMES] Get desi burn error:', error);
    res.status(500).json({ success: false, error: 'Desi burn fetch nahi hua' });
  }
};

// Lucky Chaos
const spinLuckyChaosForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const result = await spinLuckyChaos(userId);
    res.json({ success: true, result });
  } catch (error) {
    console.error('🎮 [GAMES] Spin lucky chaos error:', error);
    res.status(500).json({ success: false, error: 'Spin nahi hui' });
  }
};

// Reflex Master
const startReflexMasterForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const session = await startReflexMaster(userId);
    res.json({ success: true, session });
  } catch (error) {
    console.error('🎮 [GAMES] Start reflex master error:', error);
    res.status(500).json({ success: false, error: 'Session start nahi hui' });
  }
};

const submitReflexForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { session_id, reaction_time } = req.body;
    const result = await submitReflex(userId, session_id, reaction_time);
    res.json({ success: true, result });
  } catch (error) {
    console.error('🎮 [GAMES] Submit reflex error:', error);
    res.status(500).json({ success: false, error: 'Reflex submit nahi hui' });
  }
};

// Nonsense Factory
const getNonsensePromptForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const prompt = await getNonsensePrompt(userId);
    res.json({ success: true, prompt });
  } catch (error) {
    console.error('🎮 [GAMES] Get nonsense prompt error:', error);
    res.status(500).json({ success: false, error: 'Prompt fetch nahi hua' });
  }
};

const submitNonsenseForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { prompt_id, nonsense } = req.body;
    const result = await submitNonsense(userId, prompt_id, nonsense);
    res.json({ success: true, result });
  } catch (error) {
    console.error('🎮 [GAMES] Submit nonsense error:', error);
    res.status(500).json({ success: false, error: 'Nonsense submit nahi hui' });
  }
};

// Mood Reader
const getMoodReadingForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { mood_input } = req.body;
    const result = await getMoodReading(userId, mood_input);
    res.json({ success: true, result });
  } catch (error) {
    console.error('🎮 [GAMES] Get mood reading error:', error);
    res.status(500).json({ success: false, error: 'Mood reading nahi hui' });
  }
};

// Bakchodi Level
const getBakchodiLevelForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { bakchodi_text } = req.body;
    const result = await getBakchodiLevel(userId, bakchodi_text);
    res.json({ success: true, result });
  } catch (error) {
    console.error('🎮 [GAMES] Get bakchodi level error:', error);
    res.status(500).json({ success: false, error: 'Bakchodi level check nahi hua' });
  }
};

// Dare Master
const getDareMasterForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const dare = await getDareMaster(userId);
    res.json({ success: true, dare });
  } catch (error) {
    console.error('🎮 [GAMES] Get dare master error:', error);
    res.status(500).json({ success: false, error: 'Dare fetch nahi hui' });
  }
};

const completeDareMasterForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { dare_id } = req.body;
    const result = await completeDareMaster(userId, dare_id);
    res.json({ success: true, result });
  } catch (error) {
    console.error('🎮 [GAMES] Complete dare master error:', error);
    res.status(500).json({ success: false, error: 'Dare complete nahi hui' });
  }
};

// Typing Chaos
const startTypingChaosForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const session = await startTypingChaos(userId);
    res.json({ success: true, session });
  } catch (error) {
    console.error('🎮 [GAMES] Start typing chaos error:', error);
    res.status(500).json({ success: false, error: 'Session start nahi hui' });
  }
};

const submitTypingScoreForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { session_id, wpm, accuracy } = req.body;
    const result = await submitTypingScore(userId, session_id, wpm, accuracy);
    res.json({ success: true, result });
  } catch (error) {
    console.error('🎮 [GAMES] Submit typing score error:', error);
    res.status(500).json({ success: false, error: 'Score submit nahi hua' });
  }
};

// Emoji Tale
const getEmojiTaleForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const tale = await getEmojiTale(userId);
    res.json({ success: true, tale });
  } catch (error) {
    console.error('🎮 [GAMES] Get emoji tale error:', error);
    res.status(500).json({ success: false, error: 'Tale fetch nahi hua' });
  }
};

const submitEmojiTaleForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { tale_id, emoji_story } = req.body;
    const result = await submitEmojiTale(userId, tale_id, emoji_story);
    res.json({ success: true, result });
  } catch (error) {
    console.error('🎮 [GAMES] Submit emoji tale error:', error);
    res.status(500).json({ success: false, error: 'Tale submit nahi hui' });
  }
};

// Vibe Scanner
const scanVibeForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { vibe_input } = req.body;
    const result = await scanVibe(userId, vibe_input);
    res.json({ success: true, result });
  } catch (error) {
    console.error('🎮 [GAMES] Scan vibe error:', error);
    res.status(500).json({ success: false, error: 'Vibe scan nahi hua' });
  }
};

// Compliment Chaos
const getComplimentChaosForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const compliment = await getComplimentChaos(userId);
    res.json({ success: true, compliment });
  } catch (error) {
    console.error('🎮 [GAMES] Get compliment chaos error:', error);
    res.status(500).json({ success: false, error: 'Compliment fetch nahi hua' });
  }
};

// Pressure Test
const startPressureTestForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const test = await startPressureTest(userId);
    res.json({ success: true, test });
  } catch (error) {
    console.error('🎮 [GAMES] Start pressure test error:', error);
    res.status(500).json({ success: false, error: 'Test start nahi hua' });
  }
};

const submitPressureRoundForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { test_id, round_score } = req.body;
    const result = await submitPressureRound(userId, test_id, round_score);
    res.json({ success: true, result });
  } catch (error) {
    console.error('🎮 [GAMES] Submit pressure round error:', error);
    res.status(500).json({ success: false, error: 'Round submit nahi hui' });
  }
};

const completePressureTestForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { test_id, total_score } = req.body;
    const result = await completePressureTest(userId, test_id, total_score);
    res.json({ success: true, result });
  } catch (error) {
    console.error('🎮 [GAMES] Complete pressure test error:', error);
    res.status(500).json({ success: false, error: 'Test complete nahi hua' });
  }
};

// Quiz Chaos
const getQuizChaosForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const quiz = await getQuizChaos(userId);
    res.json({ success: true, quiz });
  } catch (error) {
    console.error('🎮 [GAMES] Get quiz chaos error:', error);
    res.status(500).json({ success: false, error: 'Quiz fetch nahi hua' });
  }
};

const submitQuizAnswersForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { quiz_id, answers } = req.body;
    const result = await submitQuizAnswers(userId, quiz_id, answers);
    res.json({ success: true, result });
  } catch (error) {
    console.error('🎮 [GAMES] Submit quiz answers error:', error);
    res.status(500).json({ success: false, error: 'Answers submit nahi hui' });
  }
};

// Chaos Survival
const startChaosSurvivalForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const survival = await startChaosSurvival(userId);
    res.json({ success: true, survival });
  } catch (error) {
    console.error('🎮 [GAMES] Start chaos survival error:', error);
    res.status(500).json({ success: false, error: 'Survival start nahi hui' });
  }
};

const surviveChaosEventForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { survival_id, event_response } = req.body;
    const result = await surviveChaosEvent(userId, survival_id, event_response);
    res.json({ success: true, result });
  } catch (error) {
    console.error('🎮 [GAMES] Survive chaos event error:', error);
    res.status(500).json({ success: false, error: 'Event survive nahi hua' });
  }
};

const completeChaosSurvivalForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { survival_id } = req.body;
    const result = await completeChaosSurvival(userId, survival_id);
    res.json({ success: true, result });
  } catch (error) {
    console.error('🎮 [GAMES] Complete chaos survival error:', error);
    res.status(500).json({ success: false, error: 'Survival complete nahi hui' });
  }
};

// Desi Master
const getDesiChallengeForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const challenge = await getDesiChallenge(userId);
    res.json({ success: true, challenge });
  } catch (error) {
    console.error('🎮 [GAMES] Get desi challenge error:', error);
    res.status(500).json({ success: false, error: 'Challenge fetch nahi hua' });
  }
};

const completeDesiChallengeForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { challenge_id, completion } = req.body;
    const result = await completeDesiChallenge(userId, challenge_id, completion);
    res.json({ success: true, result });
  } catch (error) {
    console.error('🎮 [GAMES] Complete desi challenge error:', error);
    res.status(500).json({ success: false, error: 'Challenge complete nahi hui' });
  }
};

// ============================================
// MISSING 29 GAMES CONTROLLERS
// ============================================

// 1. Gyaan Shot
const getGyaanShotForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const gyaan = await getGyaanShot(userId);
    res.json({ success: true, gyaan });
  } catch (error) {
    console.error('🎮 [GAMES] Get gyaan shot error:', error);
    res.status(500).json({ success: false, error: 'Gyaan shot fetch nahi hua' });
  }
};

const submitGyaanShotRatingForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { gyaan_id, rating } = req.body;
    const result = await submitGyaanShotRating(userId, gyaan_id, rating);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('🎮 [GAMES] Submit gyaan shot rating error:', error);
    res.status(500).json({ success: false, error: 'Rating submit nahi hui' });
  }
};

// 2. Bakwaas Meter
const getBakwaasMeterForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { bakwaas_text } = req.body;
    const result = await getBakwaasMeter(userId, bakwaas_text);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('🎮 [GAMES] Get bakwaas meter error:', error);
    res.status(500).json({ success: false, error: 'Bakwaas meter fetch nahi hua' });
  }
};

// 3. Emoji Fight
const startEmojiFightForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const fight = await startEmojiFight(userId);
    res.json({ success: true, fight });
  } catch (error) {
    console.error('🎮 [GAMES] Start emoji fight error:', error);
    res.status(500).json({ success: false, error: 'Emoji fight start nahi hui' });
  }
};

const submitEmojiFightForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { fight_id, user_choice } = req.body;
    const result = await submitEmojiFight(userId, fight_id, user_choice);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('🎮 [GAMES] Submit emoji fight error:', error);
    res.status(500).json({ success: false, error: 'Emoji fight submit nahi hui' });
  }
};

// 4. Mood Switch (new game - different from moodSwinger)
const startMoodSwitchGameForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const challenge = await startMoodSwitchGame(userId);
    res.json({ success: true, challenge });
  } catch (error) {
    console.error('🎮 [GAMES] Start mood switch error:', error);
    res.status(500).json({ success: false, error: 'Mood switch start nahi hui' });
  }
};

const submitMoodSwitchGameForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { challenge_id, switches } = req.body;
    const result = await submitMoodSwitchGame(userId, challenge_id, switches);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('🎮 [GAMES] Submit mood switch error:', error);
    res.status(500).json({ success: false, error: 'Mood switch submit nahi hui' });
  }
};

// 5. Nonsense Poetry
const getNonsensePoetryChallengeForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const challenge = await getNonsensePoetryChallenge(userId);
    res.json({ success: true, challenge });
  } catch (error) {
    console.error('🎮 [GAMES] Get nonsense poetry challenge error:', error);
    res.status(500).json({ success: false, error: 'Challenge fetch nahi hua' });
  }
};

const submitNonsensePoetryForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { poetry_id, poem } = req.body;
    const result = await submitNonsensePoetry(userId, poetry_id, poem);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('🎮 [GAMES] Submit nonsense poetry error:', error);
    res.status(500).json({ success: false, error: 'Poetry submit nahi hui' });
  }
};

// 6. Aukaat Check (different from aukaatMeter)
const getAukaatCheckGameForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const result = await getAukaatCheckGame(userId);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('🎮 [GAMES] Get aukaat check error:', error);
    res.status(500).json({ success: false, error: 'Aukaat check fetch nahi hua' });
  }
};

// 7. Jhand Challenge
const getJhandChallengeForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const challenge = await getJhandChallenge(userId);
    res.json({ success: true, challenge });
  } catch (error) {
    console.error('🎮 [GAMES] Get jhand challenge error:', error);
    res.status(500).json({ success: false, error: 'Challenge fetch nahi hua' });
  }
};

const completeJhandChallengeForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { challenge_id } = req.body;
    const result = await completeJhandChallenge(userId, challenge_id);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('🎮 [GAMES] Complete jhand challenge error:', error);
    res.status(500).json({ success: false, error: 'Challenge complete nahi hui' });
  }
};

// 8. Desi Speed Tap
const submitDesiSpeedTapForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { taps } = req.body;
    const result = await submitDesiSpeedTap(userId, taps);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('🎮 [GAMES] Submit desi speed tap error:', error);
    res.status(500).json({ success: false, error: 'Score submit nahi hua' });
  }
};

// 9. Cringe Meter
const getCringeMeterForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { cringe_text } = req.body;
    const result = await getCringeMeter(userId, cringe_text);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('🎮 [GAMES] Get cringe meter error:', error);
    res.status(500).json({ success: false, error: 'Cringe meter fetch nahi hua' });
  }
};

// 10. Vibe Check
const getVibeCheckForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { vibe_input } = req.body;
    const result = await getVibeCheck(userId, vibe_input);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('🎮 [GAMES] Get vibe check error:', error);
    res.status(500).json({ success: false, error: 'Vibe check fetch nahi hua' });
  }
};

// 11. Random Fact
const getRandomFactForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const fact = await getRandomFact(userId);
    res.json({ success: true, fact });
  } catch (error) {
    console.error('🎮 [GAMES] Get random fact error:', error);
    res.status(500).json({ success: false, error: 'Fact fetch nahi hua' });
  }
};

// 12. Time Bomb
const startTimeBombForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const bomb = await startTimeBomb(userId);
    res.json({ success: true, bomb });
  } catch (error) {
    console.error('🎮 [GAMES] Start time bomb error:', error);
    res.status(500).json({ success: false, error: 'Bomb start nahi hua' });
  }
};

const defuseTimeBombForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { bomb_id, defuse_time } = req.body;
    const result = await defuseTimeBomb(userId, bomb_id, defuse_time);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('🎮 [GAMES] Defuse time bomb error:', error);
    res.status(500).json({ success: false, error: 'Bomb defuse nahi hua' });
  }
};

// 13. Chaos Button
const pressChaosButtonForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const result = await pressChaosButton(userId);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('🎮 [GAMES] Press chaos button error:', error);
    res.status(500).json({ success: false, error: 'Chaos button press nahi hua' });
  }
};

// 14. Meme Generator
const submitMemeGeneratorForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { meme_text } = req.body;
    const result = await submitMemeGenerator(userId, meme_text);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('🎮 [GAMES] Submit meme generator error:', error);
    res.status(500).json({ success: false, error: 'Meme submit nahi hui' });
  }
};

// 15. Desi Roast
const getDesiRoastForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const roast = await getDesiRoast(userId);
    res.json({ success: true, roast });
  } catch (error) {
    console.error('🎮 [GAMES] Get desi roast error:', error);
    res.status(500).json({ success: false, error: 'Roast fetch nahi hui' });
  }
};

// 16. Luck Draw
const spinLuckDrawForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const result = await spinLuckDraw(userId);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('🎮 [GAMES] Spin luck draw error:', error);
    res.status(500).json({ success: false, error: 'Draw spin nahi hui' });
  }
};

// 17. Reaction Test
const startReactionTestForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const test = await startReactionTest(userId);
    res.json({ success: true, test });
  } catch (error) {
    console.error('🎮 [GAMES] Start reaction test error:', error);
    res.status(500).json({ success: false, error: 'Test start nahi hua' });
  }
};

const submitReactionForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { test_id, reaction_time } = req.body;
    const result = await submitReaction(userId, test_id, reaction_time);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('🎮 [GAMES] Submit reaction error:', error);
    res.status(500).json({ success: false, error: 'Reaction submit nahi hui' });
  }
};

// 18. Nonsense Generator
const getNonsenseGeneratorPromptForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const prompt = await getNonsenseGeneratorPrompt(userId);
    res.json({ success: true, prompt });
  } catch (error) {
    console.error('🎮 [GAMES] Get nonsense generator prompt error:', error);
    res.status(500).json({ success: false, error: 'Prompt fetch nahi hua' });
  }
};

const submitNonsenseGeneratorForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { prompt_id, nonsense } = req.body;
    const result = await submitNonsenseGenerator(userId, prompt_id, nonsense);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('🎮 [GAMES] Submit nonsense generator error:', error);
    res.status(500).json({ success: false, error: 'Nonsense submit nahi hui' });
  }
};

// 19. Mood Ring
const getMoodRingForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { mood_input } = req.body;
    const result = await getMoodRing(userId, mood_input);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('🎮 [GAMES] Get mood ring error:', error);
    res.status(500).json({ success: false, error: 'Mood ring fetch nahi hua' });
  }
};

// 20. Bakchodi Meter
const getBakchodiMeterForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { bakchodi_text } = req.body;
    const result = await getBakchodiMeter(userId, bakchodi_text);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('🎮 [GAMES] Get bakchodi meter error:', error);
    res.status(500).json({ success: false, error: 'Bakchodi meter fetch nahi hua' });
  }
};

// 21. Random Dare
const getRandomDareForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const dare = await getRandomDare(userId);
    res.json({ success: true, dare });
  } catch (error) {
    console.error('🎮 [GAMES] Get random dare error:', error);
    res.status(500).json({ success: false, error: 'Dare fetch nahi hui' });
  }
};

// 22. Speed Typing
const startSpeedTypingForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const typing = await startSpeedTyping(userId);
    res.json({ success: true, typing });
  } catch (error) {
    console.error('🎮 [GAMES] Start speed typing error:', error);
    res.status(500).json({ success: false, error: 'Typing start nahi hua' });
  }
};

const submitSpeedTypingForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { typing_id, wpm, accuracy } = req.body;
    const result = await submitSpeedTyping(userId, typing_id, wpm, accuracy);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('🎮 [GAMES] Submit speed typing error:', error);
    res.status(500).json({ success: false, error: 'Score submit nahi hua' });
  }
};

// 23. Emoji Story
const getEmojiStoryForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const story = await getEmojiStory(userId);
    res.json({ success: true, story });
  } catch (error) {
    console.error('🎮 [GAMES] Get emoji story error:', error);
    res.status(500).json({ success: false, error: 'Story fetch nahi hui' });
  }
};

const submitEmojiStoryForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { story_id, emoji_story } = req.body;
    const result = await submitEmojiStory(userId, story_id, emoji_story);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('🎮 [GAMES] Submit emoji story error:', error);
    res.status(500).json({ success: false, error: 'Story submit nahi hui' });
  }
};

// 24. Vibe Meter
const getVibeMeterForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { vibe_input } = req.body;
    const result = await getVibeMeter(userId, vibe_input);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('🎮 [GAMES] Get vibe meter error:', error);
    res.status(500).json({ success: false, error: 'Vibe meter fetch nahi hua' });
  }
};

// 25. Random Compliment
const getRandomComplimentForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const compliment = await getRandomCompliment(userId);
    res.json({ success: true, compliment });
  } catch (error) {
    console.error('🎮 [GAMES] Get random compliment error:', error);
    res.status(500).json({ success: false, error: 'Compliment fetch nahi hui' });
  }
};

// 26. Pressure Cooker
const startPressureCookerForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const cooker = await startPressureCooker(userId);
    res.json({ success: true, cooker });
  } catch (error) {
    console.error('🎮 [GAMES] Start pressure cooker error:', error);
    res.status(500).json({ success: false, error: 'Pressure cooker start nahi hua' });
  }
};

const submitPressureCookerRoundForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { cooker_id, round, completed } = req.body;
    const result = await submitPressureCookerRound(userId, cooker_id, round, completed);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('🎮 [GAMES] Submit pressure round error:', error);
    res.status(500).json({ success: false, error: 'Round submit nahi hui' });
  }
};

const completePressureCookerForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { cooker_id, total_rounds } = req.body;
    const result = await completePressureCooker(userId, cooker_id, total_rounds);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('🎮 [GAMES] Complete pressure cooker error:', error);
    res.status(500).json({ success: false, error: 'Pressure cooker complete nahi hui' });
  }
};

// 27. Nonsense Quiz
const getNonsenseQuizForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const quiz = await getNonsenseQuiz(userId);
    res.json({ success: true, quiz });
  } catch (error) {
    console.error('🎮 [GAMES] Get nonsense quiz error:', error);
    res.status(500).json({ success: false, error: 'Quiz fetch nahi hua' });
  }
};

const submitNonsenseQuizForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { quiz_id, answers } = req.body;
    const result = await submitNonsenseQuiz(userId, quiz_id, answers);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('🎮 [GAMES] Submit nonsense quiz error:', error);
    res.status(500).json({ success: false, error: 'Quiz submit nahi hui' });
  }
};

// 28. Desi Challenge (different from desiMaster)
const getDesiChallengeOldForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const challenge = await getDesiChallengeGame(userId);
    res.json({ success: true, challenge });
  } catch (error) {
    console.error('🎮 [GAMES] Get desi challenge error:', error);
    res.status(500).json({ success: false, error: 'Challenge fetch nahi hua' });
  }
};

const completeDesiChallengeOldForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { challenge_id } = req.body;
    const result = await completeDesiChallengeGame(userId, challenge_id);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('🎮 [GAMES] Complete desi challenge error:', error);
    res.status(500).json({ success: false, error: 'Challenge complete nahi hui' });
  }
};

// 29. Random Roast
const getRandomRoastForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const roast = await getRandomRoast(userId);
    res.json({ success: true, roast });
  } catch (error) {
    console.error('🎮 [GAMES] Get random roast error:', error);
    res.status(500).json({ success: false, error: 'Roast fetch nahi hui' });
  }
};

module.exports = {
  getChallenge,
  submitChallenge,
  getChallengeHistory,
  getDebateTopic,
  getDebate,
  submitDebateMessage,
  forfeitDebate,
  getMemeImage,
  submitMeme,
  spin,
  predictFuture,
  submitTap,
  getLeaderboard,
  recordWin,
  getDareForUser,
  getRoastForUser,
  // NEW 30 GAMES CONTROLLERS
  getGyaanGuruForUser,
  submitGyaanRatingForUser,
  startBakwaasBattleForUser,
  submitBakwaasForUser,
  getEmojiMashupForUser,
  submitEmojiMashupForUser,
  startMoodSwingerForUser,
  submitMoodSwitchForUser,
  getPoetryChallengeForUser,
  submitPoetryForUser,
  getAukaatCheckForUser,
  getAukaatCheckGameForUser,
  getJhandMeterForUser,
  submitDesiSpeedRushForUser,
  getCringeLevelForUser,
  getVibeDetectorForUser,
  getUselessFactForUser,
  startBombTimerForUser,
  defuseBombForUser,
  generateChaosForUser,
  submitMemeMasterForUser,
  getDesiBurnForUser,
  spinLuckyChaosForUser,
  startReflexMasterForUser,
  submitReflexForUser,
  getNonsensePromptForUser,
  submitNonsenseForUser,
  getMoodReadingForUser,
  getBakchodiLevelForUser,
  getDareMasterForUser,
  completeDareMasterForUser,
  startTypingChaosForUser,
  submitTypingScoreForUser,
  getEmojiTaleForUser,
  submitEmojiTaleForUser,
  scanVibeForUser,
  getComplimentChaosForUser,
  startPressureTestForUser,
  submitPressureRoundForUser,
  completePressureTestForUser,
  getQuizChaosForUser,
  submitQuizAnswersForUser,
  startChaosSurvivalForUser,
  surviveChaosEventForUser,
  completeChaosSurvivalForUser,
  getDesiChallengeForUser,
  completeDesiChallengeForUser,
  // MISSING 29 GAMES CONTROLLERS
  getGyaanShotForUser,
  submitGyaanShotRatingForUser,
  getBakwaasMeterForUser,
  startEmojiFightForUser,
  submitEmojiFightForUser,
  startMoodSwitchGameForUser,
  submitMoodSwitchGameForUser,
  getNonsensePoetryChallengeForUser,
  submitNonsensePoetryForUser,
  getAukaatCheckGameForUser,
  getJhandChallengeForUser,
  completeJhandChallengeForUser,
  submitDesiSpeedTapForUser,
  getCringeMeterForUser,
  getVibeCheckForUser,
  getRandomFactForUser,
  startTimeBombForUser,
  defuseTimeBombForUser,
  pressChaosButtonForUser,
  submitMemeGeneratorForUser,
  getDesiRoastForUser,
  spinLuckDrawForUser,
  startReactionTestForUser,
  submitReactionForUser,
  getNonsenseGeneratorPromptForUser,
  submitNonsenseGeneratorForUser,
  getMoodRingForUser,
  getBakchodiMeterForUser,
  getRandomDareForUser,
  startSpeedTypingForUser,
  submitSpeedTypingForUser,
  getEmojiStoryForUser,
  submitEmojiStoryForUser,
  getVibeMeterForUser,
  getRandomComplimentForUser,
  startPressureCookerForUser,
  submitPressureCookerRoundForUser,
  completePressureCookerForUser,
  getNonsenseQuizForUser,
  submitNonsenseQuizForUser,
  getDesiChallengeOldForUser,
  completeDesiChallengeOldForUser,
  getRandomRoastForUser
};

