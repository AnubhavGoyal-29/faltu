const sequelize = require('../config/db');
const User = require('./User');
const ChatRoom = require('./ChatRoom');
const ChatMessage = require('./ChatMessage');
const LuckyDraw = require('./LuckyDraw');
const UserPoints = require('./UserPoints');
const ChaosEvent = require('./ChaosEvent');
const TambolaRoom = require('./TambolaRoom');
const TambolaTicket = require('./TambolaTicket');

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

module.exports = {
  sequelize,
  User,
  ChatRoom,
  ChatMessage,
  LuckyDraw,
  UserPoints,
  ChaosEvent,
  TambolaRoom,
  TambolaTicket
};

