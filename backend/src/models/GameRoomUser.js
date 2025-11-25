const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const GameRoomUser = sequelize.define('GameRoomUser', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  game_room_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'GameRooms', key: 'game_room_id' }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'user_id' }
  },
  joined_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'GameRoomUsers',
  timestamps: false
});

module.exports = GameRoomUser;

