const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const FuturePrediction = sequelize.define('FuturePrediction', {
  prediction_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'user_id' }
  },
  user_name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  mood: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  fav_snack: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  prediction: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'FuturePredictions',
  timestamps: false
});

module.exports = FuturePrediction;

