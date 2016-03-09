'use strict';

var filterUser = function (user) {
	if (user) {
		return {

		};
	}
	return null;
};

var security = {

	login: function (req, res) {
		console.log("login");
	},

	sendCurrentUser: function (req, res, next) {
		res.status(200).json({user: filterUser(req.user)});
	},

	loginTwitter: function (req, res, next) {
		
		var workflow = req.app.utility.workflow(req, res);

		workflow.on('authUser', function () {
			req._passport.instance.authenticate('twitter', { callbackURL: req.app.config.oauth.twitter.callbackURL }, function(err, user, info) {
				
				if (err) {
					return workflow.emit('exception', err);
				}

				if (!info || !info.profile) {
					workflow.outcome.errors.push('twitter user not found');
					return workflow.emit('response');
				}
				
				workflow.profile = info.profile;
				console.log(workflow.profile);
				return workflow.emit('findUser');
			})(req, res, next);

		});

		workflow.on('findUser', function () {

			var option = {};
			option['twitter.id'] = workflow.profile.id;

			req.app.db.models.User.findOne(option, function (err, user) {

				if (err) {
					return workflow.emit('exception', err);
				}

				workflow.user = user;
				return workflow.emit('populateUser');
			});
		});

		/*workflow.on('populateUser', function () {
			var user = workflow.user;
			user.populate('roles.admin roles.account', function (err, user) {
				if (err) {
					return workflow.emit('exception', err);
				}
				workflow.user = user;
				return workflow.emit('logUserIn');
			})
		});

		workflow.on('logUserIn', function () {

			req.login(workflow.user, function (err) {
				if (err) {
					return workflow.emit('exception', err);
				}
				
			})
		});*/

		workflow.emit('authUser');
	}
};

module.exports = security;