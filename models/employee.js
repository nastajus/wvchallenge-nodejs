'use strict';
module.exports = (sequelize, DataTypes) => {
  var Employee = sequelize.define('Employee', {
    empId: {
	  type: DataTypes.INTEGER,
	  primaryKey: true,
	  autoIncrement: true,
	  allowNull: false
    },
    name: {
      type: DataTypes.STRING,
	  unique: true
    },
    address: DataTypes.STRING
  }, {});
  Employee.associate = function(models) {
    // associations can be defined here
  };
  return Employee;
};