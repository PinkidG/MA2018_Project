// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic','ngMaterial', 'app.controllers', 'app.routes', 'app.directives','app.services', 'app.constants', 'monospaced.elastic'])


.config(function($ionicConfigProvider, $sceDelegateProvider, $mdGestureProvider){

  $mdGestureProvider.skipClickHijack();
  $ionicConfigProvider.views.maxCache(0);
  $sceDelegateProvider.resourceUrlWhitelist([ 'self','*://www.youtube.com/**', '*://player.vimeo.com/video/**', '*://pinkisworld.ddnss.de/api/**']);

})
  .run(function ($rootScope, $state, AuthService, AUTH_EVENTS, $ionicPlatform, checkPlatform) {

    $rootScope.goBackState = function(){
      $ionicViewSwitcher.nextDirection('back');
      $ionicHistory.goBack();
    }

    $ionicPlatform.ready(function() {
      if (
        window.cordova &&
        window.cordova.plugins &&
        window.cordova.plugins.Keyboard
      ) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
      if(!checkPlatform.isBrowser){
        pictureSource = navigator.camera.PictureSourceType;
        destinationType = navigator.camera.DestinationType;
      }



      // Branch
      $ionicPlatform.on("deviceready", function() {
        branchInit();

      });

      $ionicPlatform.on("resume", function() {
        $ionicPlatform.ready(function() {
          branchInit();
        });


      });

      function branchInit() {
        // Branch initialization
        Branch.initSession().then(function(data) {
          if (data["+clicked_branch_link"]) {
            // read deep link data on click
            alert("Deep Link Data: " + JSON.stringify(data));
          }
        }.catch( (err) => {
          alert('Branch Init Error: ' + JSON.stringify(err));
        }));
      }
    });

    $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {
      if (!AuthService.isAuthenticated()) {
        console.log(next.name);
        if (next.name !== 'login' && next.name !== 'registrierenArzt' && next.name !== 'registrierenPatient') {
          event.preventDefault();
          $state.go('login');
        }
      }
    });
  })


/*
  This directive is used to disable the "drag to open" functionality of the Side-Menu
  when you are dragging a Slider component.
*/
.directive('disableSideMenuDrag', ['$ionicSideMenuDelegate', '$rootScope', function($ionicSideMenuDelegate, $rootScope) {
    return {
        restrict: "A",
        controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {

            function stopDrag(){
              $ionicSideMenuDelegate.canDragContent(false);
            }

            function allowDrag(){
              $ionicSideMenuDelegate.canDragContent(true);
            }

            $rootScope.$on('$ionicSlides.slideChangeEnd', allowDrag);
            $element.on('touchstart', stopDrag);
            $element.on('touchend', allowDrag);
            $element.on('mousedown', stopDrag);
            $element.on('mouseup', allowDrag);

        }]
    };
}])

/*
  This directive is used to open regular and dynamic href links inside of inappbrowser.
*/
.directive('hrefInappbrowser', function() {
  return {
    restrict: 'A',
    replace: false,
    transclude: false,
    link: function(scope, element, attrs) {
      var href = attrs['hrefInappbrowser'];

      attrs.$observe('hrefInappbrowser', function(val){
        href = val;
      });

      element.bind('click', function (event) {

        window.open(href, '_system', 'location=yes');

        event.preventDefault();
        event.stopPropagation();

      });
    }
  };
});

function handleOpenURL(url) {
  let urlObject = new URL(url);
  let c = urlObject.searchParams.get("topicId");

  let shared = angular.element(document.body).injector().get('sharedParameter');
  shared.setProperty(c);


  let state = angular.element(document.body).injector().get('$state');

  let checkPlatform = angular.element(document.body).injector().get('checkPlatform');
  let title = document.title;

  if(title != "Home" && title != "login"){


    state.go('men.home')

  }


}

