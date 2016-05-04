'use strict';

function init() {
  console.log("init called");
  angular.element(document).ready(function() {
  	window.init();
  });
}

/**
 * Depedencies
 */
var app = angular.module('app', ['ngRoute', 'aoc', 'score']);

/**
 * Constants
 */
app.constant("answerValues", {
	"isFood": 0,
	"isDrink": 1
});

/**
 * Config
 */
app.config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when('/home', {
			templateUrl: 'partials/home.html',
			controller:	 'ScoreCtrl'
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
