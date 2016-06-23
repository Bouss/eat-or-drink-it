'use strict';

var aoc = angular.module('aoc', []);

/**
 * Controllers
 */
aoc.controller('AocCtrl', ['$scope', '$location', '$http', 'answerValues', 'distancePointsValues', 'aocService', 'playerService', 'locationService', 'resultService', 'scoreService', function($scope, $location, $http, answerValues, distancePointsValues, aocService, playerService, locationService, resultService, scoreService) {
  var aocs = $scope.aocs = aocService.getRandomAocs();
  var answer = $scope.answer = {"question": null, "location": null};
  $scope.answerValues = answerValues;
  $scope.index = 0;

  // Resets previous results when starting a new game
  resultService.resetResults();
  
  // Initializes the Google map
  initMap();
  
  // Listener
  $scope.$watchGroup(['answer.question', 'answer.location'], function(newValues, oldValues, scope) {
  	if (null !== newValues[0] && null !== newValues[1]) {
  	  $scope.addAnswer();
  	}
  });
  
  /**
   * Checks the answer given and adds it into results
   */
  $scope.addAnswer = function() {
    var aoc = aocs[$scope.index];
    var q1Res = (answer.question == aoc.answer) ? 1 : 0;
    var q2Res = 0;

    // Gets the location of the AOC
    $http.get('https://maps.googleapis.com/maps/api/geocode/json', {params: {address: aoc.zipCode + "+" + aoc.city + "+" + aoc.department + "+" + "France"}})
      .then(function(resp) {
        var aocLocation = resp.data.results[0].geometry.location;

        // Calculates the distance (rounded) between the real AOC's location and the location given by the player
        var q2Distance = Math.round(locationService.getDistance(aocLocation, answer.location));
        
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
        			"question1Result": q1Res,
        			"question2Result": q2Res,
        			"question2Distance": q2Distance,
        			"points": q1Res + q2Res,
        			"aoc": {
        				"name":	aoc.name,
        				"answer": aoc.answer,
        				"department": aoc.department
        			}
      			}
    		);
        
        // Resets the answer given
        $scope.answer.question = null;
        $scope.answer.location = null;
        $scope.map.markers.pop();
        
      	// Next question
        $scope.index++;
        
        // When the game ends, saves the score and redirects to "/results"
        if ($scope.index >= aocs.length) {
          scoreService.insertScore(
          		{
          			"name": playerService.getPseudo(),
          			"score": resultService.getScore()
        			}
      		);
        	$location.path("/results");
        }
      }, function(error) {
        console.log(error);
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
           
          $scope.answer.location = {"lat": lat, "lng": lng};
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


/**
 * Services
 */
aoc.service('aocService', function() {
	var self = this;
	this.aocs = [];
	
  /**
   *  Gets all the AOCs stored from the Datastore
   */
  this.listAocs = function() {
    gapi.client.aocentityendpoint.listAocEntity().execute(function(resp) {
      console.log(resp);
      self.aocs = resp.items;
    });
  };
	
  /**
   * Gets 5 random AOCs
   */
	this.getRandomAocs = function() {
		var randAocs = [];
		var randIndex = -1;
		for (var i = 0; i <= 4; i++) {
		  randIndex = Math.floor(Math.random() * (this.aocs.length - 0)) + 0;
		  randAocs.push(this.aocs[randIndex]);
		}
		return randAocs;
	}
	
});
