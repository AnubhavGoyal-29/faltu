'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserActivityTracking', {
      tracking_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      activity_type: {
        type: Sequelize.STRING(50),
        allowNull: false,
        comment: 'Type of activity: bakchodi, wordle, debate, meme, wheel, future, tap, runaway, dare, roast'
      },
      visit_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: 'Total number of times user has visited this activity'
      },
      last_visited_at: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Last time user visited this activity'
      },
      last_completed_at: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Last time user completed this activity'
      },
      status: {
        type: Sequelize.ENUM('seen', 'completed', 'skipped'),
        allowNull: true,
        comment: 'Current status of the activity for today'
      },
      status_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
        comment: 'Date when status was set (for daily reset)'
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // Create composite index for efficient queries
    await queryInterface.addIndex('UserActivityTracking', ['user_id', 'activity_type'], {
      unique: true,
      name: 'unique_user_activity'
    });

    // Index for status queries
    await queryInterface.addIndex('UserActivityTracking', ['user_id', 'status', 'status_date'], {
      name: 'idx_user_status_date'
    });

    // Index for visit count queries
    await queryInterface.addIndex('UserActivityTracking', ['user_id', 'visit_count'], {
      name: 'idx_user_visit_count'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserActivityTracking');
  }
};

