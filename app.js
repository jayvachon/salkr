'use strict';

var config = require('./config'),
	express = require('express'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	mongoStore = require('connect-mongo')(session),
	http = require('http'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	path = require('path'),
	passport = require('passport'),
	helmet = require('helmet'),
	csrf = require('csurf');
	path = require('path');

// create express app
var app = module.exports = express();

// keep reference to config
app.config = config;

// setup web server
app.server = http.createServer(app);

app.db = mongoose.createConnection(config.mongodb.uri);
app.db.on('error', console.error.bind(console, 'mongoose connection error: '));
app.db.once('open', function () {
	console.log("mongoose ready :)");
});

// configure data models
require('./models')(app, mongoose);

// settings
app.set('port', config.port);

//middleware
app.use(require('morgan')('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(cookieParser(config.cryptoKey));
app.use(session({
	resave: true,
	saveUnitialized: true,
	secret: config.cryptoKey,
	store: new mongoStore({ url: config.mongodb.uri })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(csrf({ cookie: { signed: true } }));
helmet(app);

// response locals
app.use(function (req, res, next) {
	res.cookie('_csrfToken', req.csrfToken());
	res.locals.user = {};
	// res.locals.user.defaultReturnUrl = req.user && req.user.defaultReturnUrl();
	// res.locals.user.username = req.user && req.user.username;
	next();
});

// setup passport
require('./passport')(app, passport);

// setup routes
require('./routes')(app, passport);

// custom (friendly) error handler
app.use(require('./service/http').http500);

//custom (friendly) error handler
app.use(require('./service/http').http500);

// setup utilities
app.utility = {};
app.utility.workflow = require('./util/workflow');

app.listen(app.config.port, function () {
	console.log("App listening on port 8000");
});