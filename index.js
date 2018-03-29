const express = require('express');
const port = process.env.PORT || 3005;
const ejs = require('ejs');
const path = require('path');

const app = express();

// Set the default templating engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', function (req, res) {
	res.render('index.ejs', {} );
});

app.post('/test', function (req, res) {
	res.send('test response');
});

app.listen(port, function () {
	console.log('listening on port ' + port);
});