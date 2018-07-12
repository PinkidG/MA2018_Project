angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

  .state('men.home', {
    url: '/home-patient',
    views: {
      'side-menu21': {
        templateUrl: 'templates/home.html',
        controller: 'homeCtrl'
      }
    }
  })

  .state('men.patient', {
    url: '/patient-overview/:userId',
    views: {
      'side-menu21': {
        templateUrl: 'templates/patient.html',
        controller: 'patientCtrl'
      }
    }
  })

  .state('men.tagebuch', {
    url: '/patientdiary/:userId',
    views: {
      'side-menu21': {
        templateUrl: 'templates/tagebuch.html',
        controller: 'tagebuchCtrl'
      }
    }
  })

  .state('men.neuTagebuch', {
    url: '/newpatientdiary',
    views: {
      'side-menu21': {
        templateUrl: 'templates/neuerTagebucheintrag.html',
        controller: 'neuTagebuchCtrl'
      }
    }
  })

  .state('men', {
    url: '/side-menu',
    templateUrl: 'templates/men.html',
    controller: 'menCtrl'
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('registrierenPatient', {
    url: '/registerPatient',
    templateUrl: 'templates/registrierenPatient.html',
    controller: 'registrierenPatientCtrl'
  })

  .state('registrierenArzt', {
    url: '/registerDoctor',
    templateUrl: 'templates/registrierenArzt.html',
    controller: 'registrierenArztCtrl'
  })

  .state('men.arzt', {
    url: '/doctor',
    views: {
      'side-menu21': {
        templateUrl: 'templates/arzt.html',
        controller: 'arztCtrl'
      }
    }
  })

  .state('men.videos', {
    url: '/videos',
    views: {
      'side-menu21': {
        templateUrl: 'templates/videos.html',
        controller: 'videosCtrl'
      }
    }
  })

  .state('men.video', {
    url: '/Video/:videoId',
    views: {
      'side-menu21': {
        templateUrl: 'templates/video.html',
        controller: 'videoCtrl'
      }
    }
  })

  .state('men.frage', {
    url: '/question/:topicId',
    views: {
      'side-menu21': {
        templateUrl: 'templates/frage.html',
        controller: 'frageCtrl'
      }
    }
  })

  .state('men.frageNeu', {
    url: '/questionAdd',
    views: {
      'side-menu21': {
         templateUrl: 'templates/neueFrage.html',
        controller: 'frageNeuCtrl'
       }
     }
  })

    .state('men.frageEintragNeu', {
      url: '/questionEntryAdd/:topicId',
      views: {
        'side-menu21': {
          templateUrl: 'templates/neuerFragenEintrag.html',
          controller: 'frageEintragNeuCtrl'
        }
      }
    })

  .state('men.suche', {
    url: '/search',
    views: {
      'side-menu21': {
        templateUrl: 'templates/suche.html',
        controller: 'sucheCtrl'
      }
    }
  })

  .state('suchergebnis', {
    url: '/searchresult',
    templateUrl: 'templates/suchergebnis.html',
    controller: 'suchergebnisCtrl'
  })

  .state('men.fragen', {
    url: '/questions',
    views: {
      'side-menu21': {
        templateUrl: 'templates/fragen.html',
        controller: 'fragenCtrl'
      }
    }
  })

  .state('men.home2', {
    url: '/home-doctor',
    views: {
      'side-menu21': {
    templateUrl: 'templates/home2.html',
    controller: 'home2Ctrl'
     }
   }
  })

  .state('men.patienten', {
    url: '/patients-overview',
    views: {
      'side-menu21': {
        templateUrl: 'templates/patienten.html',
        controller: 'patientenCtrl'
      }
    }
  })

  .state('men.neuenPatientenZuweisen', {
    url: '/searchpatient',
    views: {
      'side-menu21': {
        templateUrl: 'templates/neuenPatientenZuweisen.html',
        controller: 'neuenPatientenZuweisenCtrl'
      }
    }
  })

    .state('men.account', {
      url: '/settings',
      views: {
        'side-menu21': {
          templateUrl: 'templates/einstellungen.html',
        controller: 'accountCtrl'
        }
      }
    })

  $urlRouterProvider.otherwise('/login')
});
