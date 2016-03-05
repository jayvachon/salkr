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
				children: [null, null],
				visitCount: 0,
				author: ""
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
		comment.visitCount += 1;
		console.log(comment.visitCount);
		comment.save (function (err) {
			if (err) throw err;
			loadPeripheral (comment, res);
		});
		// loadPeripheral (comment, res);
	});
}

function applyParent (comment, callback) {

	if (comment.parent === null) {
		callback (comment);
	} else {

		var c = {};
		c._id = comment._id;
		c.text = comment.text;
		c.parent = comment.parent;
		c.children = comment.children;
		c.visitCount = comment.visitCount;
		c.author = comment.author;

		findComment (comment.parent, function (parentData) {
			c.parent = parentData;
			callback (c);
		});
	}
}

function applyChildren (comment, callback) {

	var c = {};
	c._id = comment._id;
	c.text = comment.text;
	c.parent = comment.parent;
	c.children = comment.children;
	c.visitCount = comment.visitCount;
	c.author = comment.author;

	if (comment.children[0] !== null) {
		findComment (comment.children[0], function (child1) {
			c.children[0] = child1;
			if (comment.children[1] !== null) {
				findComment (comment.children[1], function (child2) {
					c.children[1] = child2;
					callback (c);
				});
			} else {
				callback (c);
			}
		});
	} else if (comment.children[1] !== null) {
		findComment (comment.children[1], function (child) {
			c.children[1] = child;
			callback (c);
		});
	} else {
		callback (c);
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
				children: [null, null],
				visitCount: 0,
				author: ""
			}, function (err, child) {

				if (err) throw err;

				// Add the new comment as a child of the parent comment
				console.log('children.' + req.body.index);
				comment.set('children.' + req.body.index, child)
				comment.save(function (err) {
					if (err) throw err;

					console.log("child posted :)");
					console.log(comment);
					loadChildren (comment, res);
				});
			});
		});
	});

	app.get('/api/reset', function (req, res) {
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