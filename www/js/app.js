// Ionic app App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'app' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'app.controllers' is found in controllers.js
angular.module('app', ['ionic', 'app.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.dashboardWithSchool', {
    url: "/dashboard/:schoolId",
    views: {
      'menuContent': {
        templateUrl: "templates/dashboard.html",
        controller: 'DashboardCtrl',
      }
    }
  })

  .state('app.dashboard', {
    url: "/dashboard",
    views: {
      'menuContent': {
        templateUrl: "templates/dashboard.html",
        controller: 'DashboardCtrl',
      }
    }
  })

  .state('app.escolasProblema', {
    url: "/escolas-problema",
    views: {
      'menuContent': {
        templateUrl: "templates/escolas-problema.html",
        controller: 'EscolasProblemaCtrl'
      }
    }
  })

  // .state('app.escolas', {
  //   url: "/escolas",
  //   views: {
  //     'menuContent': {
  //       templateUrl: "templates/escolas.html",
  //       controller: 'EscolasCtrl'
  //     }
  //   }
  // })

  // .state('app.single', {
  //   url: "/escolas/:escolaId",
  //   views: {
  //     'menuContent': {
  //       templateUrl: "templates/escola.html",
  //       controller: 'EscolaCtrl'
  //     }
  //   }
  // });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/dashboard');
});
