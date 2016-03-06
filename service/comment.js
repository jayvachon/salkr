'use strict';

var async = require('async');
var initialText = "is this really all there is?";

var comment = {

	getInitial: function (req, res, next) {

		var outcome = {};

		var getCommentData = function (callback) {
			req.app.db.models.Comment.findOne({ 'parent': null }).exec(function(err, comment) {
				if (err) {
					return callback(err, null);
				}

				outcome.comment = comment;
				callback(null, 'done');
			});
		}

		var createInitial = function (data, callback) {
			if (outcome.comment === null) {
				req.app.db.models.Comment.create({
					text: initialText,
					parent: null,
					children: [null, null],
					visitCount: 0,
					author: "appleslerp"
				}, function(err, comment) {
					if (err) {
						return callback(err, null);
					}

					outcome.comment = comment;
					callback(null, 'done');
				});
			} else {
				callback(null, 'done');
			}
		}

		var loadChildren = function (data, callback) {
			outcome.comment.populate('children', function (err, comment) {
				if (err) {
					return callback(err, null);
				}
				callback(null, 'done'); 
			}); 
		}

		var asyncFinally = function (err, result) {
			if (err) {
				return next(err);
			}
			res.status(200).json(outcome);
		}
		
		async.waterfall([getCommentData, createInitial, loadChildren], asyncFinally);
	},

	postChild: function (req, res, next) {

		var parentComment = {};
		var childComment = {};

		var findParent = function (callback) {
			req.app.db.models.Comment.findById(req.body.parent, function (err, comment) {
				if (err) {
					return callback(err, null);
				}
				parentComment = comment;
				callback(null, 'done');
			});
		}

		var createChild = function (data, callback) {
			req.app.db.models.Comment.create({
				text: req.body.text,
				parent: parentComment,
				children: [null, null],
				visitCount: 0,
				author: req.body.author
			}, function (err, child) {
				if (err) {
					return callback(err, null);
				}
				childComment = child;
				callback(null, 'done');
			})
		}

		var applyChildToParent = function (date, callback) {
			parentComment.set('children.' + req.body.index, childComment);
			parentComment.save(function (err) {
				if (err) {
					return callback(err, null);
				}
				parentComment.populate('children', function (err, comment) {
					if (err) {
						return callback(err, null);
					}
					callback(null, 'done');
				});
			});
		}

		var asyncFinally = function (err, result) {
			if (err) {
				return next(err);
			}
			res.status(200).json(parentComment);
		}

		async.waterfall([findParent, createChild, applyChildToParent], asyncFinally);
	},

	getComment: function (req, res, next) {

		var outcome = {};

		var findComment = function (callback) {
			req.app.db.models.Comment.findById (req.params.commentId, function (err, comment) {
				if (err) {
					return callback(err, null);
				}
				outcome.comment = comment;
				callback(null, 'done');
			});
		}

		var applyPeripherals = function (data, callback) {
			outcome.comment.populate('parent children', function (err, comment) {
				if (err) {
					return callback(err, null);
				}
				callback(null, 'done');
			});
		}

		var asyncFinally = function (err, result) {
			if (err) {
				return next(err);
			}
			res.status(200).json(outcome);
		}

		async.waterfall([findComment, applyPeripherals], asyncFinally);
	},

	deleteAll: function (req, res, next) {
		req.app.db.models.Comment.remove({}, function (err) {
			if (err) {
				return next(err);
			}
			res.status(200).json({ result: "comments deleted" });
		});
	}
};

module.exports = comment;