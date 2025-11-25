const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Roast = sequelize.define('Roast', {
  roast_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'user_id' }
  },
  roast_text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Roasts',
  timestamps: false
});

module.exports = Roast;

