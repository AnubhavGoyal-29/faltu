const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Dare = sequelize.define('Dare', {
  dare_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'user_id' }
  },
  dare_text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Dares',
  timestamps: false
});

module.exports = Dare;

