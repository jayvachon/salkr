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
		loadPeripheral (comment, res);
	});
}

function applyParent (comment, callback) {

	// var parent = comment.parent;

	if (comment.parent === null) {
		callback (comment);
	} else {

		var c = {};
		c.text = comment.text;
		c.parent = comment.parent;
		c.children = comment.children;

		findComment (comment.parent, function (parentData) {
			c.parent = parentData;
			callback (c);
		});
	}
}

function applyChildren (comment, callback) {

	var children = comment.children;
	
	if (children[0] !== null) {
		findComment (children[0], function (child1) {
			children[0] = child1;
			if (children[1] !== null) {
				findComment (children[1], function (child2) {
					children[1] = child2;
					callback (comment);
				});
			} else {
				callback (comment);
			}
		});
	} else if (children[1] !== null) {
		findComment (children[1], function (child) {
			children[1] = child;
			callback (comment);
		});
	} else {
		callback (comment);
	}
}

function loadChildren (comment, res) {
	applyChildren (comment, function(children) {
		res.json(children);
	});
}

function loadPeripheral (comment, res) {
	applyParent (comment, function (newComment) {
		applyChildren (newComment, function (newComment2) {
			res.json (newComment2);
		});
	});
}

function findComment (id, callback) {
	Comment.findById (id, function (err, comment) {
		if (err) throw err;
		callback (comment);
	});
}

module.exports = function(app) {

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
		console.log("remove");
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