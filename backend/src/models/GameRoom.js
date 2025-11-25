const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const GameRoom = sequelize.define('GameRoom', {
  game_room_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  room_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'completed'),
    defaultValue: 'active'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'GameRooms',
  timestamps: false
});

module.exports = GameRoom;

