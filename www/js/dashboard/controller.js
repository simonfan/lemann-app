angular.module('dashboard.controller', ['dashboard.services', 'app.services'])
.controller('DashboardCtrl', function ($scope, $stateParams, Escolas, _) {


	// define control objetc
	$scope.control = {};

	// control description

	Escolas.get()
		.then(function (res) {

			// set array of available schools
			$scope.escolas = res.data;

			// set control value for escolaId
			$scope.control.escola = _.first(res.data).id
		});


});