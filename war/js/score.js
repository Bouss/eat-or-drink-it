'use strict';

var score = angular.module('score', []);

score.controller('ResultCtrl', ['$scope', 'resultService', function($scope, resultService) {
  $scope.results = resultService.getResults();
  $scope.score = resultService.getScore();
}]);

/**
 * Services
 */
score.service('scoreService', function() {

  /**
   *  Gets the 10 best scores from the Datastore
   */
  this.listScores = function(homeCtrlScope) {
  	
    gapi.client.scoreentityendpoint.listScoreEntity({"limit": 10}).execute(function(resp) {
      console.log(resp);
      homeCtrlScope.scores = resp.items;
      homeCtrlScope.$apply();
    });
  };
	
  /**
   * Inserts a score in the Datastore
   */
  this.insertScore = function(score) {
    gapi.client.scoreentityendpoint.insertScoreEntity(score).execute(function(resp) {
      console.log(resp);
    });
  }
  
});

score.service('resultService', function() {
  this.results = [];

  this.resetResults = function() {
    this.results = [];
  };

  this.addResult = function(result) {
    this.results.push(result);
  };

  this.getResults = function() {
    return this.results;
  };
  
  this.getScore = function() {
    var score = 0;

    for (var i = 0; i < this.results.length; i++) {
    	score += this.results[i].points;
    }
    
    return score;
  }
});
