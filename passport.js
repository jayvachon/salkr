'use strict';

exports = module.exports = function (app, passport) {
	
	var TwitterStrategy = require('passport-twitter').Strategy;

	passport.use(new TwitterStrategy ({
		consumerKey: app.config.oauth.twitter.key,
		consumerSecret: app.config.oauth.twitter.secret
	}, function (token, tokenSecret, profile, done) {
		done(null, false, {
			token: token,
			tokenSecret: tokenSecret,
			profile: profile
		});
	}));

	passport.serializeUser(function (user, done) {
		done(null, user._id);
	});

	passport.deserializeUser(function (id, done) {
		// app.db.models.User.findOne({ _id: id }).populate('')
		done();
	});
};