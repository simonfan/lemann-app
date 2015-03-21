angular.module('app.services', [])
.service('_', function ($window) {
	
	return $window._;	
})
.service('d3', function ($window) {
	return $window.d3;
})