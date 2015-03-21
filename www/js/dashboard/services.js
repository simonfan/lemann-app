angular.module('dashboard.services', [])
.service('Escolas', function ($http) {
	return {
		get: function () {
			return $http.get('http://hackday-lemann.herokuapp.com/schools/')
		},
	};
})
.service('Quesitos', function ($http, $q){
	

	// control description
	var quesitos = [];


	
	quesitos.push({
		id: 'totalMinutes',
		label: 'Tempo na plataforma',
		enabled: false
	});
	quesitos.push({
		id: 'exerciseMinutes',
		label: 'Tempo de exercício',
		enabled: false
	});


	// quesitos.push({
	// 	id: 'videoMinutes',
	// 	label: 'Tempo de vídeo assistido',
	// 	enabled: true
	// });

	quesitos.push({
		id: 'comDificuldade',
		label: 'Com dificuldades',
		enabled: false
	});

	quesitos.push({
		id: 'precisaPraticar',
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
		enabled: true
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
.service('WeeklyReports', function ($http, _) {
	return {
		get: function (options) {

			var turma = options.turma && options.turma !== '_all' ? options.turma : '';

			return $http.get('http://hackday-lemann.herokuapp.com/schools/' + options.escola + '/weeklyReport?turma=' + turma)
				.then(function (res) {

					// parse the date
					_.each(res.data, function (d, index) {

						res.data[index].date = new Date(d._id);
					});

					return res;
				})
		}
	}
})