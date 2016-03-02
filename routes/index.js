'use strict';

var Comment = require('../models');
var initial = "is this really all there is?";

module.exports = function(app) {

	// 56d344a44b750d0f6398e58d
	app.get('/api/initialComment', function (req, res) {
		Comment.findOne({
			'parent': null
		}, function(err, comment) {
			if (err) res.send(err);
			if (comment === null) {
				console.log("create initial");
				Comment.create({
					text: initial,
					parent: null
				}), function (err, comment) {
					if (err) res.send(err);
					res.json(comment);
				}
			} else {
				res.json(comment);
			}
		});
	});

	app.get('/api/comment/:commentId', function (req, res) {
		Comment.findOne({
			'_id': req.params.commentId
		}, function (err, comment) {
			if (err) res.send(err);
			res.json(comment);
		});
	});

	app.post('/api/comment', function (req, res) {
		console.log(req.body);
		Comment.findOne({
			'_id': req.body.commentId
		}, function (err, comment) {
			if (err) res.send(err);
			console.log(comment);
			res.json(comment);
		});
	});

	app.use('/*', function(req, res){
	  res.sendfile(path.join(__dirname, 'public/index.html'));
	});
};