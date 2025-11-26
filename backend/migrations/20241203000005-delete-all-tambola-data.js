'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Delete all Tambola tickets
    await queryInterface.sequelize.query('DELETE FROM TambolaTickets');
    
    // Delete all Tambola rooms
    await queryInterface.sequelize.query('DELETE FROM TambolaRooms');
    
    console.log('✅ All Tambola data deleted successfully');
  },

  async down(queryInterface, Sequelize) {
    // Cannot restore deleted data
    console.log('⚠️ Cannot restore deleted Tambola data');
  }
};

