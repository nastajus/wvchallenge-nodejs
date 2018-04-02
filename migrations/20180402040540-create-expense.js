'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Expenses', {
      expId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATE
      },
      empId: {
        type: Sequelize.INTEGER
      },
      category: {
        type: Sequelize.STRING
      },
      expDescription: {
        type: Sequelize.STRING
      },
      // preTaxAmount: {
	   //    type: Sequelize.DECIMAL(13, 2),
	   //    // precision: 13,
	   //    // scale: 2
      // },
      taxName: {
        type: Sequelize.STRING
      },
      // taxAmount: {
      //   type: Sequelize.DECIMAL(13, 2),
      //   // precision: 13,
      //   // scale: 2
      // },
      createdAt: {
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Expenses');
  }
};