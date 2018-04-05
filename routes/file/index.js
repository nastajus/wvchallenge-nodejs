const express  = require('express');
const db       = require('../../models');
const fs       = require('fs');
const csvjson  = require('csvjson');
const Loggable = require('../../Loggable');
const path     = require('path');

const router = express.Router();


router.post('/', function (req, res) {

	let data = fs.readFileSync(req.files.expenseFile.path, { encoding : 'utf8'});
	let expenseItemsFile = csvjson.toObject(data, { delimiter: ',', quote: '"' });

	let fileUploadLog = new Loggable( {
		event: "file upload",
		size: req.files.expenseFile.size,
		type: req.files.expenseFile.type,
		originalName: req.files.expenseFile.name,
		uploadedName: req.files.expenseFile.path.split(path.sep).pop()
	});

	fileUploadLog.print();

	// TODO: ERROR INTRODUCED, root cause believed due to nesting async promise calls inside forEach.  This has led to the occasional async error being thrown: `Unhandled rejection SequelizeUniqueConstraintError: Validation error` when uploading the CSV file (about 1 out of 20 on my system).
	expenseItemsFile.forEach(function(expenseFileEntry) {

		// remember to use transaction as you are not sure
		// whether user is already present in DB or not (and you might end up creating the user - a write operation on DB)
		db.sequelize.transaction(function(t){
			return db.sequelize.models.Employee.findOrCreate({
				where: {
					name: expenseFileEntry['employee name'],
					address: expenseFileEntry['employee address']
				},
				transaction: t
			}).catch(function(err) {
				console.error(err);
			})
			// necessary to use spread to find out if user was found or created
				.spread(function(employeeResult, created){

					db.sequelize.models.Expense
						.create({
							//TODO: doesn't catch invalid column names, find way to enable. I shouldn't be able to submit `id` without warning or error message, but can submit anything and it ignores it.
							//TODO: testing indicates database itself just drops or rounds the last digit when say 0.123 is used. I'd prefer a warning or error message at run-time within JavaScript, and the ability to explicitly set the currency to (13,2) within JavaScript
							empId: employeeResult.empId,
							date: expenseFileEntry['date'],
							category: expenseFileEntry['category'],
							expDescription: expenseFileEntry['expense description'],
							preTaxAmount: expenseFileEntry['pre-tax amount'].replace(',', ''),
							taxName: expenseFileEntry['tax name'],
							taxAmount: expenseFileEntry['tax amount'].replace(',', ''),
						}).catch(function(err) {
							console.error(err);
						});

				}); // end spread
		}) // end transaction
	});

	//res.send('test response');
	res.redirect('/api/employees');
});

module.exports = router;