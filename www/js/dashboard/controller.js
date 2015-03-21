angular.module('dashboard.controller', ['dashboard.services', 'app.services'])
.controller('DashboardCtrl', function ($scope, $stateParams, Escolas, WeeklyReports, Quesitos, _) {



	// D3 settings

	var height = 300, width = 500;

	// build d3 paths
	var chart = d3
	  .select('#chart')
	  .append('svg')
	  .attr('width', width)
	  .attr('height', height)
	  .append('g');

	var chartPaths = {
		totalMinutes: chart.append('path'),
		videoMinutes: chart.append('path').attr('class', 'videoMinutes'),
		exerciseMinutes: chart.append('path').attr('class', 'exerciseMinutes'),
		pontos: chart.append('path'),
		dominado: chart.append('path'),
		nivel2: chart.append('path'),
		nivel1: chart.append('path'),
		praticado: chart.append('path'),
		precisaPraticar: chart.append('path'),
		comDificuldade: chart.append('path'),
	};


	// define control objetc
	var control = $scope.control = {};

	// Quesitos
	Quesitos.get()
		.then(function (res) {
			control.quesitos = res.data;

			_.each(control.quesitos, function (q, index) {

				// watch changes
				$scope.$watch('control.quesitos[' + index + ']', function () {
					drawAllRequiredGraphs();
				}, true)
			})
		});

	// Escolas

	Escolas.get()
		.then(function (res) {

			// set array of available schools
			$scope.escolas = res.data;

			// set control value for escolaId
			$scope.control.escola = _.first(res.data)._id
		});


	// watch changes on escola property of the control object
	$scope.$watch('control.escola', function () {

		if (control.escola) {

			WeeklyReports.get({
				escola: control.escola
			})
			.then(function (res) {

				// set data to the $scope
				$scope.weeklyReportData = res.data;

				// 
				drawAllRequiredGraphs();
				
			})
		}
		
	});


	function drawAllRequiredGraphs() {

		// draw one graph for each.
		_.each(control.quesitos, function (q) {

			if (chartPaths[q.id]) {


				if (q.enabled) {
					

					chartPaths[q.id].attr('visibility', 'visible')
					drawGraph(chartPaths[q.id], $scope.weeklyReportData, {
						attribute: q.id
					});

				} else {

					chartPaths[q.id].attr('visibility', 'hidden')
				}

			}

		})
	}


	// function that generates graph
	function drawGraph(path, weeks, options) {

		var dataType      = options.type || 'avg',
			dataAttribute = options.attribute;

		if (!dataAttribute) {
			throw new Error('No dataAttribute');
		}

		// create a time scale
		//retrieve dates
		var xScale = d3.time.scale()
			.domain(d3.extent(weeks, function (week) {
				return week.date;
			}))
			.range([0, width]);


		// video minute scale
		var videoMinScale = d3.scale.linear()
			.domain(d3.extent(weeks, function (week) {
				return week[dataType][dataAttribute]
			}))
			.range([height, 0]);


		var line = d3.svg.line()
		      .x(function (week) {
		        return xScale(week.date);
		      })
		      .y(function (week) {
		        return videoMinScale(week[dataType][dataAttribute]);
		      });

		// set data to path
		path
		  .datum(weeks)
		  .transition()
		  .duration(450)
		  .attr('d', line);
	}




});
