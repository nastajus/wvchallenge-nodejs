const express = require('express');
const db      = require('../../models');

const router = express.Router();

router.get('/', (req, res) => {

	db.sequelize.models.Employee.findAll({
		attributes: ['name', 'address', 'empId']
	}).then(function(employees) {
		res.render('employees.ejs', { employees: employees })
	}).catch(function(err) {
		console.error(err);
	});

});

router.get('/:id/expenses', (req, res) => {

	db.sequelize.models.Expense.findAll({
		where: {empId: req.params.id},
		attributes: ['expId', 'empId', 'category', 'expDescription', 'preTaxAmount', 'taxName', 'taxAmount',
			[db.sequelize.fn('date_format', db.sequelize.col('date'), '%Y-%m-%d'), 'date']]
	}).then(function (expenses) {
		expenses.forEach(expense => {
			expense.preTaxAmount = expense.preTaxAmount.toLocaleString('en-US', {minimumFractionDigits: 2});
			expense.taxAmount = expense.taxAmount.toLocaleString('en-US', {minimumFractionDigits: 2});
		});
		res.render('employeesExpenses.ejs', {expenses: expenses})
	}).catch(function (err) {
		console.error(err);
	});

});

module.exports = router;