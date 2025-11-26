const sequelize = require('../config/db');
const User = require('./User');
const ChatRoom = require('./ChatRoom');
const ChatMessage = require('./ChatMessage');
const LuckyDraw = require('./LuckyDraw');
const UserPoints = require('./UserPoints');
const ChaosEvent = require('./ChaosEvent');
const TambolaRoom = require('./TambolaRoom');
const TambolaTicket = require('./TambolaTicket');
const BakchodiChallenge = require('./BakchodiChallenge');
const Debate = require('./Debate');
const MemeBattle = require('./MemeBattle');
const WheelSpin = require('./WheelSpin');
const FuturePrediction = require('./FuturePrediction');
const TapGameScore = require('./TapGameScore');
const RunawayButtonWin = require('./RunawayButtonWin');
const Dare = require('./Dare');
const Roast = require('./Roast');
const GameRoom = require('./GameRoom');
const GameRoomUser = require('./GameRoomUser');
const UserActivityTracking = require('./UserActivityTracking');

// Define associations
ChatMessage.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
ChatMessage.belongsTo(ChatRoom, { foreignKey: 'room_id', as: 'room' });

ChatRoom.hasMany(ChatMessage, { foreignKey: 'room_id', as: 'messages' });
User.hasMany(ChatMessage, { foreignKey: 'user_id', as: 'messages' });

LuckyDraw.belongsTo(User, { foreignKey: 'winner_user_id', as: 'winner' });
User.hasMany(LuckyDraw, { foreignKey: 'winner_user_id', as: 'luckyDraws' });

UserPoints.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasOne(UserPoints, { foreignKey: 'user_id', as: 'points' });

ChaosEvent.belongsTo(User, { foreignKey: 'triggered_by_user_id', as: 'triggeredBy' });
User.hasMany(ChaosEvent, { foreignKey: 'triggered_by_user_id', as: 'chaosEvents' });

TambolaTicket.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
TambolaTicket.belongsTo(TambolaRoom, { foreignKey: 'room_id', as: 'room' });
TambolaRoom.hasMany(TambolaTicket, { foreignKey: 'room_id', as: 'tickets' });
TambolaRoom.belongsTo(User, { foreignKey: 'winner_user_id', as: 'winner' });

// Games associations
BakchodiChallenge.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Debate.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
MemeBattle.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
WheelSpin.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
FuturePrediction.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
TapGameScore.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
RunawayButtonWin.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Dare.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Roast.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
GameRoomUser.belongsTo(GameRoom, { foreignKey: 'game_room_id', as: 'room' });
GameRoomUser.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
GameRoom.hasMany(GameRoomUser, { foreignKey: 'game_room_id', as: 'users' });

// UserActivityTracking associations
UserActivityTracking.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(UserActivityTracking, { foreignKey: 'user_id', as: 'activityTracking' });

module.exports = {
  sequelize,
  User,
  ChatRoom,
  ChatMessage,
  LuckyDraw,
  UserPoints,
  ChaosEvent,
  TambolaRoom,
  TambolaTicket,
  BakchodiChallenge,
  Debate,
  MemeBattle,
  WheelSpin,
  FuturePrediction,
  TapGameScore,
  RunawayButtonWin,
  Dare,
  Roast,
  GameRoom,
  GameRoomUser,
  UserActivityTracking
};

