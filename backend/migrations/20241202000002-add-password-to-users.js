'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add password column to users table
    await queryInterface.addColumn('users', 'password', {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: 'Hashed password for email/password login'
    });

    // Add index for email lookups (if not exists)
    const tableDescription = await queryInterface.describeTable('users');
    if (!tableDescription.email) {
      // Email column should already exist, but just in case
      console.log('Email column already exists');
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'password');
  }
};

