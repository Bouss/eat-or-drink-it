'use strict';

function init() {
  console.log("init called");
  angular.element(document).ready(function() {
  	window.init();
  });
}

/**
 * Dependencies
 */
var app = angular.module('app', ['ngRoute', 'uiGmapgoogle-maps', 'aoc', 'score']);


/**
 * Controllers
 */
app.controller('HomeCtrl', ['$rootScope', '$scope', '$window', '$location', 'apiRoute', 'scoreService', 'aocService', 'playerService', function($rootScope, $scope, $window, $location, apiRoute, scoreService, aocService, playerService) {
  $scope.scores = [];
	
  $window.init = function() {
    console.log("windowinit called");
    $scope.$apply($scope.loadScoreentityendpointLib);
    $scope.$apply($scope.loadAocentityendpointLib);
  };
  
  // Lists the best scores only if the Score API is loaded
  if (angular.isDefined($rootScope.isBackendReady) && $rootScope.isBackendReady) {
    scoreService.listScores($scope);
  }
  
  /**
   * Loads the Score API
   */
  $scope.loadScoreentityendpointLib = function() {
    gapi.client.load('scoreentityendpoint', 'v1', function() {
      console.log("score api loaded");
      $rootScope.isBackendReady = true;
      scoreService.listScores($scope);
    }, apiRoute);
  };
  
  /**
   * Loads the AOC API
   */
  $scope.loadAocentityendpointLib = function() {
    gapi.client.load('aocentityendpoint', 'v1', function() {
      console.log("aoc api loaded");
      aocService.listAocs();
    }, apiRoute);
  };
  
  $scope.play = function(pseudo) {
  	playerService.setPseudo(pseudo);
    $location.path('/game');
  }
  
}]);

/**
 * Constants
 */
app.constant("apiRoute", "https://eat-or-drink-it.appspot.com/_ah/api");

app.constant("answerValues", {
	"isFood": 0,
	"isDrink": 1
});

app.constant("distancePointsValues", [
  {
  	"distance": 50,
  	"points": 3
  },
  {
  	"distance": 100,
  	"points": 2
  },
  {
  	"distance": 150,
  	"points": 1
  }
]);

/**
 * Config
 */
app.config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when('/home', {
			templateUrl: 'partials/home.html',
			controller:	 'HomeCtrl'
		})
		.when('/game', {
			templateUrl: 'partials/game.html',
			controller:	 'AocCtrl'
		})
		.when('/results', {
			templateUrl: 'partials/results.html',
			controller:	 'ResultCtrl'
		})
  	.otherwise({
  		redirectTo: '/home'
		});
}]);

/**
 * Services
 */
app.service('playerService', function() {
	this.pseudo = "";
	
  this.setPseudo = function(pseudo) {
    this.pseudo = pseudo;
  };
  
  this.getPseudo = function() {
    return this.pseudo;
  };
});

app.service('locationService', function() {
    
  this.getDistance = function(loc1, loc2) {
    var R = 6371;
    var dLat = deg2rad(loc2.lat-loc1.lat);
    var dLng = deg2rad(loc2.lng-loc1.lng); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(loc1.lat)) * Math.cos(deg2rad(loc2.lat)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2)
    ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    return d;
  };

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

});
