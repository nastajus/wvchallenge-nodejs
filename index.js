const express = require('express');
const port = process.env.PORT || 3005;
const ejs = require('ejs');
const path = require('path');
const formidable = require ('express-formidable');
const mkdirp = require('mkdirp');
const fs = require('fs');
const csvjson = require('csvjson');
const Loggable = require('./Loggable');
const db = require('./models/index');

const Employee = db.sequelize.models.Employee;
const Expense = db.sequelize.models.Expense;


// web app setup
const apiRoutes = require('./routes/api');
const app = express();
//app.use(express.static(__dirname + '/public'));
app.use("/styles",express.static(__dirname + "/styles"));


app.use('/api', apiRoutes);


//ensures empty folder `upload` exists without fuss.
mkdirp(path.join(__dirname, 'uploads'));

// Set the default templating engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(formidable({uploadDir: path.join(__dirname, 'uploads')}));

app.get('/', function (req, res) {
	res.render('index.ejs', {} );
});

app.get('/employees/', function (req, res) {

	db.sequelize.models.Employee.findAll({
		attributes: ['name', 'address', 'empId']
	}).then(function(employees) {
		res.render('employees.ejs', { employees: employees })
	}).catch(function(err) {
        console.error(err);
	});

});


app.get('/employees/:id/expenses', function (req, res) {

	Expense.findAll({
		where: {empId: req.params.id},
		attributes: [ 'expId', 'empId', 'category', 'expDescription', 'preTaxAmount', 'taxName', 'taxAmount',
            [db.sequelize.fn('date_format', db.sequelize.col('date'), '%Y-%m-%d'), 'date']]
	}).then(function(expenses) {
		expenses.forEach( expense => {
			expense.preTaxAmount = expense.preTaxAmount.toLocaleString('en-US', { minimumFractionDigits: 2 });
			expense.taxAmount = expense.taxAmount.toLocaleString('en-US', { minimumFractionDigits: 2 });
		});
		res.render('employeeExpenses.ejs', { expenses: expenses})
	}).catch(function(err) {
        console.error(err);
	});

});



app.get('/expenses/category/:category', function(req, res) {
	Expense.findAll({
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



app.get('/expenses/description/:expDescription', function(req, res) {
	Expense.findAll({
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



app.get('/expenses', function(req, res) {
	Expense.findAll({
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



app.get('/expenses/dates', function(req, res) {

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



app.get('/expenses/dates/:year/:month', function(req, res) {

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




app.post('/test', function (req, res) {

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
			return Employee.findOrCreate({
				where: {
					name: expenseFileEntry['employee name'],
					address: expenseFileEntry['employee address']
				},
				transaction: t
			})
			// necessary to use spread to find out if user was found or created
				.spread(function(employeeResult, created){

					Expense
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
						}).catch(error => console.error(error))

				}); // end spread
		}) // end transaction
	});

	res.send('test response');
});


app.listen(port, function () {
	console.log('listening on port ' + port);
});
