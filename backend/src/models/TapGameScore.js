const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TapGameScore = sequelize.define('TapGameScore', {
  score_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'user_id' }
  },
  taps: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'TapGameScores',
  timestamps: false
});

module.exports = TapGameScore;

