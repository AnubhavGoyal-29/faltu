const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const RunawayButtonWin = sequelize.define('RunawayButtonWin', {
  win_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'user_id' }
  },
  attempts: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  points_earned: {
    type: DataTypes.INTEGER,
    defaultValue: 50
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'RunawayButtonWins',
  timestamps: false
});

module.exports = RunawayButtonWin;

