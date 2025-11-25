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
  user_argument: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  ai_counter_argument: {
    type: DataTypes.TEXT,
    allowNull: true
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
  }
}, {
  tableName: 'Debates',
  timestamps: false
});

module.exports = Debate;

