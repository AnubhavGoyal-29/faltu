const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const LuckyDraw = sequelize.define('LuckyDraw', {
  draw_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  winner_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  reward_points: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 100
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'lucky_draws',
  timestamps: false
});

module.exports = LuckyDraw;

