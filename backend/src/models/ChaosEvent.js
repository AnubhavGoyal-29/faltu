const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ChaosEvent = sequelize.define('ChaosEvent', {
  event_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  triggered_by_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  event_type: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  event_data: {
    type: DataTypes.JSON,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'chaos_events',
  timestamps: false
});

module.exports = ChaosEvent;

