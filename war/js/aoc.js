'use strict';

var aoc = angular.module('aoc', []);

/**
 * Controllers
 */
aoc.controller('AocCtrl', ['$scope', '$location', '$http', 'answerValues', 'distancePointsValues', 'resultService', 'scoreService', 'locationService', function($scope, $location, $http, answerValues, distancePointsValues, resultService, scoreService, locationService) {
  var aocs = $scope.aocs = data;
  $scope.index = 0;
  $scope.answerValues = answerValues;

  // Resets previous results when starting a new game
  resultService.resetResults();
  
  // Initializes the Google map
  initMap();

  /**
   * Checks the answer given and adds it into results
   */
  $scope.addAnswer = function(answer) {
    var aoc = aocs[$scope.index];
    var q1Res = (answer.questionAnswer == aoc.answer) ? 1 : 0;
    var q2Res = 0;

    // Gets the location of the AOC
    $http.get('https://maps.googleapis.com/maps/api/geocode/json', {params: {address: aoc.city + '+' + aoc.zipCode}})
      .then(function(resp) {
        var aocLocation = resp.data.results[0].geometry.location;

        // Calculates the distance (rounded) between the real AOC's location and the location given by the player
        var q2Distance = Math.round(locationService.getDistance(aocLocation, answer.locationAnswer));
        
        // Assigns points according to the distance
        for (var i = 0; i <= distancePointsValues.length-1; i++) {
        	var distancePoints = distancePointsValues[i];
        	if (q2Distance <= distancePoints.distance) {
        		q2Res = distancePoints.points;
        		break;
        	}
        }
        
        resultService.addResult(
          {
    			  aocName:				 	 aoc.name,
    			  question1Result:	 q1Res,
    			  question2Result:	 q2Res,
    			  question2Distance: q2Distance,
    			  points:					 	 q1Res + q2Res
				  }
				);
      }, function(error) {
        console.log(error);
      }
    );
    
    // Resets the answer given (on the view)
    $scope.questionAnswer = null;
    $scope.map.markers.pop();
    
  	// Next question
    $scope.index++;
    
    // When the game ends, saves the score and redirects to "/results"
    if ($scope.index >= data.length) {
      insertScore();
    	$location.path("/results");
    }
  };
  
  /**
   * "Private" method - Inserts the score gotten from the results into the Datastore
   */
  function insertScore() {
    var score = resultService.getScore();
  	
    scoreService.insertScore(
      {
        name: "Titi",
        score: score
      }
    );
  };
  
  /**
   * "Private" method - Initializes the Google map
   */
  function initMap() {
    $scope.map = {
      center: {latitude: 46.8463196, longitude: 1.5732156},
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
           
          $scope.locationAnswer = {lat: lat, lng: lng};
          $scope.map.markers.pop();
          $scope.map.markers.push(marker);
          $scope.$apply();
        }
      }
    };
     
    // Hides all the elements on the map
    var styles = [
      {
        featureType: "administrative",
        elementType: "labels",
        stylers: [
          { visibility: "off" }
        ]
      },{
        featureType: "poi",
        elementType: "labels",
        stylers: [
          { visibility: "off" }
        ]
      },{
        featureType: "water",
        elementType: "labels",
        stylers: [
          { visibility: "off" }
        ]
      },{
        featureType: "road",
        stylers: [
          { visibility: "off" }
        ]
      }
    ];
    
    // Sets the Google map too
    $scope.options = {
      scrollwheel: false,
      disableDefaultUI: true,
      disableDoubleClickZoom: true,
      draggable: false,
      styles: styles
    }; 
  }
  
}]);

aoc.controller('ResultCtrl', ['$scope', 'resultService', function($scope, resultService) {
  $scope.results = resultService.getResults();
  $scope.score = resultService.getScore();
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
  
  this.getScore = function() {
    var score = 0;
    
    for (var i = 0; i <= this.results.length-1; i++) {
    	score += this.results[i].points;
    }
    
    return score;
  }
});

/**
 * Fixtures
 */
var data = [
  {id: 1, name: 'Muscadet', answer: 1, zipCode: 44003, department: 'LOIRE-ATLANTIQUE', city: 'Aigrefeuille-sur-Maine'},
  {id: 2, name: 'Camembert de Normandie', answer: 0, zipCode: 14001, department: 'CALVADOS', city: 'Acqueville'},
  {id: 3, name: 'Coteaux du Lyonnais', answer: 1, zipCode: 69021, department: 'RHONE', city: 'Bessenay'},
  {id: 4, name: 'Ossau-Iraty', answer: 0, zipCode: 65018, department: 'HAUTES-PYRENEES', city: 'Arrens-Marsous'},
  {id: 5, name: 'Maroilles', answer: 0, zipCode: 59003, department: 'NORD', city: 'Any-Martin-Rieux'}
];
