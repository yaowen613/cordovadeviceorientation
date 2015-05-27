// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ngCordova'])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.controller('cordovaDeviceOrientationCtrl',function($scope,$ionicPlatform,$cordovaDeviceOrientation){
  $scope.img = {src:"img/compass.jpg",rotate:90};
  $scope.autoHeading = true;
  $scope.watch = null;
  $scope.options = {
          frequency: 300,  //每隔300毫秒获取一次方向。
          filter: true      //
        }
  $ionicPlatform.ready(function() {
    $scope.getHeading = function(){
      if(!$scope.autoHeading){
        $cordovaDeviceOrientation
        .getCurrentHeading()
        .then(function(result) {
             $scope.img.rotate = Math.floor(result.magneticHeading);
             var trueHeading = result.trueHeading;
             var accuracy = result.headingAccuracy;
             var timeStamp = result.timestamp;
            }, function(err) {
          });
      }else{
        if($scope.watch!=null){
          watch.clearWatch();
          alert("clear watch");
        }
        $scope.watch = $cordovaDeviceOrientation.watchHeading($scope.options).then(
          null,
          function(error) {
            alert(error);
          },
          function(result) {   
            $scope.img.rotate = Math.floor(result.magneticHeading);
            var trueHeading = result.trueHeading;
            var accuracy = result.headingAccuracy;
            var timeStamp = result.timestamp;
            alert("add watch ok");
          });
      }
    }
  });
})

.controller('cordovaDeviceMotionCtrl', function($scope,$cordovaDeviceMotion,$ionicPlatform){
  $scope.indexmax =0;
  $scope.changes={x:0,y:0,z:0,index:0};
  $scope.previousReading = {x:0,y:0,z:0,index:0};
  $scope.options = { frequency: 200 };
  $ionicPlatform.ready(function() {
  $scope.watch = $cordovaDeviceMotion.watchAcceleration($scope.options);
  $scope.watch.then(
      null,
      function(error) {
      // An error occurred
      },
      function(result) {
      if($scope.previousReading.x !== null){   
        $scope.changes.x = Math.abs($scope.previousReading.x - result.x);
        $scope.changes.y = Math.abs($scope.previousReading.y - result.y);
        $scope.changes.z = Math.abs($scope.previousReading.z - result.z);    
        $scope.changes.index = $scope.changes.x + $scope.changes.y +$scope.changes.z;
        if($scope.changes.index > $scope.indexmax) {
          $scope.indexmax = $scope.changes.index;
        }
      }   
      $scope.previousReading = { x: result.x, y: result.y, z: result.z}     
    });
  })
})
