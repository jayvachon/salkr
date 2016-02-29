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

	app.controller('InitialController', ['$scope', '$http', function($scope, $http) {
		$http.get('/api/initialComment')
			.success(function(data) {
				$scope.comment = data;
			})
			.error(function(err) {
				console.log("error: " + err);
			});
	}]);

	app.controller('MainController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
		$http.get('/api/comment/' + $routeParams.commentId)
			.success(function(data) {
				$scope.comment = data;
			})
			.error(function(err) {
				console.log("error: " + err);
			});
	}]);

	app.directive('commentForm', function() {
		return {
			restrict: 'E',
			templateUrl: 'comment-form.html',
			scope: { index: '=' },
			controller: function($scope) {

				this.comment = {};

				this.addComment = function() {
					console.log($scope.index);
					console.log(this.comment.text);
					this.comment = {};
				};
			},
			controllerAs: 'commentCtrl'
		};
	});

	var comment = {
		text: 'belekm',
		children: [
			{ text: 'test' }
		],
		hasChild1: function() { return this.children[0] !== undefined; }
	}

})();