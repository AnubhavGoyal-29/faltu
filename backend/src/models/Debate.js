const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Debate = sequelize.define('Debate', {
  debate_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'user_id' }
  },
  topic: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  messages: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of debate messages: [{sender: "user"|"ai", message: "...", timestamp: "..."}]'
  },
  status: {
    type: DataTypes.ENUM('active', 'user_won', 'ai_won', 'user_forfeit', 'completed'),
    defaultValue: 'active'
  },
  winner: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  ai_explanation: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Debates',
  timestamps: false
});

module.exports = Debate;

