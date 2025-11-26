const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UserActivityTracking = sequelize.define('UserActivityTracking', {
  tracking_id: {
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
    }
  },
  activity_type: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'Type of activity: bakchodi, wordle, debate, meme, wheel, future, tap, runaway, dare, roast'
  },
  visit_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Total number of times user has visited this activity'
  },
  last_visited_at: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Last time user visited this activity'
  },
  last_completed_at: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Last time user completed this activity'
  },
  status: {
    type: DataTypes.ENUM('seen', 'completed', 'skipped'),
    allowNull: true,
    comment: 'Current status of the activity for today'
  },
  status_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    comment: 'Date when status was set (for daily reset)'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'UserActivityTracking',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'activity_type']
    },
    {
      fields: ['user_id', 'status', 'status_date']
    },
    {
      fields: ['user_id', 'visit_count']
    }
  ]
});

module.exports = UserActivityTracking;

