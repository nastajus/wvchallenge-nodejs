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
	console.log(req.fields); // contains non-file fields
	console.log(req.files); // contains files

	let data = fs.readFileSync(req.files.expenseFile.path, { encoding : 'utf8'});
	let expenseItemsFile = csvjson.toObject(data, { delimiter: ',', quote: '"' });
	console.log(expenseItemsFile);

	res.send('test response');
});

app.listen(port, function () {
	console.log('listening on port ' + port);
});