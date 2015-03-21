angular.module('dashboard.services', [])
.service('Escolas', function ($http) {
	return {
		get: function () {


			return $http.get('/fake-api/escolas.json')
		}
	};
});