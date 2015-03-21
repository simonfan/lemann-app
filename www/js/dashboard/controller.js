angular.module('dashboard.controller', ['dashboard.services', 'app.services'])
.controller('DashboardCtrl', function ($scope, $stateParams, Escolas, WeeklyReports, Quesitos, _) {

	// load basic data
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
			$scope.control.escola = $stateParams.schoolId || _.first(res.data)._id
		});




	/////////////////
	// D3 settings //
	/////////////////
	var height = 300, width = 700;

	// build d3 paths
	var chart = d3
	  .select('#chart')
	  .append('svg')
	  .attr('width', width)
	  .attr('height', height)
	  .append('g');


	var chartPaths = {
		pontos: chart.append('path'),
		turma: '_all'
	};


	$scope.turmas = [{
		_id: '_all',
		name: 'Todas'
	}];

	// define control objetc
	var control = $scope.control = {
		turma: '_all'
	};


	// function to check whether a graph is required
	function isQuesitoRequired(id) {
		return _.find(control.quesitos, function (q) {
			return q.id === id && q.enabled;
		})
	}


	function updateGraph() {

		if (control.escola) {

			// find the escola
			var escolaObj = _.find($scope.escolas, function (e) {
				return e._id === control.escola;
			});

			var turmas = [{
				_id: '_all',
				name: 'Todas'
			}];

			// set the turmas at scope
			$scope.turmas = turmas.concat(escolaObj.turmas);

			WeeklyReports.get({
				escola: control.escola,
				turma: control.turma
			})
			.then(function (res) {

				// set data to the $scope
				$scope.weeklyReportData = res.data;

				// 
				drawAllRequiredGraphs();
			})
		}
		
	}

	// watch changes on escola property of the control object
	$scope.$watch('control.escola', updateGraph);
	$scope.$watch('control.turma', updateGraph);

	// draws all required graphs
	function drawAllRequiredGraphs() {

		if ($scope.weeklyReportData) {

			// draw time graphs
			drawTimeGraphs();

			// draw exercise graphs
			drawExerciseGraphs();
		}
	}

	var timeChartPaths = {
		totalMinutes: chart.append('path').attr('class', 'totalMinutes'),
		videoMinutes: chart.append('path').attr('class', 'videoMinutes'),
		exerciseMinutes: chart.append('path').attr('class', 'exerciseMinutes'),
	};

	// draws graphs related to time
	function drawTimeGraphs() {

		var weeks = $scope.weeklyReportData;

		var dataType = $scope.dataType || 'avg';

		// build time graph scale 
		var scale = d3.scale.linear()
			.domain(d3.extent(weeks, function (week) {
				return week[dataType].totalMinutes;
			}))
			.range([height, 0]);


		_.each(timeChartPaths, function (path, id) {
			if (isQuesitoRequired(id)) {
				// show
				timeChartPaths[id].attr('visibility', 'visible');

				// draw
				drawLineGraph(path, weeks, {
					attribute: id,
					yScale: scale
				})

			} else {
				timeChartPaths[id].attr('visibility', 'hidden');
			}
		})
	}

	var exerciseChartPaths = {
		dominado: chart.append('path').attr('class', 'dominado area'),
		nivel2: chart.append('path').attr('class', 'nivel2 area'),
		nivel1: chart.append('path').attr('class', 'nivel1 area'),
		praticado: chart.append('path').attr('class', 'praticado area'),
		precisaPraticar: chart.append('path').attr('class', 'precisaPraticar area'),
		comDificuldade: chart.append('path').attr('class', 'comDificuldade area'),
	}

	var exerciseLevels = ['comDificuldade', 'precisaPraticar', 'praticado', 'nivel1', 'nivel2', 'dominado'];
	// 
	function drawExerciseGraphs() {

		var weeks = $scope.weeklyReportData;

		var dataType = $scope.dataType || 'avg';

		// get all exerciseLevelCount
		var exerciseCounts = []
		_.each(weeks, function (week) {

			var weekCounts = [];

			_.each(exerciseLevels, function (attr) {
				console.log(week)

				exerciseCounts.push(week[dataType][attr]);
			});
		});


		// get domain
		var min = _.min(exerciseCounts);

		var max = 0;
		_.each(weeks, function (week) {

			// calculate the total exercise count of the week
			var weekTotal = _.reduce(exerciseLevels, function (res, level) {
				return res + week[dataType][level];
			}, 0);

			// if weekTotal is higher than the current max...
			max = weekTotal > max ? weekTotal : max;
		});

		// build time graph scale 
		var scale = d3.scale.linear()
			.domain([min, max])
			.range([height, 0]);

		// build list of required exercise levels'
		var requiredExerciseLevels = _.filter(control.quesitos, function (q) {
				return q.type === 'exercise' && q.enabled;
			}),
			requiredExerciseLevelNames = _.map(requiredExerciseLevels, function (q) {
				return q.id; 
			});


		_.each(exerciseChartPaths, function (path, id) {
			if (isQuesitoRequired(id)) {
				// show
				exerciseChartPaths[id].attr('visibility', 'visible');

				var currentLevelIndex = _.indexOf(requiredExerciseLevelNames, id);

				// parse the polygons data
				var weeksData = _.map(weeks, function (wk) {

					return {
						date: wk.date,
						y0: 0,
						y1: _.reduce(requiredExerciseLevelNames, function (res, level, levelIndex) {
							return levelIndex <= currentLevelIndex ? res + wk[dataType][level] : res;
						}, 0),
					};

				});

				console.log(weeksData);

				// draw
				drawAreaGraph(path, weeksData, {
					yScale: scale
				})

			} else {
				exerciseChartPaths[id].attr('visibility', 'hidden');
			}
		})
	}

	// function that generates a single graph
	function drawLineGraph(path, weeks, options) {

		var dataType      = options.type || 'avg',
			dataAttribute = options.attribute,
			yScale        = options.yScale;

		if (!dataAttribute) {
			throw new Error('No dataAttribute');
		}

		if (!yScale) {
			throw new Error('No yScale');
		}

		// create a time scale
		//retrieve dates
		var xScale = d3.time.scale()
			.domain(d3.extent(weeks, function (week) {
				return week.date;
			}))
			.range([0, width]);

		// yScale must be passed in

		var line = d3.svg.line()
		      .x(function (week) {
		        return xScale(week.date);
		      })
		      .y(function (week) {
		        return yScale(week[dataType][dataAttribute]);
		      });

		// set data to path
		path
		  .datum(weeks)
		  .transition()
		  .duration(450)
		  .attr('d', line);
	}



	function drawAreaGraph(path, weeksData, options) {

		var yScale = options.yScale;
		if (!yScale) {
			throw new Error('No yScale');
		}

		// create a time scale
		//retrieve dates
		var xScale = d3.time.scale()
			.domain(d3.extent(weeksData, function (wk) {
				return wk.date;
			}))
			.range([0, width]);

		// yScale must be passed in

		var area = d3.svg.area()
		      .x(function (wk) {
		        return xScale(wk.date);
		      })
		      .y0(function (wk) {
		      	return yScale(wk.y0);
		      })
		      .y1(function (wk) {
		      	return yScale(wk.y1);
		      })

		// set data to path
		path
		  .datum(weeksData)
		  .transition()
		  .duration(450)
		  .attr('d', area);	
	}



});
