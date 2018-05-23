angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    

      .state('menPatient.home', {
    url: '/home',
    views: {
      'side-menu21': {
        templateUrl: 'templates/home.html',
        controller: 'homeCtrl'
      }
    }
  })

  .state('menPatient.tagebuch', {
    url: '/patientdiary',
    views: {
      'side-menu21': {
        templateUrl: 'templates/tagebuch.html',
        controller: 'tagebuchCtrl'
      }
    }
  })

  .state('menPatient', {
    url: '/side-menu21',
    templateUrl: 'templates/menPatient.html',
    controller: 'menPatientCtrl'
  })

  .state('login', {
    url: '/page5',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('registrierenPatient', {
    url: '/signupPatient',
    templateUrl: 'templates/registrierenPatient.html',
    controller: 'registrierenPatientCtrl'
  })

  .state('registrierenArzt', {
    url: '/registerDoctor',
    templateUrl: 'templates/registrierenArzt.html',
    controller: 'registrierenArztCtrl'
  })

  .state('menPatient.arzt', {
    url: '/profil',
    views: {
      'side-menu21': {
        templateUrl: 'templates/arzt.html',
        controller: 'arztCtrl'
      }
    }
  })

  .state('menPatient.videos', {
    url: '/page10',
    views: {
      'side-menu21': {
        templateUrl: 'templates/videos.html',
        controller: 'videosCtrl'
      }
    }
  })

  .state('menPatient.video', {
    url: '/Video',
    views: {
      'side-menu21': {
        templateUrl: 'templates/video.html',
        controller: 'videoCtrl'
      }
    }
  })

  .state('menPatient.frage', {
    url: '/page12',
    views: {
      'side-menu21': {
        templateUrl: 'templates/frage.html',
        controller: 'frageCtrl'
      }
    }
  })

  .state('fragen', {
    url: '/page13',
    templateUrl: 'templates/fragen.html',
    controller: 'fragenCtrl'
  })

$urlRouterProvider.otherwise('/side-menu21/home')


});