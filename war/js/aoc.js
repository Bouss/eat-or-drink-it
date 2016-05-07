'use strict';

var aoc = angular.module('aoc', []);

/**
 * Controllers
 */
aoc.controller('AocCtrl', ['$scope', '$location', 'answerValues', 'resultService', 'scoreService', function($scope, $location, answerValues, resultService, scoreService) {
  var aocs = $scope.aocs = data;
  $scope.index = 0;
  $scope.answerValues = answerValues;

  // Resets previous results when starting a new game
  resultService.resetResults();

  /**
   * Checks the answer given and adds it into results
   */
  $scope.addAnswer = function(answer) {
    resultService.addResult(
    		{
    			aocName:				 aocs[$scope.index].name,
    			question1Result: (answer.question1 == aocs[$scope.index].answer),
    			question2Result: true,
    			points:					 (answer.question1 == aocs[$scope.index].answer) ? 1 : 0
				}
		);

    $scope.index++;
    
    // When the game ends, saves the score and redirects to "/results"
    if ($scope.index >= data.length) {
      $scope.insertScore();
    	$location.path("/results");
    }
  };
  
  /**
   * Inserts the score gotten from the results into the Datastore
   */
  $scope.insertScore = function() {
    var results = resultService.getResults();
    var points = 0;
    
    angular.forEach(results, function(value, key) {
      points += parseInt(value.points);
    });
    
    scoreService.insertScore(
      {
        "name": "Toto",
        "score": points
      }
    );
  };
}]);

aoc.controller('ResultCtrl', ['$scope', 'resultService', function($scope, resultService) {
  $scope.results = resultService.getResults();
}]);

/**
 * Services
 */
aoc.service('resultService', function() {
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
});

/**
 * Fixtures
 */
var data = [
  {id: 1, name: 'Camembert', answer: 0, geo:"46.5, 42.7"},
  {id: 2, name: 'Muscadet',  answer: 1, geo:"0, 0"},
  {id: 3, name: 'Bière',		 answer: 1, geo:"0, 0"}
];
