'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if columns already exist
    const tableDescription = await queryInterface.describeTable('Debates');
    
    // Add messages column if it doesn't exist
    if (!tableDescription.messages) {
      await queryInterface.addColumn('Debates', 'messages', {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      });
      console.log('✅ Added messages column to Debates table');
    } else {
      console.log('⚠️ messages column already exists, skipping...');
    }
    
    // Add status column if it doesn't exist
    if (!tableDescription.status) {
      await queryInterface.addColumn('Debates', 'status', {
        type: Sequelize.ENUM('active', 'user_won', 'ai_won', 'user_forfeit', 'completed'),
        defaultValue: 'active'
      });
      console.log('✅ Added status column to Debates table');
    } else {
      console.log('⚠️ status column already exists, skipping...');
    }
    
    // Add updated_at column if it doesn't exist
    if (!tableDescription.updated_at) {
      await queryInterface.addColumn('Debates', 'updated_at', {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW
      });
      console.log('✅ Added updated_at column to Debates table');
    } else {
      console.log('⚠️ updated_at column already exists, skipping...');
    }
    
    // Migrate old data: convert user_argument and ai_counter_argument to messages format
    const debates = await queryInterface.sequelize.query(
      "SELECT debate_id, user_argument, ai_counter_argument FROM Debates WHERE messages IS NULL OR JSON_LENGTH(messages) = 0",
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    for (const debate of debates) {
      const messages = [];
      if (debate.user_argument) {
        messages.push({
          sender: 'user',
          message: debate.user_argument,
          timestamp: new Date().toISOString()
        });
      }
      if (debate.ai_counter_argument) {
        messages.push({
          sender: 'ai',
          message: debate.ai_counter_argument,
          timestamp: new Date().toISOString()
        });
      }
      
      if (messages.length > 0) {
        await queryInterface.sequelize.query(
          `UPDATE Debates SET messages = :messages, status = 'completed' WHERE debate_id = :id`,
          {
            replacements: { messages: JSON.stringify(messages), id: debate.debate_id },
            type: Sequelize.QueryTypes.UPDATE
          }
        );
      }
    }
    
    console.log(`✅ Migrated ${debates.length} old debates to new format`);
  },

  async down(queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('Debates');
    
    if (tableDescription.messages) {
      await queryInterface.removeColumn('Debates', 'messages');
    }
    if (tableDescription.status) {
      await queryInterface.removeColumn('Debates', 'status');
    }
    if (tableDescription.updated_at) {
      await queryInterface.removeColumn('Debates', 'updated_at');
    }
  }
};

