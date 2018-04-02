'use strict';
const mock = require('../mock/MockData');
const mockModel = require('./../mock/MockModel');

for (var i = 0; i < 20; i++) {

	//TODO: Invalid Date generated about 10% of the time when using random(). Uncertain why yet.

	//var e = new mockModel.Expense();
	//var expense = mock.random(mock.expenses);
	var expense = mock.expenses[i];
	var dateParts = expense.date.toString().split('/').map(Number);
    // Please pay attention to the month (dateParts[1]); JavaScript counts months from 0:
    // January - 0, February - 1, etc.

	// input format: mdy
	// output format: ymd
	expense.date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
	// if (expense.date === undefined || expense.date === null)
	// 	throw new Error({'hehe':'haha'});

	expense.taxName = "HST Sales tax";
	mockModel.expenses.push(expense);
    console.log(expense.date)
}

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('Expenses',
			mockModel.expenses, {});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('Expenses', null, {});
	}
};
