const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TambolaRoom = sequelize.define('TambolaRoom', {
  room_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  status: {
    type: DataTypes.ENUM('waiting', 'active', 'completed'),
    defaultValue: 'waiting'
  },
  called_numbers: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  current_number: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  winner_user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  started_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  completed_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'TambolaRooms',
  timestamps: false
});

module.exports = TambolaRoom;

