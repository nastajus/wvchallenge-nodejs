const express = require('express');
const port = process.env.PORT || 3005;
const ejs = require('ejs');
const path = require('path');
const formidable = require ('express-formidable');
const mkdirp = require('mkdirp');
const fs = require('fs');
const csvjson = require('csvjson');

const Loggable = require('./Loggable');
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