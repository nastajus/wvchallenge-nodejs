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

const DATABASE_NAME = 'nastajus_wvchallenge_db';
const DATABASE_DIALECT = 'mysql';


//database stuff

const Sequelize = require('sequelize');
const sequelize = new Sequelize(DATABASE_NAME, 'nastajus_wvchallenge_user', 'nastajus_wvchallenge_pass', {
	host: 'localhost',
	dialect: DATABASE_DIALECT,
	//logging: {new Loggable(msg)}      vs.     logging: myLogFunc      with        var myLogFunc = function(msg) {}
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
const app = express();

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


	expenseItemsFile.forEach(function(expenseFileEntry) {

		Expense
			.build({
				id: 1,//result.empId,
				date: expenseFileEntry['date'],
				category: expenseFileEntry['category'],
				expDescription: expenseFileEntry['expense description'],
				// preTaxAmount: expenseFileEntry['pre-tax amount'],
				taxName: expenseFileEntry['tax name'],
				// taxAmount: expenseFileEntry['tax amount'],
			}).save()
			.catch(error => {
				console.error(error);
				// if (error instanceof sequelize.ForeignKeyConstraintError) {
				// 	// handle foreign key constraint
				// } else {
				// 	// handle other error
				// }
			});

/*
		Employee
			.build({
				name: expenseFileEntry['employee name'],
				address: expenseFileEntry['employee address'] })
			.save()

			.then(result => {
			});
*/

	});

/*
	var a = ["a", "b", "c"];
	a.forEach(function(entry) {
		console.log(entry);
	});


	// you can also build, save and access the object with chaining:
	Employee
		.build({ name: expenseItemsFile['employee name'], address: expenseItemsFile['employee address'] })
		.save()
		.then(anotherTask => {
			// you can now access the currently saved task with the variable anotherTask... nice!
		})
		.catch(error => {
			// Ooops, do some error-handling
		})
*/
	res.send('test response');
});

app.listen(port, function () {
	console.log('listening on port ' + port);
});