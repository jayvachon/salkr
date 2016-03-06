'use strict';

exports = module.exports = function (app, mongoose) {

	var commentSchema = new mongoose.Schema({
		text: String,
		parent: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment'
		},
		children: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment'
		}],
		visitCount: Number,
		author: String,
		dateCreated: { type: Date, default: Date.now }
	});
	app.db.model('Comment', commentSchema);
};