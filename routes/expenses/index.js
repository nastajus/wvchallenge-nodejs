const express = require('express');
const db      = require('../../models');

const router = express.Router();

router.get('/', (req, res) => {

	db.sequelize.models.Expense.findAll({
		attributes: [ 'expId', 'empId', 'category', 'expDescription', 'preTaxAmount', 'taxName', 'taxAmount',
			[db.sequelize.fn('date_format', db.sequelize.col('date'), '%Y-%m-%d'), 'date']]
	}).then(function(expenses) {
		expenses.forEach( expense => {
			expense.preTaxAmount = expense.preTaxAmount.toLocaleString('en-US', { minimumFractionDigits: 2 });
			expense.taxAmount = expense.taxAmount.toLocaleString('en-US', { minimumFractionDigits: 2 });
		});
		res.render('expenses.ejs', { expenses: expenses})
	}).catch(function(err) {
		console.error(err);
	});

});




router.get('/category/:category', function(req, res) {
	db.sequelize.models.Expense.findAll({
		where: {category: decodeURIComponent(req.params.category)},
		attributes: [ 'expId', 'empId', 'category', 'expDescription', 'preTaxAmount', 'taxName', 'taxAmount',
			[db.sequelize.fn('date_format', db.sequelize.col('date'), '%Y-%m-%d'), 'date']]
	}).then(function(expenses) {
		expenses.forEach( expense => {
			expense.preTaxAmount = expense.preTaxAmount.toLocaleString('en-US', { minimumFractionDigits: 2 });
			expense.taxAmount = expense.taxAmount.toLocaleString('en-US', { minimumFractionDigits: 2 });
		});
		res.render('expenses.ejs', { expenses: expenses})
	}).catch(function(err) {
		console.error(err);
	});
});



router.get('/description/:expDescription', function(req, res) {
	db.sequelize.models.Expense.findAll({
		where: {expDescription: decodeURIComponent(req.params.expDescription)},
		attributes: [ 'expId', 'empId', 'category', 'expDescription', 'preTaxAmount', 'taxName', 'taxAmount',
			[db.sequelize.fn('date_format', db.sequelize.col('date'), '%Y-%m-%d'), 'date']]
	}).then(function(expenses) {
		expenses.forEach( expense => {
			expense.preTaxAmount = expense.preTaxAmount.toLocaleString('en-US', { minimumFractionDigits: 2 });
			expense.taxAmount = expense.taxAmount.toLocaleString('en-US', { minimumFractionDigits: 2 });
		});
		res.render('expenses.ejs', { expenses: expenses})
	}).catch(function(err) {
		console.error(err);
	});
});




router.use('/dates', require('./dates'));



module.exports = router;