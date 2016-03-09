(function() {

	'use strict';

	angular.module('security.service', [])

	.factory('security', ['$http', '$q', function($http, $q) {

		var deferredCurrentUser;

		var service = {

			requestCurrentUser: function () {
				if (service.isAuthenticated()) {
					// currentUser is available
					return $q.when(service.currentUser);
				} else if (deferredCurrentUser) {
					// a backend request is currently underway for currentUser
					return deferredCurrentUser.promise
				} else {
					deferredCurrentUser = $q.defer();
					$http.get('/api/current-user').then(function(response) {
						service.currentUser = response.data.user;
						deferredCurrentUser.resolve(service.currentUser);
						deferredCurrentUser = null;
					}, function(x) {
						deferredCurrentUser.reject(x);
						deferredCurrentUser = null;
					});
					return deferredCurrentUser.promise;
				}
			},

			setCurrentUser: function (err) {
				service.currentUser = user;
			},

			currentUser: null,

			isAuthenticated: function () {
				return !!service.currentUser;
			}
		};

		return service;
	}])
})();