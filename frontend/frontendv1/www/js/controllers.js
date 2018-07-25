angular.module('app.controllers', ['ngCordova', 'ionic', 'ngMaterial', 'monospaced.elastic' ])

.controller('homeCtrl',

function ($scope, $state, sharedProperties, sharedParameter, TopicService, checkPlatform, UserService, $mdDialog, $ionicLoading) {

  $scope.illnames = [];

  $ionicLoading.show();
  $scope.user = sharedProperties.getProperty();
  UserService.refreshUser($scope.user.userId).then(function (ruser) {
    sharedProperties.setProperty(ruser);
    $scope.user = sharedProperties.getProperty();
    var date = new Date($scope.user.dateOfBirth);
    $scope.datefor = date.toLocaleDateString("de");

    for(i=0;i<$scope.user.illnesses.length;i++) {
      $scope.illnames.push($scope.user.illnesses[i].name);
    }
    if ($scope.illnames.length === 0) {
      $scope.illnesses = "Keine Befunde"
    } else {
      $scope.illnesses = $scope.illnames.toString();
    }
    //2 neusten Tagebucheinträge
    $scope.diaryEntries = $scope.user.diaryEntries.slice();
    $scope.diaryEntries.reverse();
  })
  var date = new Date($scope.user.dateOfBirth);
  $scope.datefor = date.toLocaleDateString("de");

  //Forumseinträge des Patienten
  TopicService.topics().then(function(topics) {
    $scope.entries = topics
    $ionicLoading.hide()

  }, function(errMsg) {
    $ionicLoading.hide()
    if ( !checkPlatform.isBrowser() ) {
      navigator.notification.confirm(errMsg.statusText, function(buttonIndex) {}, "Topic-Fehler", ["Erneut versuchen"]);
    } else {
      let confirm = $mdDialog.alert()
        .title('Topic-Fehler')
        .textContent(errMsg.statusText)
        .ariaLabel('Lucky day')
        .ok("Erneut versuchen");
      $mdDialog.show(confirm);
    }
  });

  let parameter = sharedParameter.getProperty();
  if(parameter.type !== ""){

    if(parameter.type === "videoId"){
      $state.go("men.video",{"video": {id: parameter.value}});
    }
    else if(parameter.type === "topicId"){
      $state.go("men.frage",{"topicId": parameter.value});
    }
  }
})

.controller('menPatientCtrl', ['$scope', '$stateParams',
function ($scope, $stateParams) {
}])

.controller('loginCtrl',
function ($scope, $ionicPlatform, AuthService, UserService, checkPlatform , sharedProperties , $state, $mdDialog, $location) {
  AuthService.logout();
  $scope.user = {
    email: '',
    password: ''
  };

  $ionicPlatform.ready(function () {
  $ionicPlatform.on("resume", function() {
    var path = $location.path();
    let sub = 'login';
    if(path.includes(sub)){
      $scope.checkForTouchID()
    }
  });

    $ionicPlatform.on("pause", function() {
      $scope.user.password = ''
      $scope.$apply()
    });
  });

  $scope.checkForTouchID = function () {
    $ionicPlatform.ready(function () {
      if (!checkPlatform.isBrowser()) {
        window.plugins.touchid.isAvailable(
          function (type) {
            let email = window.localStorage.getItem("email");
            let password = window.localStorage.getItem("password");

            if (email != null && email !== '') {
              window.plugins.touchid.verifyFingerprintWithCustomPasswordFallbackAndEnterPasswordLabel(
                'Fingerbdruck scannen!', // this will be shown in the native scanner popup
                'Manuell', // this will become the 'Enter password' button label
                function (msg) {
                  $scope.user.email = email;
                  $scope.user.password = password;
                  $scope.$apply()
                }, // success handler: fingerprint accepted
                function (msg) {
                  //alert('not ok: ' + JSON.stringify(msg))
                }); // error handler with errorcode and localised reason
            }
          }, // type returned to success callback: 'face' on iPhone X, 'touch' on other devices
          function (msg) {
            alert('not available, message: ' + JSON.stringify(msg))
          } // error handler: no TouchID available
        );
      }
    });
  };




  $scope.login = function (ev) {
    AuthService.login($scope.user).then(function (user) {

      window.localStorage.setItem("email", $scope.user.email);
      window.localStorage.setItem("password", $scope.user.password);

      UserService.refreshUser(user.userId).then(function (ruser) {
        sharedProperties.setProperty(ruser);
        if (ruser.role == "Doctor") {
          $state.go('men.home2');
        } else {
          $state.go('men.home');
        }
      }, function (errMsg) {
        if (!checkPlatform.isBrowser()) {
          navigator.notification.confirm(errMsg.data, function (buttonIndex) {
          }, "Server-Fehler", ["Erneut versuchen"]);
        } else {
          let confirm = $mdDialog.alert()
            .title('Server-Fehler')
            .textContent(errMsg.data)
            .ariaLabel('Lucky day')
            .targetEvent(ev)
            .ok("Erneut versuchen");
          $mdDialog.show(confirm);
        }
      });
    }, function (errMsg) {
      if (!checkPlatform.isBrowser()) {
        navigator.notification.confirm("Bitte Benutznamen und Passwort überprüfen.", function (buttonIndex) {
        }, "Benutzer-Fehler (1M)", ["Erneut versuchen"]);
      } else {
        let confirm = $mdDialog.alert()
          .title('Benutzer-Fehler (1B)')
          .textContent("Bitte Benutznamen und Passwort überprüfen.")
          .ariaLabel('Lucky day')
          .targetEvent(ev)
          .ok("Erneut versuchen");
        $mdDialog.show(confirm).then(function () {
          console.log("Dialog shown...")
        });
      }
    });
  };

    // When button is clicked, the popup will be shown...
  $scope.showPopup = function(ev) {
    if ( !checkPlatform.isBrowser() ) {
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

      if ( !checkPlatform.isBrowser() ) {
        navigator.notification.confirm("Registrierung erfolgreich! (Patient)", function(buttonIndex) {
          $state.go('login');
        }, "Erfolg", [ "Okay"]);
      } else {
        var confirm = $mdDialog.alert()
          .title('Erfolg')
          .textContent('Registrierung erfolgreich! (Patient)')
          .ariaLabel('Lucky day')
          .ok("Okay");
        $mdDialog.show(confirm).then(function() {
          $state.go('login');
        });
      }
    }, function(errMsg) {
      if ( !checkPlatform.isBrowser() ) {
        navigator.notification.confirm(errMsg.data.error, function(buttonIndex) {}, "Fehler (Patient)", ["Erneut versuchen"]);
      } else {
        let confirm = $mdDialog.alert()
          .title('Fehler (Patient)')
          .textContent(errMsg.data.error)
          .ariaLabel('Lucky day')
          .ok("Erneut versuchen");
        $mdDialog.show(confirm);
      }
    });
  };
})

.controller('registrierenArztCtrl',
function($scope, AuthService,checkPlatform, sharedProperties, $state, $mdDialog) {

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
      if ( !checkPlatform.isBrowser() ) {
        navigator.notification.confirm("Registrierung erfolgreich! (Arzt)", function(buttonIndex) {
          $state.go('login');
        }, "Erfolg", [ "Okay"]);
      } else {
        var confirm = $mdDialog.alert()
          .title('Erfolg')
          .textContent('Registrierung erfolgreich! (Arzt)')
          .ariaLabel('Lucky day')
          .ok("Okay");
        $mdDialog.show(confirm).then(function() {
          $state.go('login');
        });
      }
    }, function(errMsg) {
      if ( !checkPlatform.isBrowser() ) {
        navigator.notification.confirm(errMsg.data.error, function(buttonIndex) {}, "Fehler (Arzt)", ["Erneut versuchen"]);
      } else {
        let confirm = $mdDialog.alert()
          .title('Fehler (Arzt)')
          .textContent(errMsg.data.error)
          .ariaLabel('Lucky day')
          .ok("Erneut versuchen");
        $mdDialog.show(confirm);
      }
    });
  };
})

.controller('arztCtrl', ['$scope', '$stateParams',
function ($scope, $stateParams) {
}])

.controller('videosCtrl', function ($scope, $stateParams, VideoService,checkPlatform, sharedProperties, $cordovaDialogs, $ionicLoading) {
  $ionicLoading.show();
  VideoService.videos().then(function(videos){

    $scope.videos = videos;
    $ionicLoading.hide();

  }, function(errMsg) {
    $ionicLoading.hide();
    if ( !checkPlatform.isBrowser() ) {
      navigator.notification.confirm(errMsg.statusText, function(buttonIndex) {}, "Video-Fehler", ["Erneut versuchen"]);
    } else {
      let confirm = $mdDialog.alert()
        .title('Video-Fehler')
        .textContent(errMsg.statusText)
        .ariaLabel('Lucky day')
        .ok("Erneut versuchen");
      $mdDialog.show(confirm);
    }
  });
})

.controller('videoCtrl',function ($scope, $stateParams, VideoService,checkPlatform, sharedProperties, sharedParameter, $cordovaDialogs, $ionicLoading) {

  sharedParameter.setProperty("");
  $ionicLoading.show();
  let video = $stateParams.video;

  VideoService.videoById(video.id).then(function(video){

    $scope.video = video;
    $scope.getIframeSrc = function (videoTitle) {
      return 'http://pinkisworld.ddnss.de/api/video/' + videoTitle;
    };

    $scope.share = function(){
      navigator.share("NewMed Video-Link: http://newmeddhbw.app.link?videoId=" + video.id,"Diese Frage teilen","plain/text")

    };

    $ionicLoading.hide();

  }, function(errMsg) {
    $ionicLoading.hide();
    if ( !checkPlatform.isBrowser() ) {
      navigator.notification.confirm(errMsg.statusText, function(buttonIndex) {}, "Video-Fehler", ["Erneut versuchen"]);
    } else {
      let confirm = $mdDialog.alert()
        .title('Video-Fehler')
        .textContent(errMsg.statusText)
        .ariaLabel('Lucky day')
        .ok("Erneut versuchen");
      $mdDialog.show(confirm);
    }
  });
})

.controller('frageCtrl', function ($scope, $stateParams,sharedParameter, checkPlatform, sharedProperties, TopicService, $cordovaDialogs, $mdDialog) {

  sharedParameter.setProperty("");
  let topicId = $stateParams.topicId;
  $scope.myTopicId = topicId;

  TopicService.topic(topicId).then(function(topicEntry) {
    $scope.topicEntries = topicEntry.entries
    $scope.topicTitle = topicEntry.title
  }, function(errMsg) {
    if ( !checkPlatform.isBrowser() ) {
      navigator.notification.confirm(errMsg.statusText, function(buttonIndex) {}, "Topic-Fehler", ["Erneut versuchen"]);
    } else {
      let confirm = $mdDialog.alert()
        .title('Topic-Fehler')
        .textContent(errMsg.statusText)
        .ariaLabel('Lucky day')
        .ok("Erneut versuchen");
      $mdDialog.show(confirm);
    }
  });
})

.controller('fragenCtrl',
function ($scope, checkPlatform, TopicService, $mdDialog, $ionicLoading) {

  $ionicLoading.show();
  TopicService.topics().then(function(topics) {
    if (topics.length == 0) {
      $scope.show = false;
    } else {
      $scope.entries = topics;
      $scope.show = true;
    }
    $ionicLoading.hide();

    $scope.share = function (id) {
      navigator.share("NewMed Fragen-Link: http://newmeddhbw.app.link?topicId=" + id,"Diese Frage teilen","plain/text")
    }



  }, function(errMsg) {
    $ionicLoading.hide()
    if ( !checkPlatform.isBrowser() ) {
      navigator.notification.confirm(errMsg.statusText, function(buttonIndex) {}, "Topic-Fehler", ["Erneut versuchen"]);
    } else {
      let confirm = $mdDialog.alert()
        .title('Topic-Fehler')
        .textContent(errMsg.statusText)
        .ariaLabel('Lucky day')
        .ok("Erneut versuchen");
      $mdDialog.show(confirm);
    }
  });
})

  .controller('frageNeuCtrl',
    function ($scope, $stateParams,$state,checkPlatform, sharedProperties, TopicService, $cordovaDialogs, $mdDialog) {
      $scope.topic = {
        title: '',
        message: ''
      };

    $scope.addTopic = function() {

        TopicService.addTopic($scope.topic).then(function(topics) {
          $state.go('men.fragen');

        }, function(errMsg) {
          if ( !checkPlatform.isBrowser() ) {
            navigator.notification.confirm(errMsg.statusText, function(buttonIndex) {}, "Topic-Fehler", ["Erneut versuchen"]);
          } else {
            let confirm = $mdDialog.alert()
              .title('Topic-Fehler')
              .textContent(errMsg.statusText)
              .ariaLabel('Lucky day')
              .ok("Erneut versuchen");
            $mdDialog.show(confirm);
          }
        });
      }
    })

  .controller('frageEintragNeuCtrl',
    function ($scope, $stateParams, checkPlatform, TopicService, $mdDialog, $ionicHistory) {
      $scope.entry = {
        topicId: $stateParams.topicId,
        message: ''
      };

      $scope.addTopicEntry = function() {

        TopicService.addTopicEntry($scope.entry.topicId, $scope.entry.message).then(function(topics) {
          $ionicHistory.goBack()
        }, function(errMsg) {
          if ( !checkPlatform.isBrowser() ) {
            navigator.notification.confirm(errMsg.statusText, function(buttonIndex) {}, "AddTopicEntry-Fehler", ["Erneut versuchen"]);
          } else {
            let confirm = $mdDialog.alert()
              .title('AddTopicEntry-Fehler')
              .textContent(errMsg.statusText)
              .ariaLabel('Lucky day')
              .ok("Erneut versuchen");
            $mdDialog.show(confirm);
          }
        });
      }
    })

  .controller('sucheCtrl',
    function ($scope, checkPlatform, SearchService, $ionicLoading, $mdDialog) {

      $scope.search = {
        text: ""
      }

      $scope.search = function() {

        $ionicLoading.show()
        let searchObj= {
          searchTerm: $scope.search.text
        }
        SearchService.search(searchObj).then(function(results){

        $scope.topics = results.topics;
        $scope.videos = results.videos,




        $ionicLoading.hide()
        }, function(errMsg) {
          $ionicLoading.hide()
          if ( !checkPlatform.isBrowser() ) {
            navigator.notification.confirm(errMsg.statusText, function(buttonIndex) {}, "Search-Fehler", ["Erneut versuchen"]);
          } else {
            let confirm = $mdDialog.alert()
              .title('Search-Fehler')
              .textContent(errMsg.statusText)
              .ariaLabel('Lucky day')
              .ok("Erneut versuchen");
            $mdDialog.show(confirm);
          }
        })
      };
    })

  .controller('suchergebnisCtrl', ['$scope', '$stateParams',
    function ($scope, $stateParams) {
    }])

  .controller('patientCtrl',
    function ($scope, $stateParams, UserService, TopicService,  checkPlatform,  $state, $mdDialog, $ionicLoading) {

    $scope.userId = $stateParams.userId;

      $ionicLoading.show()
      UserService.getUserById($scope.userId).then(function(user) {
        $scope.user = user;
        $scope.entries = user.entries;
        $scope.topics = [];
        $scope.illnames = [];
        let date = new Date($scope.user.dateOfBirth);
        $scope.datefor = date.toLocaleDateString("de");

        for(i=0;i<$scope.user.illnesses.length;i++) {
          $scope.illnames.push($scope.user.illnesses[i].name);
        }
        if ($scope.illnames.length == 0) {
          $scope.illnesses = "Keine Befunde"
        } else {
          $scope.illnesses = $scope.illnames.toString();
        }

        //2 neusten Tagebucheinträge
        $scope.diaryEntries = $scope.user.diaryEntries.slice();
        $scope.diaryEntries.reverse();

        //Forumseinträge des Patienten
        for(i=0;i<$scope.entries.length;i++) {
          TopicService.topic($scope.entries[i].topicId).then(function(topic) {
            if ($scope.topics.filter(e => e.topicId === topic.topicId).length == 0) {
              $scope.topics.push(topic)
            }
          }, function(errMsg) {
            console.log(errMsg);
          });
          $ionicLoading.hide()

        }
        $ionicLoading.hide()
      }, function(errMsg) {

        $ionicLoading.hide()
        if ( !checkPlatform.isBrowser() ) {
          navigator.notification.confirm(errMsg.statusText, function(buttonIndex) {}, "User-Fehler", ["Erneut versuchen"]);
        } else {
          let confirm = $mdDialog.alert()
            .title('User-Fehler')
            .textContent(errMsg.statusText)
            .ariaLabel('Lucky day')
            .ok("Erneut versuchen");
          $mdDialog.show(confirm);
        }
      });
    })

  .controller('tagebuchCtrl',
    function ($scope, $stateParams, UserService, sharedProperties, $ionicLoading) {

      $ionicLoading.show();
      $scope.user = sharedProperties.getProperty();
        if ($scope.user.role == 'Doctor') {
          $scope.show = false;
        } else {
          $scope.show = true;
        }

      let userId = $stateParams.userId;

      UserService.getUserById(userId).then(function(user) {
        $scope.user = user;
        $scope.diaryEntries = $scope.user.diaryEntries.slice();
        $scope.diaryEntries.reverse();
        $ionicLoading.hide();
      });
    })

  .controller('neuTagebuchCtrl',
    function ($scope, sharedProperties, DiaryService, UserService, checkPlatform , $ionicHistory, $mdDialog) {

    $scope.diaryEntry = {
        title: '',
        message: '',
        status: ''
      };

      $scope.create = function(ev) {
        DiaryService.diary($scope.diaryEntry).then(function(user) {
          if (user) {
            UserService.refreshUser(user.userId).then(function(ruser) {
            sharedProperties.setProperty(ruser);
            $ionicHistory.goBack();
          }, function(errMsg) {

            if ( !checkPlatform.isBrowser() ) {
              navigator.notification.confirm(errMsg.statusText, function(buttonIndex) {}, "Server-Fehler", ["Erneut versuchen"]);
            } else {
              let confirm = $mdDialog.alert()
                .title('Server-Fehler')
                .textContent(errMsg.statusText)
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok("Erneut versuchen");
              $mdDialog.show(confirm);
            }
        });
          }
        }, function(errMsg) {

          if ( !checkPlatform.isBrowser() ) {
            navigator.notification.confirm(errMsg.statusText, function(buttonIndex) {}, "Diary-Fehler", ["Erneut versuchen"]);
          } else {
            let confirm = $mdDialog.alert()
              .title('Diary-Fehler')
              .textContent(errMsg.statusText)
              .ariaLabel('Lucky day')
              .ok("Erneut versuchen");
            $mdDialog.show(confirm);
          }
        });
      };
    })

    .controller('menCtrl',
      function ($scope, sharedProperties, $state) {

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

  .controller('home2Ctrl', function ($scope, sharedProperties,sharedParameter, $state, VideoService, TopicService, $mdDialog, checkPlatform, UserService, $ionicLoading) {

      $ionicLoading.show();
      $scope.user = sharedProperties.getProperty();
      UserService.refreshUser($scope.user.userId).then(function (ruser) {
        sharedProperties.setProperty(ruser);
        $scope.user = sharedProperties.getProperty();
      });

      TopicService.topics().then(function(topics) {
        $scope.entries = topics;
        $ionicLoading.hide();

      }, function(errMsg) {
        $ionicLoading.hide();
        if (!checkPlatform.isBrowser() ) {
          navigator.notification.confirm(errMsg.statusText, function(buttonIndex) {}, "Topic-Fehler", ["Erneut versuchen"]);
        } else {
          let confirm = $mdDialog.alert()
            .title('Topic-Fehler')
            .textContent(errMsg.statusText)
            .ariaLabel('Lucky day')
            .ok("Erneut versuchen");
          $mdDialog.show(confirm);
        }
      });


      VideoService.videos().then(function(videos){

        $scope.videos = videos;
        $ionicLoading.hide();

      }, function(errMsg) {
        $ionicLoading.hide();
        if ( !checkPlatform.isBrowser() ) {
          navigator.notification.confirm(errMsg.statusText, function(buttonIndex) {}, "Video-Fehler", ["Erneut versuchen"]);
        } else {
          let confirm = $mdDialog.alert()
            .title('Video-Fehler')
            .textContent(errMsg.statusText)
            .ariaLabel('Lucky day')
            .ok("Erneut versuchen");
          $mdDialog.show(confirm);
        }
      });



      $scope.upload = function() {
        if (!checkPlatform.isBrowser()) {
          navigator.camera.getPicture(onSuccess, onFail, {
            quality: 75,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            mediaType: Camera.MediaType.VIDEO
          });

          function onSuccess(imageURI) {


            function onPrompt(results) {
              alert("You selected button number " + results.buttonIndex + " and entered " + results.input1);
            }

            navigator.notification.prompt(
              'Bitte einen Titel eingeben:',  // message
              function (results) {

                if(results.buttonIndex === 1){
                  var blob = null
                  var xhr = new XMLHttpRequest()
                  xhr.open("GET", imageURI)
                  xhr.responseType = "blob"
                  xhr.onload = function()
                  {
                    blob = xhr.response
                    VideoService.uploadVideo(blob, results.input1);
                  }
                  xhr.send()
                }
              },                  // callback to invoke
              'Titel',            // title
              ['Fertig','Abbrechen'],             // buttonLabels
              ''                 // defaultText
            );



          }

          function onFail(message) {
            alert('Failed because: ' + message);
          }

        }
      };

    let parameter = sharedParameter.getProperty();
    if(parameter.type !== ""){

      if(parameter.type === "videoId"){
        $state.go("men.video",{"video": {id: parameter.value}});
      }
      else if(parameter.type === "topicId"){
        $state.go("men.frage",{"topicId": parameter.value});
      }
    }

    })

  .controller('patientenCtrl', function ($scope, sharedProperties, UserService, $ionicLoading) {
    $ionicLoading.show();
    $scope.user = sharedProperties.getProperty();
    UserService.refreshUser($scope.user.userId).then(function (ruser) {
      sharedProperties.setProperty(ruser);
      $scope.user = sharedProperties.getProperty();
      $ionicLoading.hide()
    });

  })

  .controller('neuenPatientenZuweisenCtrl',
    function ($scope, $state ,UserService, checkPlatform, $mdDialog, $ionicLoading) {

    $scope.resultUser = [];
    $scope.search = {
      string: ""
    };

      $scope.searchUser = function() {
        $scope.resultUser = [];

        UserService.searchUser($scope.search.string).then(function(ruser) {
          $scope.resultUser.push(ruser)
        }, function(errMsg) {

          if ( !checkPlatform.isBrowser() ) {
            navigator.notification.confirm(errMsg.data.error, function(buttonIndex) {}, "Such-Fehler", ["Erneut versuchen"]);
          } else {
            let confirm = $mdDialog.alert()
              .title('Such-Fehler')
              .textContent(errMsg.data.error)
              .ariaLabel('Lucky day')
              .targetEvent()
              .ok("Erneut versuchen");
            $mdDialog.show(confirm);
          }
        });
      };

      $scope.addUser = function(user){
        if ( !checkPlatform.isBrowser() ) {
          navigator.notification.confirm("Möchten Sie " + user.firstName +  user.lastName + " zu Ihren Patienten hinzufügen?" , function(buttonIndex) {
            switch(buttonIndex) {
              case 1:
                $ionicLoading.show();
                UserService.addUserToUser(user.userId).then(function(myUser) {
                  $ionicLoading.hide();
                  $state.go('men.home2');
                }, function(errMsg) {
                  $ionicLoading.hide();
                  navigator.notification.confirm(errMsg.data.error, function(buttonIndex) {}, "AddUser-Fehler", ["Erneut versuchen"]);
                });
                break;
              case 2:
                console.log("Cancel")
                break;
            }
          }, "Hinzufügen", [ "Ja", "Nein"]);
        } else {
          var confirm = $mdDialog.confirm()
            .title('Hinzufügen')
            .textContent("Möchten Sie " + user.firstName +  user.lastName + " zu Ihren Patienten hinzufügen?")
            .ariaLabel('Lucky day')
            .ok("Ja")
            .cancel("Nein");

          $mdDialog.show(confirm).then(function() {
            $ionicLoading.show();
            UserService.addUserToUser(user.userId).then(function(myUser) {
              $ionicLoading.hide();
              $state.go('men.home2');
            }, function(errMsg) {
              $ionicLoading.hide();
                let confirm = $mdDialog.alert()
                  .title('AddUser-Fehler')
                  .textContent(errMsg.data.error)
                  .ariaLabel('Lucky day')
                  .ok("Erneut versuchen");
                $mdDialog.show(confirm);
            });
          }, function() {
            console.log("Cancel")
          });
        }
      }
    })

  .controller('accountCtrl',
    function ($scope, $state, sharedProperties, checkPlatform, $mdDialog, UserService, $ionicLoading) {

      $ionicLoading.show()
      $scope.user = sharedProperties.getProperty();
      UserService.refreshUser($scope.user.userId).then(function (ruser) {
        sharedProperties.setProperty(ruser);
        $scope.user = sharedProperties.getProperty();
        $scope.date = new Date($scope.user.dateOfBirth);
      })
        $scope.date = new Date($scope.user.dateOfBirth);
        $ionicLoading.hide()

      $scope.save = function() {

        UserService.updateUser($scope.user).then(function(user) {
         sharedProperties.setProperty(user);
          if ( !checkPlatform.isBrowser() ) {
            navigator.notification.confirm("Update erfolgreich!", function(buttonIndex) {
          }, "Erfolg", [ "Okay"]);
          } else {
           var confirm = $mdDialog.alert()
              .title('Erfolg')
              .textContent('Update erfolgreich!')
              .ariaLabel('Lucky day')
              .ok("Okay");
            $mdDialog.show(confirm);
          }
          }, function(errMsg) {
            if ( !checkPlatform.isBrowser() ) {
              navigator.notification.confirm(errMsg.statusText, function(buttonIndex) {}, "Fehler", ["Erneut versuchen"]);
            } else {
              let confirm = $mdDialog.alert()
              .title('Fehler')
              .textContent(errMsg.statusText)
              .ariaLabel('Lucky day')
              .ok("Erneut versuchen");
              $mdDialog.show(confirm);
            }
        });
      };

      $scope.delete = function(ev) {

          if ( !checkPlatform.isBrowser() ) {
            navigator.notification.confirm("Wollen Sie wirklich löschen?", function(buttonIndex) {
              switch(buttonIndex) {
                case 1:
                UserService.deleteUser().then(function(msg) {
                  navigator.notification.confirm("Löschen erfolgreich!", function(buttonIndex) {
                  }, "Erfolg", [ "Okay"]);
                  $state.go('login');
                }, function(errMsg) {
                  navigator.notification.confirm(errMsg.statusText, function(buttonIndex) {}, "Fehler", ["Erneut versuchen"]);
                })
                  break;
                case 2:
                  break;
              }
            }, "Löschen bestätigen", [ "Ja", "Nein"]);
          } else {
            var confirm = $mdDialog.confirm()
              .title('Löschen bestätigen')
              .textContent('Wollen Sie wirklich löschen?')
              .ariaLabel('Lucky day')
              .targetEvent(ev)
              .ok("Ja")
              .cancel("Nein");
            $mdDialog.show(confirm).then(function() {
              UserService.deleteUser().then(function(msg) {
                var confirm = $mdDialog.alert()
                    .title('Erfolg')
                    .textContent('Löschen erfolgreich!')
                    .ariaLabel('Lucky day')
                    .ok("Okay");
                  $mdDialog.show(confirm);
                  $state.go('login');
              }, function(errMsg) {
                let confirm = $mdDialog.alert()
                .title('Fehler')
                .textContent(errMsg.statusText)
                .ariaLabel('Lucky day')
                .ok("Erneut versuchen");
                $mdDialog.show(confirm);
              })
            }, function() {
            });
          }
      };
  })

  .controller('AppCtrl',

function($scope, $state, $ionicPopup, AuthService, AUTH_EVENTS, $location) {
    var path = $location.path();
    $scope.options = $scope.options || {};
    if (path === "")
      $scope.options.hideBackButton = true;
    else
      $scope.options.hideBackButton = false;

  if(!$scope.$$phase) {
    $scope.$apply()
  }

    $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
      AuthService.logout();
      $state.go('login');
      var alertPopup = $ionicPopup.alert({
        title: 'Session Lost!',
        template: 'Sorry, You have to login again.'
      });
    });
  })
