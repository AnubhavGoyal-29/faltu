const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../middlewares/auth');
const {
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
  // NEW 30 GAMES
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
} = require('../controllers/gamesController');

// Daily Bakchodi Challenge
router.get('/bakchodi/challenge', authenticateToken, getChallenge);
router.post('/bakchodi/submit', authenticateToken, submitChallenge);
router.get('/bakchodi/history', authenticateToken, getChallengeHistory);

// Debate
router.get('/debate/topic', authenticateToken, getDebateTopic);
router.get('/debate/:debate_id', authenticateToken, getDebate);
router.post('/debate/message', authenticateToken, submitDebateMessage);
router.post('/debate/forfeit', authenticateToken, forfeitDebate);

// Meme Battle
router.get('/meme/image', authenticateToken, getMemeImage);
router.post('/meme/submit', authenticateToken, submitMeme);

// Wheel Spin
router.post('/wheel/spin', authenticateToken, spin);

// Future Prediction
router.post('/future/predict', authenticateToken, predictFuture);

// Tap Game
router.post('/tap/submit', authenticateToken, submitTap);
router.get('/tap/leaderboard', authenticateToken, getLeaderboard);

// Runaway Button
router.post('/runaway/win', authenticateToken, recordWin);

// Dare Machine
router.get('/dare', authenticateToken, getDareForUser);

// Roast Me
router.get('/roast', authenticateToken, getRoastForUser);

// NEW 30 GAMES ROUTES

// Gyaan Guru
router.get('/gyaanGuru', authenticateToken, getGyaanGuruForUser);
router.post('/gyaanGuru/rate', authenticateToken, submitGyaanRatingForUser);

// Bakwaas Battle
router.post('/bakwaasBattle/start', authenticateToken, startBakwaasBattleForUser);
router.post('/bakwaasBattle/submit', authenticateToken, submitBakwaasForUser);

// Emoji Mashup
router.get('/emojiMashup', authenticateToken, getEmojiMashupForUser);
router.post('/emojiMashup/submit', authenticateToken, submitEmojiMashupForUser);

// Mood Swinger
router.post('/moodSwinger/start', authenticateToken, startMoodSwingerForUser);
router.post('/moodSwinger/switch', authenticateToken, submitMoodSwitchForUser);

// Poetry Chaos
router.get('/poetryChaos', authenticateToken, getPoetryChallengeForUser);
router.post('/poetryChaos/submit', authenticateToken, submitPoetryForUser);

// Aukaat Meter
router.get('/aukaatMeter', authenticateToken, getAukaatCheckForUser);

// Jhand Meter
router.get('/jhandMeter', authenticateToken, getJhandMeterForUser);

// Desi Speed Rush
router.post('/desiSpeedRush/submit', authenticateToken, submitDesiSpeedRushForUser);

// Cringe Level
router.post('/cringeLevel', authenticateToken, getCringeLevelForUser);

// Vibe Detector
router.post('/vibeDetector', authenticateToken, getVibeDetectorForUser);

// Useless Fact
router.get('/uselessFact', authenticateToken, getUselessFactForUser);

// Bomb Timer
router.post('/bombTimer/start', authenticateToken, startBombTimerForUser);
router.post('/bombTimer/defuse', authenticateToken, defuseBombForUser);

// Chaos Generator
router.post('/chaosGenerator', authenticateToken, generateChaosForUser);

// Meme Master
router.post('/memeMaster/submit', authenticateToken, submitMemeMasterForUser);

// Desi Burn
router.get('/desiBurn', authenticateToken, getDesiBurnForUser);

// Lucky Chaos
router.post('/luckyChaos/spin', authenticateToken, spinLuckyChaosForUser);

// Reflex Master
router.post('/reflexMaster/start', authenticateToken, startReflexMasterForUser);
router.post('/reflexMaster/submit', authenticateToken, submitReflexForUser);

// Nonsense Factory
router.get('/nonsenseFactory', authenticateToken, getNonsensePromptForUser);
router.post('/nonsenseFactory/submit', authenticateToken, submitNonsenseForUser);

// Mood Reader
router.post('/moodReader', authenticateToken, getMoodReadingForUser);

// Bakchodi Level
router.post('/bakchodiLevel', authenticateToken, getBakchodiLevelForUser);

// Dare Master
router.get('/dareMaster', authenticateToken, getDareMasterForUser);
router.post('/dareMaster/complete', authenticateToken, completeDareMasterForUser);

// Typing Chaos
router.post('/typingChaos/start', authenticateToken, startTypingChaosForUser);
router.post('/typingChaos/submit', authenticateToken, submitTypingScoreForUser);

// Emoji Tale
router.get('/emojiTale', authenticateToken, getEmojiTaleForUser);
router.post('/emojiTale/submit', authenticateToken, submitEmojiTaleForUser);

// Vibe Scanner
router.post('/vibeScanner', authenticateToken, scanVibeForUser);

// Compliment Chaos
router.get('/complimentChaos', authenticateToken, getComplimentChaosForUser);

// Pressure Test
router.post('/pressureTest/start', authenticateToken, startPressureTestForUser);
router.post('/pressureTest/round', authenticateToken, submitPressureRoundForUser);
router.post('/pressureTest/complete', authenticateToken, completePressureTestForUser);

// Quiz Chaos
router.get('/quizChaos', authenticateToken, getQuizChaosForUser);
router.post('/quizChaos/submit', authenticateToken, submitQuizAnswersForUser);

// Chaos Survival
router.post('/chaosSurvival/start', authenticateToken, startChaosSurvivalForUser);
router.post('/chaosSurvival/survive', authenticateToken, surviveChaosEventForUser);
router.post('/chaosSurvival/complete', authenticateToken, completeChaosSurvivalForUser);

// Desi Master
router.get('/desiMaster', authenticateToken, getDesiChallengeForUser);
router.post('/desiMaster/complete', authenticateToken, completeDesiChallengeForUser);

// ============================================
// MISSING 29 GAMES ROUTES
// ============================================

// 1. Gyaan Shot
router.get('/gyaanShot', authenticateToken, getGyaanShotForUser);
router.post('/gyaanShot/rate', authenticateToken, submitGyaanShotRatingForUser);

// 2. Bakwaas Meter
router.post('/bakwaasMeter', authenticateToken, getBakwaasMeterForUser);

// 3. Emoji Fight
router.post('/emojiFight/start', authenticateToken, startEmojiFightForUser);
router.post('/emojiFight/submit', authenticateToken, submitEmojiFightForUser);

// 4. Mood Switch
router.post('/moodSwitch/start', authenticateToken, startMoodSwitchGameForUser);
router.post('/moodSwitch/submit', authenticateToken, submitMoodSwitchGameForUser);

// 5. Nonsense Poetry
router.get('/nonsensePoetry', authenticateToken, getNonsensePoetryChallengeForUser);
router.post('/nonsensePoetry/submit', authenticateToken, submitNonsensePoetryForUser);

// 6. Aukaat Check
router.get('/aukaatCheck', authenticateToken, getAukaatCheckGameForUser);

// 7. Jhand Challenge
router.get('/jhandChallenge', authenticateToken, getJhandChallengeForUser);
router.post('/jhandChallenge/complete', authenticateToken, completeJhandChallengeForUser);

// 8. Desi Speed Tap
router.post('/desiSpeedTap/submit', authenticateToken, submitDesiSpeedTapForUser);

// 9. Cringe Meter
router.post('/cringeMeter', authenticateToken, getCringeMeterForUser);

// 10. Vibe Check
router.post('/vibeCheck', authenticateToken, getVibeCheckForUser);

// 11. Random Fact
router.get('/randomFact', authenticateToken, getRandomFactForUser);

// 12. Time Bomb
router.post('/timeBomb/start', authenticateToken, startTimeBombForUser);
router.post('/timeBomb/defuse', authenticateToken, defuseTimeBombForUser);

// 13. Chaos Button
router.post('/chaosButton', authenticateToken, pressChaosButtonForUser);

// 14. Meme Generator
router.post('/memeGenerator/submit', authenticateToken, submitMemeGeneratorForUser);

// 15. Desi Roast
router.get('/desiRoast', authenticateToken, getDesiRoastForUser);

// 16. Luck Draw
router.post('/luckDraw/spin', authenticateToken, spinLuckDrawForUser);

// 17. Reaction Test
router.post('/reactionTest/start', authenticateToken, startReactionTestForUser);
router.post('/reactionTest/submit', authenticateToken, submitReactionForUser);

// 18. Nonsense Generator
router.get('/nonsenseGenerator', authenticateToken, getNonsenseGeneratorPromptForUser);
router.post('/nonsenseGenerator/submit', authenticateToken, submitNonsenseGeneratorForUser);

// 19. Mood Ring
router.post('/moodRing', authenticateToken, getMoodRingForUser);

// 20. Bakchodi Meter
router.post('/bakchodiMeter', authenticateToken, getBakchodiMeterForUser);

// 21. Random Dare
router.get('/randomDare', authenticateToken, getRandomDareForUser);

// 22. Speed Typing
router.post('/speedTyping/start', authenticateToken, startSpeedTypingForUser);
router.post('/speedTyping/submit', authenticateToken, submitSpeedTypingForUser);

// 23. Emoji Story
router.get('/emojiStory', authenticateToken, getEmojiStoryForUser);
router.post('/emojiStory/submit', authenticateToken, submitEmojiStoryForUser);

// 24. Vibe Meter
router.post('/vibeMeter', authenticateToken, getVibeMeterForUser);

// 25. Random Compliment
router.get('/randomCompliment', authenticateToken, getRandomComplimentForUser);

// 26. Pressure Cooker
router.post('/pressureCooker/start', authenticateToken, startPressureCookerForUser);
router.post('/pressureCooker/round', authenticateToken, submitPressureCookerRoundForUser);
router.post('/pressureCooker/complete', authenticateToken, completePressureCookerForUser);

// 27. Nonsense Quiz
router.get('/nonsenseQuiz', authenticateToken, getNonsenseQuizForUser);
router.post('/nonsenseQuiz/submit', authenticateToken, submitNonsenseQuizForUser);

// 28. Desi Challenge (different from desiMaster)
router.get('/desiChallenge', authenticateToken, getDesiChallengeOldForUser);
router.post('/desiChallenge/complete', authenticateToken, completeDesiChallengeOldForUser);

// 29. Random Roast
router.get('/randomRoast', authenticateToken, getRandomRoastForUser);

module.exports = router;

