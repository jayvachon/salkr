'use strict';

var comment = require('./service/comment');

function useAngular (req, res, next) {
	res.sendFile(require('path').join(__dirname, './public/index.html'));
};

exports = module.exports = function (app, passport) {
	app.get('/api/initialComment', comment.getInitial);
	app.get('/api/comment/:commentId', comment.getComment);
	app.post('/api/child', comment.postChild);
	// app.delete('/api/deleteComments', comment.deleteAll);
	app.get('/api/deleteComments', comment.deleteAll);
	app.all(/^(?!\/api).*$/, useAngular);
};