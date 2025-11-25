'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TambolaTicket extends Model {
    static associate(models) {
      TambolaTicket.belongsTo(models.TambolaRoom, { foreignKey: 'room_id', as: 'room' });
      TambolaTicket.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    }
  }
  
  TambolaTicket.init({
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
        model: 'Users',
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
    has_won: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'TambolaTicket',
    tableName: 'TambolaTickets',
    timestamps: false
  });
  
  return TambolaTicket;
};

