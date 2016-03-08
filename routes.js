'use strict';

var comment = require('./service/comment');
var security = require('./service/security');

function useAngular (req, res, next) {
	res.sendFile(require('path').join(__dirname, './public/index.html'));
};

exports = module.exports = function (app, passport) {

	// API
	app.get('/api/initialComment', comment.getInitial);
	app.get('/api/comment/:commentId', comment.getComment);
	app.post('/api/child', comment.postChild);
	app.get('/api/login/twitter', security.loginTwitter);
	app.get('/api/login/twitter/callback', useAngular)
	// app.delete('/api/deleteComments', comment.deleteAll);
	app.get('/api/deleteComments', comment.deleteAll);

	// Angular routes
	app.get('/', useAngular);
	app.get('/login/twitter', passport.authenticate('twitter', { callbackURL: app.config.oauth.twitter.callbackURL, scope: ['email'] }));
	app.get('/login/twitter/callback', useAngular);

	app.all(/^(?!\/api).*$/, useAngular);
};