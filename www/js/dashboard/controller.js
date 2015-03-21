angular.module('dashboard.controller', ['dashboard.services', 'app.services'])
.controller('DashboardCtrl', function ($scope, $stateParams, Escolas, _) {


	// define control objetc
	var control = $scope.control = {};

	// control description
	var quesitos = control.quesitos = [];

	quesitos.push({
		id: 'exerciseminutes',
		label: 'Tempo de exercício',
		enabled: true
	});


	quesitos.push({
		id: 'videominutes',
		label: 'Tempo de vídeo assistido',
		enabled: true
	});

	
	quesitos.push({
		id: 'totalminutes',
		label: 'Tempo na plataforma',
		enabled: true
	});

	
	quesitos.push({
		id: 'com_dificuldade',
		label: 'Com dificuldades',
		enabled: true
	});

	
	quesitos.push({
		id: 'precisa_praticar',
		label: 'Precisa praticar',
		enabled: true
	});
	
	quesitos.push({
		id: 'praticado',
		label: 'Praticado',
		enabled: true
	});
	
	quesitos.push({
		id: 'nivel1',
		label: 'Nivel 1',
		enabled: true
	});


	quesitos.push({
		id: 'nivel2',
		label: 'Nivel 2',
		enabled: true
	});


	quesitos.push({
		id: 'dominado',
		label: 'Dominado',
		enabled: true
	});

	quesitos.push({
		id: 'pontos',
		label: 'Pontos',
		enabled: true
	});

	Escolas.get()
		.then(function (res) {

			// set array of available schools
			$scope.escolas = res.data;

			// set control value for escolaId
			$scope.control.escola = _.first(res.data).id
		});


});