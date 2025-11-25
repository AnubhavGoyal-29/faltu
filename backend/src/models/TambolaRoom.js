'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TambolaRoom extends Model {
    static associate(models) {
      TambolaRoom.hasMany(models.TambolaTicket, { foreignKey: 'room_id', as: 'tickets' });
      TambolaRoom.belongsTo(models.User, { foreignKey: 'winner_user_id', as: 'winner' });
    }
  }
  
  TambolaRoom.init({
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
        model: 'Users',
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
    sequelize,
    modelName: 'TambolaRoom',
    tableName: 'TambolaRooms',
    timestamps: false
  });
  
  return TambolaRoom;
};

