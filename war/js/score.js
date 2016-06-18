'use strict';

var score = angular.module('score', []);

/**
 * Services
 */
score.service('scoreService', function() {

  /**
   *  Gets all the scores stored from the Datastore
   */
  this.listScores = function(scope) {
    gapi.client.scoreentityendpoint.listScoreEntity().execute(function(resp) {
      scope.scores = resp.items;
      scope.$apply();
      console.log(resp);
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
