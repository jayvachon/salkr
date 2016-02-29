'use strict'

var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
	text: String,
	parent: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'CommentSchema'
	},
	children: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'CommentSchema'
	}]
});

module.exports = mongoose.model('Comment', CommentSchema);
