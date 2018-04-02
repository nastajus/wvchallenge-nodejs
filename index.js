const express = require('express');
const port = process.env.PORT || 3005;
const ejs = require('ejs');
const path = require('path');
const formidable = require ('express-formidable');
const mkdirp = require('mkdirp');
const fs = require('fs');
const csvjson = require('csvjson');
const Loggable = require('./Loggable');

const DATABASE_NAME = 'nastajus_wvchallenge_db';
const DATABASE_DIALECT = 'mysql';


//database stuff

const Sequelize = require('sequelize');
const sequelize = new Sequelize(DATABASE_NAME, 'nastajus_wvchallenge_user', 'nastajus_wvchallenge_pass', {
	host: 'localhost',
	dialect: DATABASE_DIALECT
});

sequelize.authenticate()
	.then(() => {
		console.log('Connection to '+ DATABASE_DIALECT +' database \'' + DATABASE_NAME + '\' has been established successfully.');
	}).catch(err => {
		console.error('Unable to connect to the ' + DATABASE_DIALECT + ' database \'' + DATABASE_NAME + '\': ', err);
	});



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

	let log = new Loggable( {
		event: "file upload",
		size: req.files.expenseFile.size,
		type: req.files.expenseFile.type,
		originalName: req.files.expenseFile.name,
		uploadedName: req.files.expenseFile.path.split(path.sep).pop()
	});

	log.print();

	res.send('test response');
});

app.listen(port, function () {
	console.log('listening on port ' + port);
});