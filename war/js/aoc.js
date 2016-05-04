'use strict';

var aoc = angular.module('aoc', []);

/**
 * Controllers
 */
aoc.controller('AocCtrl', ['$scope', '$location', 'answerValues', 'resultService', function($scope, $location, answerValues, resultService) {
  var aocs = $scope.aocs = data;
  $scope.index = 0;
  $scope.answerValues = answerValues;

  // Resets previous results when starting a game
  resultService.resetResults();

  // Checks the answer given and adds it into results
  $scope.addAnswer = function(answer) {
    resultService.addResult(
    		{
    			aocName:				 aocs[$scope.index].name,
    			question1Result: (answer.question1 == aocs[$scope.index].answer),
    			question2Result: true,
    			score:					 (answer.question1 == aocs[$scope.index].answer) ? 1 : 0
				}
		);

    $scope.index++;
    
    // Redirects to "/results" when the game ends
    if ($scope.index >= data.length) {
    	$location.path("/results");
    }
  };
  
}]);

aoc.controller('ResultCtrl', ['$scope', 'resultService', function($scope, resultService) {
  $scope.results = resultService.getResults();
}]);

/**
 * Services
 */
aoc.service('resultService', function() {
  var results = [];

  var resetResults = function() {
    results = [];
  };

  var addResult = function(result) {
    results.push(result);
  };

  var getResults = function() {
    return results;
  };

  return {
    resetResults: resetResults,
    addResult: addResult,
    getResults: getResults
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
