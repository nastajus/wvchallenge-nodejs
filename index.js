const express    = require('express');
const port       = process.env.PORT || 3005;
const ejs        = require('ejs');
const path       = require('path');
const mkdirp     = require('mkdirp');
const formidable = require('express-formidable');


// web app setup
const apiRoutes = require('./routes/api');
const app = express();
app.use(express.static(path.resolve('./styles')));


//ensures empty folder `upload` exists without fuss.
mkdirp(path.join(__dirname, 'uploads'));

// Set the default templating engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(formidable({uploadDir: path.join(__dirname, 'uploads')}));


app.use('/api', apiRoutes);


app.get('/', function (req, res) {
	res.render('index.ejs', {} );
});


app.listen(port, function () {
	console.log('listening on port ' + port);
});
