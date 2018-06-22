angular.module('app.services', [])

  .factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
    return {
      request: function (config) {
        var LOCAL_TOKEN_KEY = 'yourTokenKey';

        config.headers = config.headers || {};
        if (window.localStorage.getItem(LOCAL_TOKEN_KEY)) {
          config.headers.Authorization = window.localStorage.getItem(LOCAL_TOKEN_KEY);
        }
        return config;
      },

      responseError: function (response) {
        $rootScope.$broadcast({
          401: AUTH_EVENTS.notAuthenticated,
        }[response.status], response);
        return $q.reject(response);
      }
    };
  })

  .service('AuthService', function($q, $http, API_ENDPOINT_APP, API_ENDPOINT_OTHER) {
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

    var endpoint = function getEndpoint() {
      var isBrowser = ionic.Platform.is('browser');
      var end = API_ENDPOINT_APP
      if (isBrowser){
        end = API_ENDPOINT_OTHER
      }

      return end;
    };

    var register = function(user) {
      return $q(function(resolve, reject) {

        $http.post(endpoint().url + '/auth/register', user).then(function(result) {
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

        $http.post(endpoint().url + '/auth/login', user).then(function(result) {
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

  .service('DiaryService', function($q, $http, API_ENDPOINT_APP, API_ENDPOINT_OTHER) {


    var endpoint = function getEndpoint() {
      var isBrowser = ionic.Platform.is('browser');
      var end = API_ENDPOINT_APP
      if (isBrowser){
        end = API_ENDPOINT_OTHER
      }

      return end;
    };

    var diary = function(diaryEntry) {
      return $q(function(resolve, reject) {
        $http.post(endpoint().url + '/diary', diaryEntry).then(function(result) {
          if (result.data.user) {
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

    return {
      diary: diary
    };
  })

  .service('checkPlatform', function () {
    return{
      isBrowser: ionic.Platform.is('browser')
    }
  })

  .service('TopicService', function($q, $http, API_ENDPOINT_APP, API_ENDPOINT_OTHER) {

    this.selectedTopic;

    let endpoint = function getEndpoint() {
      var isBrowser = ionic.Platform.is('browser');
      var end = API_ENDPOINT_APP
      if (isBrowser){
        end = API_ENDPOINT_OTHER
      }

      return end;
    };

    let topics = function () {
      return $q(function(resolve, reject) {
        $http.get(endpoint().url + '/topics').then(function(result) {
          if (result.data) {
            resolve(result.data.topic);
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

    let topic = function (topicId) {
      return $q(function(resolve, reject) {
        $http.get(endpoint().url + '/topic/' + topicId).then(function(result) {
          if (result.data) {
            resolve(result.data.topic);
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


    let addTopic = function (topicObj) {
      return $q(function(resolve, reject) {
        $http.post(endpoint().url + '/topic', topicObj).then(function(result) {
          if (result.data) {
            resolve(result.data.topic);
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

    return {
      topics: topics,
      topic: topic,
      addTopic: addTopic
    };
  })

  .service('UserService', function($q, $http, API_ENDPOINT_APP, API_ENDPOINT_OTHER) {


    var endpoint = function getEndpoint() {
      var isBrowser = ionic.Platform.is('browser');
      var end = API_ENDPOINT_APP
      if (isBrowser){
        end = API_ENDPOINT_OTHER
      }

      return end;
    };

    var refreshUser = function(userId) {
      return $q(function(resolve, reject) {
        $http.get(endpoint().url + '/user/' + userId).then(function(result) {
          if (result.data.User) {
            resolve(result.data.User);
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

    let searchUser = function(lastName) {
      return $q(function(resolve, reject) {
        $http.get(endpoint().url + '/usern/' + lastName).then(function(result) {
          if (result.data.User) {
            resolve(result.data.User);
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

    let getUserById = function(userId) {
      return $q(function(resolve, reject) {
        $http.get(endpoint().url + '/user/' + userId).then(function(result) {
          if (result.data.User) {
            resolve(result.data.User);
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

    return {
      refreshUser: refreshUser,
      searchUser: searchUser,
      getUserById: getUserById
    };
  })

  .service('checkPlatform', function () {
    return{
      isBrowser: ionic.Platform.is('browser')
    }
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
