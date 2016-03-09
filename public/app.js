(function() {

	'use strict';

	var app = angular.module('salkr', [
		'ngRoute',
		'security',
		'config',
		'login.index',
		'login.social.twitter'
	]);
		
	app.config(['$httpProvider', 'XSRF_COOKIE_NAME', function($httpProvider, XSRF_COOKIE_NAME){
		$httpProvider.defaults.xsrfCookieName = XSRF_COOKIE_NAME;
	}]);

	app.config(['$routeProvider', '$httpProvider', '$locationProvider', function ($routeProvider, $httpProvider, $locationProvider) {
		$routeProvider
			.when('/', {
				templateUrl: '/views/main.html',
				controller: 'InitialController',
				controllerAs: 'initialCtrl'
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

	app.run(['$location', '$rootScope', 'security', function($location, $rootScope, security) {

		// Get the current user when the application starts
		// (in case they are still logged in from a previous session)
		security.requestCurrentUser();

		// add a listener to $routeChangeSuccess
		$rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
		  $rootScope.title = current.$$route && current.$$route.title? current.$$route.title: 'App running';
		});
	}]);

	app.factory('commentNode', function () {
		var commentNode = {};
		return commentNode;
	});

	app.controller('InitialController', ['$scope', '$http', 'commentNode', function($scope, $http, commentNode) {
		$http.get('/api/initial-comment')
			.success(function(data) {
				$scope.comment = data.comment;
				commentNode.comment = data.comment;
			})
			.error(function(err) {
				console.log("error: " + err);
			});
	}]);

	app.controller('MainController', ['$scope', '$http', '$routeParams', 'commentNode', function($scope, $http, $routeParams, commentNode) {
		$http.get('/api/comment/' + $routeParams.commentId)
			.success(function(data) {
				$scope.comment = data.comment;
				commentNode.comment = data.comment;
			})
			.error(function(err) {
				console.log("error: " + err);
			});
	}]);

	app.directive('commentForm', ['$http', 'commentNode', function($http, commentNode) {
		return {
			restrict: 'E',
			templateUrl: 'comment-form.html',
			scope: { 
				index: '=',
				comment: '='
			},
			controller: function($scope, commentNode) {

				this.addChild = function() {

					var commentForm = this;
					commentForm.child.parent = commentNode.comment._id;
					commentForm.child.index = $scope.index;

					$http.post('/api/child', commentForm.child)
						.success(function (data) {
							commentForm.child = {};
							commentNode.comment.children[$scope.index] = data.children[$scope.index];
						})
						.error(function (err) {
							console.log("error: " + err);
						});
				};
			},
			controllerAs: 'commentCtrl'
		};
	}]);

	app.directive ('byline', function () {
		return {
			restrict: 'E',
			templateUrl: 'byline.html',
			scope: { authorName: '@' }
		}
	});
})();