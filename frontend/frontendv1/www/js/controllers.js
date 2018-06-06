angular.module('app.controllers', ['ngCordova'])

.controller('homeCtrl', 
function ($scope, sharedProperties, $stateParams) {
$scope.user = sharedProperties.getProperty();

var date = new Date($scope.user.dateOfBirth);

$scope.datefor = date.toLocaleDateString("de");

$scope.illnames = [];

  for(i=0;i<$scope.user.illnesses.length;i++) { 
    $scope.illnames.push($scope.user.illnesses[i].name);
  }

$scope.illnesses = $scope.illnames.toString();

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
function ($scope, AuthService, UserService, sharedProperties, $state, $cordovaDialogs) {

    AuthService.logout()
    $scope.user = {
        email: '',
        password: ''
      };

      $scope.login = function() {
        AuthService.login($scope.user).then(function(user) {
          UserService.refreshUser(user.userId).then(function(ruser) {
          sharedProperties.setProperty(ruser);
          if (ruser.role == "Doctor") {
            $state.go('men.home2');
          } else {
            $state.go('men.home');
          }
        }, function(errMsg) {

          $cordovaDialogs.confirm(errMsg.data.error, 'Fehler', ['Try Again'])
            .then(function(buttonIndex) {
              // no button = 0, 'OK' = 1, 'Cancel' = 2
              var btnIndex = buttonIndex;
            });
        });
        }, function(errMsg) {

          $cordovaDialogs.confirm(errMsg.data.error, 'Fehler', ['Try Again'])
            .then(function(buttonIndex) {
              // no button = 0, 'OK' = 1, 'Cancel' = 2
              var btnIndex = buttonIndex;
            });
        });
      };

    // When button is clicked, the popup will be shown...
   $scope.showPopup = function() {
    $scope.data = {}

    $cordovaDialogs.confirm('message', 'Auswählen', ['Arzt','Patient'])
    .then(function(buttonIndex) {
      // no button = 0, 'OK' = 1, 'Cancel' = 2
      var btnIndex = buttonIndex;

      if (btnIndex == 1) {
        $state.go('registrierenArzt');
      } else if (btnIndex == 2) {
        $state.go('registrierenPatient');
      }
    });
  };

})

.controller('registrierenPatientCtrl',
function($scope, AuthService, sharedProperties, $state, $cordovaDialogs) {

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
      $cordovaDialogs.confirm("Erfolg", 'Registrierung erfolgreich', ['OK'])
      .then(function(buttonIndex) {
        // no button = 0, 'OK' = 1, 'Cancel' = 2
        var btnIndex = buttonIndex;
        $state.go('men.home');
      });
    }, function(errMsg) {
      $cordovaDialogs.confirm(errMsg.data.error, 'Fehler', ['Try Again'])
      .then(function(buttonIndex) {
        // no button = 0, 'OK' = 1, 'Cancel' = 2
        var btnIndex = buttonIndex;
      });
    });
  };

})

.controller('registrierenArztCtrl',
function($scope, AuthService, sharedProperties, $state, $cordovaDialogs) {

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
      $cordovaDialogs.confirm("Erfolg", 'Registrierung erfolgreich', ['OK'])
      .then(function(buttonIndex) {
        // no button = 0, 'OK' = 1, 'Cancel' = 2
        var btnIndex = buttonIndex;
        $state.go('men.home2');
      });
    }, function(errMsg) {
      $cordovaDialogs.confirm(errMsg.data.error, 'Fehler', ['Try Again'])
      .then(function(buttonIndex) {
        // no button = 0, 'OK' = 1, 'Cancel' = 2
        var btnIndex = buttonIndex;
      });
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

.controller('frageCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('fragenCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

  .controller('sucheCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $stateParams) {


    }])

  .controller('suchergebnisCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $stateParams) {


    }])

  .controller('patientCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    function ($scope, $stateParams) {


    }])

  .controller('tagebuchCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    function ($scope, $stateParams) {


    }])


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
