'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create TambolaRooms table
    await queryInterface.createTable('TambolaRooms', {
      room_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      status: {
        type: Sequelize.ENUM('waiting', 'active', 'completed'),
        defaultValue: 'waiting'
      },
      called_numbers: {
        type: Sequelize.JSON,
        defaultValue: []
      },
      current_number: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      winner_user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'user_id'
        }
      },
      started_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      completed_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Create TambolaTickets table
    await queryInterface.createTable('TambolaTickets', {
      ticket_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      room_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'TambolaRooms',
          key: 'room_id'
        }
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id'
        }
      },
      ticket_numbers: {
        type: Sequelize.JSON,
        allowNull: false
      },
      marked_numbers: {
        type: Sequelize.JSON,
        defaultValue: []
      },
      completed_rows: {
        type: Sequelize.JSON,
        defaultValue: []
      },
      has_won: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('TambolaTickets');
    await queryInterface.dropTable('TambolaRooms');
  }
};

