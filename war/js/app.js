var app = angular.module('app', ['aoc', 'score']);

app.controller('MainController', ['$scope', '$window', function($scope, $window){
  $scope.page = 1;
}]);