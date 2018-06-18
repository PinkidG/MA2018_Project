angular.module('app.constants', [])

.constant('AUTH_EVENTS', {
    notAuthenticated: 'auth-not-authenticated'
  })

  .constant('API_ENDPOINT', {
    url: 'http://pinkisworld.ddnss.de/api'
    //  For a simulator use: url: 'http://127.0.0.1:8080/api'
  });
