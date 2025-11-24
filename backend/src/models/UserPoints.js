const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UserPoints = sequelize.define('UserPoints', {
  points_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id'
    },
    unique: true
  },
  total_points: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true
  },
  login_streak: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'user_points',
  timestamps: false
});

module.exports = UserPoints;

