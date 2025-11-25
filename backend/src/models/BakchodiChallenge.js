const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const BakchodiChallenge = sequelize.define('BakchodiChallenge', {
  challenge_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'user_id' }
  },
  challenge_text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  submission: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ai_score: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  ai_review: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'BakchodiChallenges',
  timestamps: false
});

module.exports = BakchodiChallenge;

