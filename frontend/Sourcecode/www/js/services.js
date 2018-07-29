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

  .service('APIConnector', function (API_ENDPOINT_APP, API_ENDPOINT_OTHER) {

    let USELOCASERVER = false;


    function getAPIEndpoint() {
      if (USELOCASERVER){
          return API_ENDPOINT_OTHER
      }
      else{
        return API_ENDPOINT_APP
      }

    }

    return {
      getAPIEndpoint: getAPIEndpoint
    }
  })

  .service('AuthService', function($q, $http, APIConnector) {
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

        $http.post(APIConnector.getAPIEndpoint().url + '/auth/register', user).then(function(result) {
          if (result.data.token) {
            storeUserCredentials(result.data.token);
            resolve(result.data.user);
          } else {
            reject(result.data.msg);
          }
        }).catch((err) => {
          reject(err);
          return
        });
      });
    };

    var login = function(user) {
      return $q(function(resolve, reject) {

        $http.post(APIConnector.getAPIEndpoint().url + '/auth/login', user).then(function(result) {
          if (result.data.token) {
            storeUserCredentials(result.data.token);
            resolve(result.data.user);
          } else {
            reject(result.data.msg);
          }
        }).catch((err) => {
          reject(err);
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

  .service('DiaryService', function($q, $http, APIConnector) {

    var diary = function(diaryEntry) {
      return $q(function(resolve, reject) {
        $http.post(APIConnector.getAPIEndpoint().url + '/diary', diaryEntry).then(function(result) {
          if (result.data.user) {
            resolve(result.data.user);
          } else {
            reject(result.data.msg);
          }
        }).catch((err) => {
          reject(err);
          return
        });
      });
    };
    return {
      diary: diary
    };
  })

  .service('SearchService', function($q, $http, APIConnector) {

    var search = function(searchTerm) {
      return $q(function(resolve, reject) {
        $http.post(APIConnector.getAPIEndpoint().url + '/search', searchTerm).then(function(result) {
          if (result.data.topics && result.data.videos) {
            resolve(result.data);
          } else {
            reject(result.data.msg);
          }
        }).catch((err) => {
          reject(err);
          return
        });
      });
    };
    return {
      search: search
    };
  })

  .service('VideoService', function($q, $http, APIConnector) {

    var uploadVideo = function(image, title) {

      var fd = new FormData();
      fd.append('video', image, title.trim()+".mp4");

      var deffered = $q.defer();
      $http.post(APIConnector.getAPIEndpoint().url + "/video", fd, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}

      }).success(function (response) {
        deffered.resolve(response);

      }).error(function (response) {
        deffered.reject(response.message);
      });

      return deffered.promise;
    };


    let videos = function () {
      return $q(function(resolve, reject) {
        $http.get(APIConnector.getAPIEndpoint().url + '/videos').then(function(result) {
          if (result.data.video) {
            let list = [];
            result.data.video.forEach(function(video){
              let title = video.title.replace('.mp4','').replace('.mov','').trim();
              let id = video.id;
              let userId = video.userId;
              let videoObject = {
                title: title,
                id: id,
                userId: userId
              };
              list.push(videoObject)
            });
            resolve(list);
          } else {
            reject(result.data.msg);
          }
        }).catch((err) => {
          reject(err);
          return
        });
      });
    };

    let videoById = function (id) {
      return $q(function(resolve, reject) {
        $http.get(APIConnector.getAPIEndpoint().url + '/videoById/'+id).then(function(result) {
          if (result.data.video && result.data.user) {

            let video = result.data.video;
              let title = video.title.replace('.mp4','').replace('.mov','').trim();
              let id = video.id;
              let userId = video.userId;
              let firstName = result.data.user.firstName;
              let lastName = result.data.user.lastName;
              let role = result.data.user.role;

              let videoObject = {
                title: title,
                id: id,
                userId: userId,
                firstName: firstName,
                lastName: lastName,
                role: role
              };

            resolve(videoObject);
          } else {
            reject({error: "Upload fehlgeschlaen!"});
          }
        }).catch((err) => {
          reject(err);
          return
        });
      });
    };



    return {
      uploadVideo: uploadVideo,
      videos: videos,
      videoById: videoById
    };
  })


  .service('checkPlatform', function () {

    let isBrowser = function () {
      if(ionic.Platform.platforms == null ||ionic.Platform.platforms == undefined){
        return true
      }
      return ionic.Platform.platforms.indexOf('browser') > -1
    };



    return{
      isBrowser: isBrowser
    }
  })

  .service('TopicService', function($q, $http, APIConnector) {

    this.selectedTopic;


    let topics = function () {
      return $q(function(resolve, reject) {
        $http.get(APIConnector.getAPIEndpoint().url + '/topics').then(function(result) {
          if (result.data) {
            resolve(result.data.topic);
          } else {
            reject(result.data.msg);
          }
        }).catch((err) => {
          reject(err);
          return
        });
      });
    };

    let topic = function (topicId) {
      return $q(function(resolve, reject) {
        $http.get(APIConnector.getAPIEndpoint().url + '/topic/' + topicId).then(function(result) {
          if (result.data) {
            resolve(result.data.topic);
          } else {
            reject(result.data.msg);
          }
        }).catch((err) => {
          reject(err);
          return
        });
      });
    };


    let addTopic = function (topicObj) {
      return $q(function(resolve, reject) {
        $http.post(APIConnector.getAPIEndpoint().url + '/topic', topicObj).then(function(result) {
          if (result.data) {
            resolve(result.data.topic);
          } else {
            reject(result.data.msg);
          }
        }).catch((err) => {
          reject(err);
        });
      });
    };

    let addTopicEntry = function (topicId, message) {
      return $q(function(resolve, reject) {
        let topicObject = {
          topicId: topicId,
          message: message
        };

        $http.post(APIConnector.getAPIEndpoint().url + '/entry/topic', topicObject).then(function(result) {
          if (result.data) {
            resolve(result.data.topic);
          } else {
            reject(result.data.msg);
          }
        }).catch((err) => {
          reject(err);
        });
      });
    };

    return {
      topics: topics,
      topic: topic,
      addTopic: addTopic,
      addTopicEntry: addTopicEntry
    };
  })

  .service('UserService', function($q, $http, APIConnector) {


    var refreshUser = function(userId) {
      return $q(function(resolve, reject) {
        $http.get(APIConnector.getAPIEndpoint().url + '/user/' + userId).then(function(result) {
          if (result.data.User) {
            resolve(result.data.User);
          } else {
            reject(result.data.msg);
          }
        }).catch((err) => {
          reject(err);
          return
        });
      });
    };

    var updateUser = function(user) {
      return $q(function(resolve, reject) {
        $http.post(APIConnector.getAPIEndpoint().url + '/user/update', user).then(function(result) {
          if (result.data.User) {
            resolve(result.data.User);
          } else {
            reject(result.data.msg);
          }
        }).catch((err) => {
          reject(err);
          return
        });
      });
    };

    let deleteUser = function() {
      return $q(function(resolve, reject) {
        $http.delete(APIConnector.getAPIEndpoint().url + '/user/delete').then(function(result) {
          if (result.data.message) {
            resolve(result.data.message);
          } else {
            reject(result.data.error);
          }
        }).catch((err) => {
          reject(err);
          return
        });
      });
    };

    let searchUser = function(lastName) {
      return $q(function(resolve, reject) {
        $http.get(APIConnector.getAPIEndpoint().url + '/usern/' + lastName).then(function(result) {
          if (result.data.User) {
            resolve(result.data.User);
          } else {
            reject(result.data.msg);
          }
        }).catch((err) => {
          reject(err);
        });
      });
    };

    let getUserById = function(userId) {
      return $q(function(resolve, reject) {
        $http.get(APIConnector.getAPIEndpoint().url + '/user/' + userId).then(function(result) {
          if (result.data.User) {
            resolve(result.data.User);
          } else {
            reject(result.data.msg);
          }
        }).catch((err) => {
          reject(err);
        });
      });
    };

    let addUserToUser = function (userId) {
      return $q(function(resolve, reject) {
        $http.post(APIConnector.getAPIEndpoint().url + '/user/add/' + userId, {id: userId}).then(function(result) {
          if (result.data.user) {
            resolve(result.data.user);
          } else {
            reject(result.data.msg);
          }
        }).catch((err) => {
          reject(err);
        });
      });
    };

    return {
      refreshUser: refreshUser,
      updateUser: updateUser,
      deleteUser: deleteUser,
      searchUser: searchUser,
      getUserById: getUserById,
      addUserToUser: addUserToUser
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

  .service('sharedParameter', function () {
    var value = "";
    var type = "";

    return {
      getProperty: function () {
        return{
          value: value,
          type: type
        }
      },
      setProperty: function(typeValue, propertyValue) {
        value = propertyValue;
        type = typeValue;
      }
    };
  })

.config(function ($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
});
