'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if column already exists
    const tableDescription = await queryInterface.describeTable('TambolaRooms');
    
    if (!tableDescription.registration_end_at) {
      await queryInterface.addColumn('TambolaRooms', 'registration_end_at', {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'When registration period ends (5 minutes after created_at)'
      });
      console.log('✅ Added registration_end_at column to TambolaRooms table');
      
      // Set registration_end_at for existing waiting rooms
      await queryInterface.sequelize.query(
        `UPDATE TambolaRooms 
         SET registration_end_at = DATE_ADD(created_at, INTERVAL 5 MINUTE) 
         WHERE status = 'waiting' AND registration_end_at IS NULL`,
        { type: Sequelize.QueryTypes.UPDATE }
      );
      console.log('✅ Updated existing waiting rooms with registration_end_at');
    } else {
      console.log('⚠️ registration_end_at column already exists, skipping...');
    }
  },

  async down(queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('TambolaRooms');
    
    if (tableDescription.registration_end_at) {
      await queryInterface.removeColumn('TambolaRooms', 'registration_end_at');
    }
  }
};

