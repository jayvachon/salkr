'use strict';

exports = module.exports = function (app, mongoose) {

	require('./models/Comment')(app, mongoose);
};