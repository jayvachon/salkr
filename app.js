'use strict';

var config = require('./config'),
	express = require('express'),
	http = require('http'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	morgan = require('morgan'),
	path = require('path');

// create express app
var app = module.exports = express();

// keep reference to config
app.config = config;

// setup web server
app.server = http.createServer(app);

// mongoose.connect('mongodb://localhost/27017');
app.db = mongoose.createConnection(config.mongodb.uri);
app.db.on('error', console.error.bind(console, 'mongoose connection error: '));
app.db.once('open', function () {
	console.log("open :)");
});

// configure data models
require('./models')(app, mongoose);

//middleware
app.use(require('morgan')('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride('X-HTTP-Method-Override'));

// require('./routes/index.js')(app);
require('./routes')(app);

//custom (friendly) error handler
app.use(require('./service/http').http500);

// setup utilities
app.utility = {};
app.utility.workflow = require('./util/workflow');

app.listen(8000, function () {
	console.log("App listening on port 8000");
});