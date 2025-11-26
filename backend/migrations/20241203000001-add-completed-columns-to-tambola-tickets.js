'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if column already exists
    const tableDescription = await queryInterface.describeTable('TambolaTickets');
    
    if (!tableDescription.completed_columns) {
      await queryInterface.addColumn('TambolaTickets', 'completed_columns', {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      });
      console.log('✅ Added completed_columns column to TambolaTickets table');
    } else {
      console.log('⚠️ completed_columns column already exists, skipping...');
    }
  },

  async down(queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('TambolaTickets');
    
    if (tableDescription.completed_columns) {
      await queryInterface.removeColumn('TambolaTickets', 'completed_columns');
    }
  }
};

