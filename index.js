const express = require('express');
const port = process.env.PORT || 3005;
const ejs = require('ejs');
const path = require('path');
const formidable = require ('express-formidable');
const mkdirp = require('mkdirp');
const fs = require('fs');
const csvjson = require('csvjson');

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

	let logger = {
		event: "file upload",
		date: new Date(Date.now()).toLocaleString(),
		size: req.files.expenseFile.size,
		type: req.files.expenseFile.type,
		name: req.files.expenseFile.name
	}
	console.log(JSON.stringify(logger).replace(/\"([^(\")"]+)\":/g,"$1:"));   //This will remove all the quotes around properties.


	res.send('test response');
});

app.listen(port, function () {
	console.log('listening on port ' + port);
});