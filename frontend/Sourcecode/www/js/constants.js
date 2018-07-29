angular.module('app.constants', [])

.constant('AUTH_EVENTS', {
    notAuthenticated: 'auth-not-authenticated'
  })

  // This is the real server endpoint. Chamge this if you want to use your own backend server structure.
  .constant('API_ENDPOINT_APP', {
    url: 'http://pinkisworld.ddnss.de/api'
  })

  // This is for a local backend server. Make sure the Port is correct!
  .constant('API_ENDPOINT_OTHER', {
    url: 'http://localhost:3000/api'
  });
