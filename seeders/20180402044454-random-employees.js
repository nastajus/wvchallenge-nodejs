'use strict';
const mock = require('../mock/MockData');
const mockModel = require('./../mock/MockModel');

var lorem_ipsum = mock.lorem_ipsum.split(' ');

for (var i = 0; i < 5; i++) {
	var e = new mockModel.Employee();
	e.name = mock.random(lorem_ipsum);
	e.name = mock.capitalize(e.name);
	var address = mock.random(mock.addresses);
	e.address = [address.street, address.city, address.postal].join(', ');
	mockModel.employees.push(e);
}

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Employees',
	      mockModel.employees, {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Employees', null, {});
  }
};
