(function() {

	'use strict';

	var app = angular.module('salkr', ['ngRoute'])
		.config(['$routeProvider', function ($routeProvider) {
			$routeProvider
				.when('/', {
					templateUrl: '/views/main.html',
					controller: 'InitialController'
				})
				.when('/comment/:commentId', {
					templateUrl: '/views/main.html',
					controller: 'MainController'
				})
				.when('/404', {
					templateUrl: '/views/404.html'
				})
				.otherwise({ redirectTo: '/' });
		}]);

	app.factory('commentNode', function () {
		var commentNode = {};
		return commentNode;
	});

	app.controller('InitialController', ['$scope', '$http', 'commentNode', function($scope, $http, commentNode) {
		$http.get('/api/initialComment')
			.success(function(data) {
				$scope.comment = data;
				commentNode.comment = data;
			})
			.error(function(err) {
				console.log("error: " + err);
			});
	}]);

	app.controller('MainController', ['$scope', '$http', '$routeParams', 'commentNode', function($scope, $http, $routeParams, commentNode) {
		$http.get('/api/comment/' + $routeParams.commentId)
			.success(function(data) {
				$scope.comment = data;
				commentNode.comment = data;
			})
			.error(function(err) {
				console.log("error: " + err);
			});
	}]);

	app.directive('commentForm', ['$http', 'commentNode', function($http, commentNode) {
		return {
			restrict: 'E',
			templateUrl: 'comment-form.html',
			scope: { index: '=' },
			controller: function($scope, commentNode) {

				this.addChild = function() {

					var commentForm = this;
					commentForm.child.parent = commentNode.comment._id;
					// TODO: update parent with child object and index 
					// console.log($scope.index);
					
					/*console.log("child:");
					console.log(commentForm.child);
					console.log("parent:");
					console.log(commentNode.comment);*/

					$http.post('/api/comment', commentForm.child)
						.success(function (data) {
							commentForm.child = {};
						})
						.error(function (err) {
							console.log("error: " + err);
						});
				};
			},
			controllerAs: 'commentCtrl'
		};
	}]);
})();