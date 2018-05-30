angular.module('app.services', [])

  .factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
    return {
      responseError: function (response) {
        $rootScope.$broadcast({
          401: AUTH_EVENTS.notAuthenticated,
        }[response.status], response);
        return $q.reject(response);
      }
    };
  })

  .service('AuthService', function($q, $http, API_ENDPOINT) {
    var LOCAL_TOKEN_KEY = 'yourTokenKey';
    var isAuthenticated = false;
    var authToken;

    function loadUserCredentials() {
      var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
      if (token) {
        useCredentials(token);
      }
    }

    function storeUserCredentials(token) {
      window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
      useCredentials(token);
    }

    function useCredentials(token) {
      isAuthenticated = true;
      authToken = token;

      // Set the token as header for your requests!
      $http.defaults.headers.common.Authorization = authToken;
    }

    function destroyUserCredentials() {
      authToken = undefined;
      isAuthenticated = false;
      $http.defaults.headers.common.Authorization = undefined;
      window.localStorage.removeItem(LOCAL_TOKEN_KEY);
    }

    var register = function(user) {
      return $q(function(resolve, reject) {
        $http.post(API_ENDPOINT.url + '/auth/register', user).then(function(result) {
          if (result.data.token) {
            storeUserCredentials(result.data.token);
            resolve(result.data.user);
          } else {
            reject(result.data.msg);
          }
        }).catch((err) => {

          reject(err);
          // Do messaging and error handling here

          return
        });
      });
    };

    var login = function(user) {
      return $q(function(resolve, reject) {
        $http.post(API_ENDPOINT.url + '/auth/login', user).then(function(result) {
          if (result.data.token) {
            storeUserCredentials(result.data.token);
            resolve(result.data.user);
          } else {
            reject(result.data.msg);
          }
        }).catch((err) => {

          reject(err);
          // Do messaging and error handling here

          return
        });
      });
    };

    var logout = function() {
      destroyUserCredentials();
    };

    loadUserCredentials();

    return {
      login: login,
      register: register,
      logout: logout,
      isAuthenticated: function() {return isAuthenticated;},
    };
  })

.service('sharedProperties', function () {
  var property = "";

  return {
      getProperty: function () {
           return property;
      },
       setProperty: function(value) {
           property = value;
       }
  };
})

.config(function ($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
});
