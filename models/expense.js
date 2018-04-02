'use strict';
module.exports = (sequelize, DataTypes) => {
  var Expense = sequelize.define('Expense', {
    expId: DataTypes.INTEGER,
    date: DataTypes.DATE,
    empId: {
      type: DataTypes.INTEGER,
      //references: { model: 'employees', key: 'empId' }
    },
    category: DataTypes.STRING,
    expDescription: DataTypes.STRING,
    // preTaxAmount: {
    //   type: DataTypes.DECIMAL(13, 2),
    //   // precision: 13,
    //   // scale: 2
    // },
    taxName: DataTypes.STRING,
    // taxAmount: {
	 //  type: DataTypes.DECIMAL(13, 2),
	 //  // precision: 13,
	 //  // scale: 2
    // },
  }, {});
  Expense.associate = function(models) {
	  // Expense.hasOne(models.employee, {
		//   foreignKey: 'empId'
	  // })
  };
  return Expense;
};