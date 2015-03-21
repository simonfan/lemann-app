angular.module('escolasProblema.controller', ['dashboard.services', 'app.services'])
.controller('EscolasProblemaCtrl', function ($scope, $stateParams, EscolasProblema, _) {
    $scope.escolas = null;

    EscolasProblema.get().then(function(e) {
        console.info(e);
        $scope.escolas = e.data.splice(0, 25);
    });
})
.service('EscolasProblema', function ($http) {
	return {
		get: function () {
			return $http.get('http://hackday-lemann.herokuapp.com/schools/_decreasing')
		},
	};
})
;
