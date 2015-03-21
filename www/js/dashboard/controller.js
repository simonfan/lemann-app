angular.module('dashboard.controller', ['dashboard.services', 'app.services'])
.controller('DashboardCtrl', function ($scope, $stateParams, Escolas, WeeklyReports, Quesitos, _) {


	// define control objetc
	var control = $scope.control = {};

	// Quesitos
	Quesitos.get()
		.then(function (res) {
			control.quesitos = res.data;

			_.each(control.quesitos, function (q, index) {

				// watch changes
				$scope.$watch('control.quesitos[' + index + ']', function () {
					console.log('changed quesitos')
				}, true)
			})
		});

	// Escolas

	Escolas.get()
		.then(function (res) {

			// set array of available schools
			$scope.escolas = res.data;

			// set control value for escolaId
			$scope.control.escola = _.first(res.data).id
		});


	// watch changes on escola property of the control object
	$scope.$watch('control.escola', function () {
		console.log('changed escola')
	});



	// function that generates graph
	function renderGraph() {
		var svg = d3.select('#chartArea').append('svg')
		   .attr('width', 400)
		   .attr('height', 300);

		 var multiplier = 8;

		 svg.selectAll('rect')
		   .data(dataset)
		   .enter()
		   .append('rect')
		   .attr('class', 'bar')
		   .attr('x', function (d, i) {
		     return i * 22;
		   })
		   .attr('y', function (d) {
		     return 300 - d * multiplier;
		   })
		   .attr('width', 20)
		   .attr('height', function (d) {
		     return d * multiplier;
		   });
	}

});