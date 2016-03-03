'use strict';

var Comment = require('../models');
var initial = "is this really all there is?";

function getInitialComment (res) {
	Comment.findOne({
		'parent': null
	}, function(err, comment) {
		if (err) res.send(err);
		if (comment === null) {
			Comment.create({
				text: initial,
				parent: null,
				children: [null, null]
			}, function (err, comment) {
				if (err) res.send(err);

				console.log("create initial: " + comment._id);
				res.json(comment);
			});
		} else {
			loadChildren (comment, res);
		}
	});
}

function getCommentById (id, res) {

	findComment (id, function (comment) {
		loadChildren (comment, res);
	});
}

function loadChildren (comment, res) {

	var children = comment.children;
	
	if (children[0] !== null) {
		findComment (children[0], function (child1) {
			children[0] = child1;
			if (children[1] !== null) {
				findComment (children[1], function (child2) {
					children[1] = child2;
					res.json(comment);
				});
			} else {
				res.json(comment);
			}
		});
	} else if (children[1] !== null) {
		findComment (children[1], function (child) {
			children[1] = child;
			res.json(comment);
		});
	} else {
		res.json(comment);
	}
}

function findComment (id, callback) {
	Comment.findById (id, function (err, comment) {
		if (err) throw err;
		callback (comment);
	});
}

module.exports = function(app) {

	// 56d344a44b750d0f6398e58d
	app.get('/api/initialComment', function (req, res) {
		getInitialComment(res);
	});

	app.get('/api/comment/:commentId', function (req, res) {
		getCommentById (req.params.commentId, res);
	});

	app.post('/api/child', function (req, res) {

		// Find the parent comment
		Comment.findById(req.body.parent, function(err, comment) {

			if (err) throw err;

			// Create the child comment
			Comment.create({
				text: req.body.text,
				parent: comment,
				children: [null, null]
			}, function (err, child) {

				if (err) throw err;

				// Add the new comment as a child of the parent comment
				comment.set('children.' + req.body.index, child)
				comment.save(function (err) {
					if (err) throw err;

					console.log("child posted :)");
					loadChildren (comment, res);
				});
			});
		});
	});

	app.post('/api/reset', function (req, res) {
		Comment.remove({}, function (err) {
			if (err) throw err;
			console.log("comments deleted :)");
			getInitialComment(res);
		});
	});

	app.use('/*', function(req, res){
	  res.sendfile(path.join(__dirname, 'public/index.html'));
	});
};