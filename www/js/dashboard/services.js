angular.module('dashboard.services', [])
.service('Escolas', function ($http) {
	return {
		get: function () {
			return $http.get('http://hackday-lemann.herokuapp.com/schools/')
		}
	};
})
.service('Quesitos', function ($http, $q){
	

	// control description
	var quesitos = [];

	quesitos.push({
		id: 'exerciseminutes',
		label: 'Tempo de exercício',
		enabled: false
	});


	quesitos.push({
		id: 'videominutes',
		label: 'Tempo de vídeo assistido',
		enabled: false
	});

	
	quesitos.push({
		id: 'totalminutes',
		label: 'Tempo na plataforma',
		enabled: false
	});

	quesitos.push({
		id: 'com_dificuldade',
		label: 'Com dificuldades',
		enabled: false
	});

	quesitos.push({
		id: 'precisa_praticar',
		label: 'Precisa praticar',
		enabled: false
	});
	
	quesitos.push({
		id: 'praticado',
		label: 'Praticado',
		enabled: false
	});
	
	quesitos.push({
		id: 'nivel1',
		label: 'Nivel 1',
		enabled: false
	});

	quesitos.push({
		id: 'nivel2',
		label: 'Nivel 2',
		enabled: false
	});

	quesitos.push({
		id: 'dominado',
		label: 'Dominado',
		enabled: false
	});

	quesitos.push({
		id: 'pontos',
		label: 'Pontos',
		enabled: false
	});



	return {
		get: function () {
			var defer = $q.defer();

			// emulation
			setTimeout(function () {

				defer.resolve({ data: quesitos });

			}, 300)

			return defer.promise;
		}
	}

})
.service('WeeklyReports', function ($http) {
	return {
		get: function () {
			return $http.get('http://hackday-lemann.herokuapp.com/schools/123/weeklyReport')
		}
	}
})