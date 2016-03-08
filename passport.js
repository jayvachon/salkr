'use strict';

exports = module.exports = function (app, passport) {
	
	var TwitterStrategy = require('passport-twitter').Strategy;

	passport.use(new TwitterStrategy ({
		consumerKey: app.config.oauth.twitter.key,
		consumerSecret: app.config.oauth.twitter.secret,
		callbackURL: app.config.oauth.twitter.callbackURL
	}, function (token, tokenSecret, profile, callback) {
		console.log(profile);
		callback(null, false, {
			token: token,
			tokenSecret: tokenSecret,
			profile: profile
		});
		// app.db.User.findOrCreate({})
	}));

	passport.serializeUser(function (user, cb) {
		// cb(null, user._id);
		cb(null, user);
	});

	passport.deserializeUser(function (obj, cb) {
		// app.db.models.User.findOne({ _id: id }).populate('')
		// done();
		cb(null, obj)
	});
};