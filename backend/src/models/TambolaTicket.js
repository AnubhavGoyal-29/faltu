const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TambolaTicket = sequelize.define('TambolaTicket', {
  ticket_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  room_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'TambolaRooms',
      key: 'room_id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  ticket_numbers: {
    type: DataTypes.JSON,
    allowNull: false
  },
  marked_numbers: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  completed_rows: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  completed_columns: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  has_won: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'TambolaTickets',
  timestamps: false
});

module.exports = TambolaTicket;

