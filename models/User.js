'use strict';

exports = module.exports = function (app, mongoose) {
	var userSchema = new mongoose.Schema({
		username: { type: String, unique: true },
		password: String,
		email: { type: String, unique: true },
		createdAt: { type: Date, default: Date.now },
		twitter: {}
	});
	app.db.model('User', userSchema);
};