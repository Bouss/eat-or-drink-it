'use strict';

var aoc = angular.module('aoc', []);

/**
 * Controllers
 */
aoc.controller('AocCtrl', ['$scope', '$location', '$http', 'answerValues', 'resultService', 'scoreService', function($scope, $location, $http, answerValues, resultService, scoreService) {
  var aocs = $scope.aocs = data;
  $scope.index = 0;
  $scope.answerValues = answerValues;

  // Sets the Google map
  $scope.map = {
    center: {latitude: 46.8463196,longitude: 1.5732156},
    zoom: 5,
    markers: [],
    events: {
      click: function (map, eventName, originalEventArgs) {
        var e = originalEventArgs[0];
        var lat = e.latLng.lat();
        var lng = e.latLng.lng();
        var marker = {
          id: Date.now(),
          coords: {latitude: lat, longitude: lng}
        };
        $scope.map.markers.pop();
        $scope.map.markers.push(marker);
        
        // Gets the zip code of the marker by sending a request to Google Maps Geocoding API
        $http.get('https://maps.googleapis.com/maps/api/geocode/json', {params: {latlng: lat + ',' + lng}})
          .then(function(resp) {
            $scope.zipCodeAnswer = resp.data.results[2].address_components[0].short_name;
            console.log($scope.zipCodeAnswer);
          }, function(error) {
            console.log(error);
          });
        $scope.$apply();
      }
    }
  };
  
  // Sets the Google map too
  $scope.options = {
    disableDefaultUI: true,
    disableDoubleClickZoom: true,
    draggable: false
  };

  // Resets previous results when starting a new game
  resultService.resetResults();

  /**
   * Checks the answer given and adds it into results
   */
  $scope.addAnswer = function(answer) {
    var q1Res = (answer.questionAnswer == aocs[$scope.index].answer) ? 1 : 0;
    var q2Res = (answer.zipCodeAnswer.toString().substr(0,2) == aocs[$scope.index].zipCode.toString().substr(0,2)) ? 1 : 0;
    
    resultService.addResult(
    		{
    			aocName:				 aocs[$scope.index].name,
    			question1Result: q1Res,
    			question2Result: q2Res,
    			points:					 q1Res + q2Res
				}
		);

    // Resets the previous answer given
    $scope.questionAnswer = null;
    $scope.map.markers.pop();

  	// Next question
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
        name: "Toto",
        score: points
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
  {id: 1, name: 'Muscadet', answer: 1, zipCode: 44003, department: 'LOIRE-ATLANTIQUE'},
  {id: 2, name: 'Camembert de Normandie', answer: 0, zipCode: 14001, department: 'CALVADOS'},
  {id: 3, name: 'Coteaux du Lyonnais', answer: 1, zipCode: 69021, department: 'RHONE'},
  {id: 4, name: 'Ossau-Iraty', answer: 0, zipCode: 65018, department: 'HAUTES-PYRENEES'},
  {id: 5, name: 'Maroilles', answer: 0, zipCode: 59003, department: 'NORD'}
];
