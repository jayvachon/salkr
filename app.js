'use strict';

var express = require('express');

var app = module.exports = express();
var server = require('http').Server(app);

var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var morgan = require('morgan');
var path = require('path');

mongoose.connect('mongodb://localhost/27017');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride('X-HTTP-Method-Override'));

require('./routes/index.js')(app);

app.listen(8000, function () {
	console.log("App listening on port 8000");
});