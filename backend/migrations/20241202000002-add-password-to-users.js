'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if column already exists
    const tableDescription = await queryInterface.describeTable('users');
    
    if (!tableDescription.password) {
      // Add password column to users table
      await queryInterface.addColumn('users', 'password', {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Hashed password for email/password login'
      });
      console.log('✅ Added password column to users table');
    } else {
      console.log('⚠️ Password column already exists, skipping...');
    }
  },

  async down(queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('users');
    
    if (tableDescription.password) {
      await queryInterface.removeColumn('users', 'password');
    }
  }
};

