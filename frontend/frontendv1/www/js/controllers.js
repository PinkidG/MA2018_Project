angular.module('app.controllers', ['ngCordova', 'ionic', 'ngMaterial'])

.controller('homeCtrl',
function ($scope, sharedProperties, TopicService,  $stateParams) {
  $scope.illnames = [];
  var date = new Date($scope.user.dateOfBirth);

  $scope.user = sharedProperties.getProperty();
  $scope.datefor = date.toLocaleDateString("de");

  for(i=0;i<$scope.user.illnesses.length;i++) {
    $scope.illnames.push($scope.user.illnesses[i].name);
  }
  if ($scope.illnames.length == 0) {
    $scope.illnesses = "Keine Befunde"
  } else {
    $scope.illnesses = $scope.illnames.toString();
  }

  TopicService.topics().then(function(topics) {

    $scope.entries = topics
  }, function(errMsg) {

    if ( !checkPlatform.isBrowser ) {
      navigator.notification.confirm(errMsg.statusText, function(buttonIndex) {}, "Topic-Fehler", ["Erneut versuchen"]);
    } else {

      let confirm = $mdDialog.confirm()
        .title('Topic-Fehler')
        .textContent(errMsg.statusText)
        .ariaLabel('Lucky day')
        .ok("Erneut versuchen");
      $mdDialog.show(confirm);
    }
  });





})

.controller('tagebuchCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('menPatientCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('loginCtrl',
function ($scope, AuthService, UserService, checkPlatform , sharedProperties , $state, $cordovaDialogs, $mdDialog) {

    AuthService.logout();
    $scope.user = {
        email: '',
        password: ''
      };

      $scope.login = function(ev) {
        AuthService.login($scope.user).then(function(user) {
          UserService.refreshUser(user.userId).then(function(ruser) {
          sharedProperties.setProperty(ruser);
          if (ruser.role == "Doctor") {
            $state.go('men.home2');
          } else {
            $state.go('men.home');
          }
        }, function(errMsg) {

            if ( !checkPlatform.isBrowser ) {
              navigator.notification.confirm(errMsg.statusText, function(buttonIndex) {}, "Server-Fehler", ["Erneut versuchen"]);
            } else {

              let confirm = $mdDialog.confirm()
                .title('Server-Fehler')
                .textContent(errMsg.statusText)
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok("Erneut versuchen");

              $mdDialog.show(confirm);
            }
        });
        }, function(errMsg) {
          if ( !checkPlatform.isBrowser ) {
            navigator.notification.confirm(errMsg.statusText, function(buttonIndex) {}, "Benutzer-Fehler (1M)", ["Erneut versuchen"]);
          } else {

            let confirm = $mdDialog.alert()
              .title('Benutzer-Fehler (1B)')
              .textContent(errMsg.statusText)
              .ariaLabel('Lucky day')
              .targetEvent(ev)
              .ok("Erneut versuchen");

            $mdDialog.show(confirm).then(function() {
              console.log("Dialog shown...")
            });
          }
        });
      };

    // When button is clicked, the popup will be shown...

  $scope.showPopup = function(ev) {

    if ( !checkPlatform.isBrowser ) {
      navigator.notification.confirm("Sind Sie ein Arzt oder ein Patient?", function(buttonIndex) {
        switch(buttonIndex) {
          case 1:
            $state.go('registrierenArzt');
            break;
          case 2:
            $state.go('registrierenPatient');
            break;
        }
      }, "Registrieren", [ "Arzt", "Patient"]);
    } else {

      var confirm = $mdDialog.confirm()
        .title('Registrieren')
        .textContent('Sind Sie ein Arzt oder ein Patient?')
        .ariaLabel('Lucky day')
        .targetEvent(ev)
        .ok("Patient")
        .cancel("Arzt");

      $mdDialog.show(confirm).then(function() {
        $state.go('registrierenPatient');
      }, function() {
        $state.go('registrierenArzt');
      });

      // Web page
    }

  }

})

.controller('registrierenPatientCtrl',
function($scope, AuthService,checkPlatform, sharedProperties, $state, $cordovaDialogs, $mdDialog) {

  $scope.user = {
    gender: '',
    lastName: '',
    firstName: '',
    email: '',
    dateOfBirth: '',
    password: '',
    role: 'Patient'
  };

  $scope.signup = function() {
    AuthService.register($scope.user).then(function(user) {
      sharedProperties.setProperty(user);

      if ( !checkPlatform.isBrowser ) {
        navigator.notification.confirm("Registrierung erfolgreich! (Patient)", function(buttonIndex) {
          $state.go('men.home');
        }, "Erfolg", [ "Okay"]);
      } else {

        var confirm = $mdDialog.alert()
          .title('Erfolg')
          .textContent('Registrierung erfolgreich! (Patient)')
          .ariaLabel('Lucky day')
          .ok("Okay");

        $mdDialog.show(confirm).then(function() {
          $state.go('men.home');
        });
      }
    }, function(errMsg) {
      if ( !checkPlatform.isBrowser ) {
        navigator.notification.confirm(errMsg.statusText, function(buttonIndex) {}, "Fehler (Patient)", ["Erneut versuchen"]);
      } else {

        let confirm = $mdDialog.alert()
          .title('Fehler (Patient)')
          .textContent(errMsg.statusText)
          .ariaLabel('Lucky day')
          .ok("Erneut versuchen");

        $mdDialog.show(confirm);
      }
    });
  };

})

.controller('registrierenArztCtrl',
function($scope, AuthService,checkPlatform, sharedProperties, $state, $cordovaDialogs, $mdDialog) {

  $scope.user = {
    gender: '',
    lastName: '',
    firstName: '',
    email: '',
    dateOfBirth: '',
    password: '',
    role: 'Doctor'
  };

  $scope.signup = function() {
    AuthService.register($scope.user).then(function(user) {
      sharedProperties.setProperty(user);
      if ( !checkPlatform.isBrowser ) {
        navigator.notification.confirm("Registrierung erfolgreich! (Arzt)", function(buttonIndex) {
          $state.go('men.home2');
        }, "Erfolg", [ "Okay"]);
      } else {

        var confirm = $mdDialog.alert()
          .title('Erfolg')
          .textContent('Registrierung erfolgreich! (Arzt)')
          .ariaLabel('Lucky day')
          .ok("Okay");

        $mdDialog.show(confirm).then(function() {
          $state.go('men.home2');
        });
      }
    }, function(errMsg) {
      if ( !checkPlatform.isBrowser ) {
        navigator.notification.confirm(errMsg.statusText, function(buttonIndex) {}, "Fehler (Arzt)", ["Erneut versuchen"]);
      } else {

        let confirm = $mdDialog.alert()
          .title('Fehler (Arzt)')
          .textContent(errMsg.statusText)
          .ariaLabel('Lucky day')
          .ok("Erneut versuchen");

        $mdDialog.show(confirm);
      }
    });
  };

})

.controller('arztCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('videosCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('videoCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('frageCtrl',
function ($scope, $stateParams, sharedProperties, TopicService) {

  let topicId = $stateParams.topicId

  TopicService.topic(topicId).then(function(topicEntry) {

    $scope.topicEntries = topicEntry.entries
    $scope.topicTitle = topicEntry.title
  }, function(errMsg) {

    if ( !checkPlatform.isBrowser ) {
      navigator.notification.confirm(errMsg.statusText, function(buttonIndex) {}, "Topic-Fehler", ["Erneut versuchen"]);
    } else {

      let confirm = $mdDialog.confirm()
        .title('Topic-Fehler')
        .textContent(errMsg.statusText)
        .ariaLabel('Lucky day')
        .ok("Erneut versuchen");
      $mdDialog.show(confirm);
    }
  });

})

.controller('fragenCtrl',
function ($scope, $stateParams, sharedProperties, TopicService) {
  TopicService.topics().then(function(topics) {

    $scope.entries = topics
  }, function(errMsg) {

    if ( !checkPlatform.isBrowser ) {
      navigator.notification.confirm(errMsg.statusText, function(buttonIndex) {}, "Topic-Fehler", ["Erneut versuchen"]);
    } else {

      let confirm = $mdDialog.confirm()
        .title('Topic-Fehler')
        .textContent(errMsg.statusText)
        .ariaLabel('Lucky day')
        .ok("Erneut versuchen");
      $mdDialog.show(confirm);
    }
  });


})

  .controller('sucheCtrl',
    function ($scope, $stateParams) {

      $scope.search = {
        text: ""
      }

      $scope.search = function() {
        console.log($scope.search.text)

      };

    })

  .controller('suchergebnisCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $stateParams) {


    }])

  .controller('patientCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    function ($scope, $stateParams) {


    }])

  .controller('tagebuchCtrl',
    function ($scope, $stateParams, sharedProperties) {

      $scope.user = sharedProperties.getProperty();
      $scope.diaryEntries = $scope.user.diaryEntries

    })


    .controller('menCtrl',
      function ($scope, AuthService, sharedProperties, $stateParams, $state) {

        $scope.init = function () {
          $scope.user = sharedProperties.getProperty();
          if ($scope.user.role == 'Doctor') {
            $scope.showPatient = true;
          } else {
            $scope.showPatient = false;
          }
      }

        $scope.logout = function() {
          $state.go('login');
        }

        $scope.init();

      })

  .controller('home2Ctrl',

    function ($scope, sharedProperties, $stateParams) {
      $scope.user = sharedProperties.getProperty();
    })

  .controller('patientenCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $stateParams) {


    }])

  .controller('neuenPatientenZuweisenCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $stateParams) {

    }])











    .controller('AppCtrl',

function($scope, $state, $ionicPopup, AuthService, AUTH_EVENTS) {

    $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
      AuthService.logout();
      $state.go('login');
      var alertPopup = $ionicPopup.alert({
        title: 'Session Lost!',
        template: 'Sorry, You have to login again.'
      });
    });

  })
