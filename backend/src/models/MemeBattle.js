const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const MemeBattle = sequelize.define('MemeBattle', {
  battle_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'user_id' }
  },
  image_url: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  caption: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  humor_score: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  creativity_score: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  nonsense_score: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  total_score: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'MemeBattles',
  timestamps: false
});

module.exports = MemeBattle;

