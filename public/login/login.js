(function() {

	'use strict';

	angular.module('login.index', []);
	angular.module('login.index').config(['$routeProvider', function($routeProvider) {
		$routeProvider
			.when('/login', {
				templateUrl: '/views/login.html'
			});
	}]);

})();