(function() {
	angular.module('login.social.twitter', ['security.service']);
	angular.module('login.social.twitter').config(['$routeProvider', function($routeProvider) {
		/*$routeProvider
			.when('/login/twitter/callback', {
				resolve: {
					verify: ['$log', '$q', '$location', '$route', 'security', function ($log, $q, $location, $route, security) {
						var redirectUrl;
						var code = $route.current.params.code || '';
						var promise = security.socialLogin('twitter')
					}]
				}
			})
		;*/
	}]);
})();