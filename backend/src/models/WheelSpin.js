const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const WheelSpin = sequelize.define('WheelSpin', {
  spin_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'user_id' }
  },
  result_type: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  result_content: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'WheelSpins',
  timestamps: false
});

module.exports = WheelSpin;

