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
  completed_win_types: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Track which win types have been won: ["row_1", "row_2", "row_3", "col_1", "col_2", "col_3", "full_house"]'
  },
  winner_user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  registration_end_at: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'When registration period ends (5 minutes after created_at)'
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

