'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if column already exists
    const tableDescription = await queryInterface.describeTable('TambolaRooms');
    
    if (!tableDescription.completed_win_types) {
      await queryInterface.addColumn('TambolaRooms', 'completed_win_types', {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: [],
        comment: 'Track which win types have been won: ["row_1", "row_2", "row_3", "col_1", "col_2", "col_3", "full_house"]'
      });
      console.log('✅ Added completed_win_types column to TambolaRooms table');
    } else {
      console.log('⚠️ completed_win_types column already exists, skipping...');
    }
  },

  async down(queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('TambolaRooms');
    
    if (tableDescription.completed_win_types) {
      await queryInterface.removeColumn('TambolaRooms', 'completed_win_types');
    }
  }
};

