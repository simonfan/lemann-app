angular.module('dashboard.services', [])
.service('Escolas', function ($http) {
	return {
		get: function () {


			return $http.get('http://hackday-lemann.herokuapp.com/schools/')
		}
	};
})
.service('WeeklyReport', function ($http) {
	
})