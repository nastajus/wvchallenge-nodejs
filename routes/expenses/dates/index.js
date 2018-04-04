const express = require('express');
const db      = require('../../../models');

const router = express.Router();



router.get('/', function(req, res) {

	db.sequelize.query(
		"SELECT *, DATE_FORMAT(expenses.date, '%Y-%m') as niceDate, " +
		"DATE_FORMAT(expenses.date, '%Y') as year, " +
		"DATE_FORMAT(expenses.date, '%m') as month, " +
		"FORMAT(SUM(expenses.preTaxAmount + expenses.taxAmount), 2) as sumAmount," +
		"COUNT(expenses.expId) as countExpense FROM `expenses`" +
		"GROUP BY niceDate",
		{ type: db.sequelize.QueryTypes.SELECT})
		.then(function(expenses) {
			res.render('expensesDates.ejs', { expenses: expenses})
		}).catch(function(err) {
		console.error(err);
	});
});



router.get('/:year/:month', function(req, res) {

	db.sequelize.query(
		"SELECT *, DATE_FORMAT(expenses.date, '%Y-%m') as niceDate, " +
		"DATE_FORMAT(expenses.date, '%Y') as year, " +
		"DATE_FORMAT(expenses.date, '%m') as month, " +
		"FORMAT(SUM(expenses.preTaxAmount + expenses.taxAmount), 2) as sumAmount, " +
		"COUNT(expenses.expId) as countExpense FROM `expenses` " +
		"GROUP BY niceDate " +
		"HAVING year = " + req.params.year + " " +
		"AND month = " + req.params.month,
		{ type: db.sequelize.QueryTypes.SELECT})
		.then(function(expenses) {
			res.render('expensesDates.ejs', { expenses: expenses})
		}).catch(function(err) {
		// your error handling code here
		console.error(err);
	});
});

module.exports = router;