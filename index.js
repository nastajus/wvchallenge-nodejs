const express = require('express');
const port = process.env.PORT || 3005;
const ejs = require('ejs');
const path = require('path');
const formidable = require ('express-formidable');
const mkdirp = require('mkdirp');
const fs = require('fs');
const csvjson = require('csvjson');
const Loggable = require('./Loggable');
//const models = require('./models')['sequelize'];
const models = require('./models');

const DATABASE_NAME = 'nastajus_wvchallenge_db';
const DATABASE_DIALECT = 'mysql';


//database stuff

const Sequelize = require('sequelize');
const sequelize = new Sequelize(DATABASE_NAME, 'nastajus_wvchallenge_user', 'nastajus_wvchallenge_pass', {
	host: 'localhost',
	dialect: DATABASE_DIALECT,
	//logging: {new Loggable(msg)}      vs.     logging: myLogFunc      with        var myLogFunc = function(msg) {}
	dialectOptions: {decimalNumbers: true},
});

sequelize.authenticate()
	.then(() => {
		console.log('Connection to '+ DATABASE_DIALECT +' database \'' + DATABASE_NAME + '\' has been established successfully.');
	}).catch(err => {
		console.error('Unable to connect to the ' + DATABASE_DIALECT + ' database \'' + DATABASE_NAME + '\': ', err);
	});

const Employee = sequelize.import(__dirname + "/models/employee");
const Expense = sequelize.import(__dirname + "/models/expense");


// web app setup
const apiController = require('./controllers/api');
const app = express();



app.use('/api', apiController);



//ensures empty folder `upload` exists without fuss.
mkdirp(path.join(__dirname, 'uploads'));

// Set the default templating engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(formidable({uploadDir: path.join(__dirname, 'uploads')}));

app.get('/', function (req, res) {
	res.render('index.ejs', {} );
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
		models.sequelize.transaction(function(t){
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