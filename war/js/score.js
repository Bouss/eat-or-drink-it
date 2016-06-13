'use strict';

var score = angular.module('score', []);

/**
 * Controllers
 */
score.controller('ScoreCtrl', ['$scope', '$window', '$location', 'playerService', function($scope, $window, $location, playerService) {
  $scope.scores = [];
  $scope.orderProp = '-score';
  $scope.quantity = 10;

  $window.init = function() {
    console.log("windowinit called");
    $scope.$apply($scope.loadScoreentityendpointLib);
  };

  /**
   * Loads the Score API
   */
  $scope.loadScoreentityendpointLib = function() {
    gapi.client.load('scoreentityendpoint', 'v1', function() {
      console.log("score api loaded");
      $scope.isBackendReady = true;
      $scope.listScores();
    }, 'https://eat-or-drink-it.appspot.com/_ah/api');
  };
  
  /**
   *  Gets all the scores stored from the Datastore
   */
  $scope.listScores = function() {
    gapi.client.scoreentityendpoint.listScoreEntity().execute(function(resp) {
      $scope.scores = resp.items;
      $scope.$apply();
      console.log(resp);
    });
  };
   
  /**
   * Sets the player's pseudo and redirects to a new game
   */
  $scope.play = function(pseudo) {
  	playerService.setPseudo(pseudo);
    $location.path('/game');
  }
  
}]);

/**
 * Services
 */
score.service('scoreService', function() {

  /**
   * Inserts a score in the Datastore
   */
  this.insertScore = function(score) {
    gapi.client.scoreentityendpoint.insertScoreEntity(score).execute(function(resp) {
      console.log(resp);
    });
  }
  
});
