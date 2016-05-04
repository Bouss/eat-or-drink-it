'use strict';

var score = angular.module('score', []);

score.controller('ScoreCtrl', ['$scope', '$window', function($scope, $window) {
  $scope.scores = [];

  $window.init = function() {
    console.log("windowinit called");
    $scope.$apply($scope.loadScores);
  };

  /**
   *  Loads the scores via the API
   */
  $scope.loadScores = function() {
    gapi.client.load('scoreentityendpoint', 'v1', function() {
      console.log("score api loaded");
      $scope.isBackendReady = true;
      $scope.listScores();
    }, 'https://eat-or-drink-it.appspot.com/_ah/api');
  };
  
  $scope.listScores = function() {
    gapi.client.scoreentityendpoint.listScoreEntity().execute(function(resp) {
      $scope.scores = resp.items;
      $scope.$apply();
      console.log(resp);
    });
  };
    
}]);
