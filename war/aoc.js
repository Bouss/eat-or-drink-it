var app = angular.module('aoc', ['score']);

app.controller('AOCController', ['$scope', '$window', function($scope, $window) {
  $scope.questions = data;
  $scope.scores = [];
  $scope.state = 1;
  
  this.check = function(idButton, question) {
    $scope.scores.push(
      {
        name: question.name,
        result: (idButton == question.answer),
        score: (idButton == question.answer) ? 1 : 0
      }
    );
      
    if ($scope.tab >= data.length-1) {
      $scope.state = 2;
    }
      
    $scope.tab++;
  };
  
}]);

var data = [
  {name: 'camembert', answer: 0, geo:"46.5, 42.7"},
  {name: 'muscadet', answer: 1, geo:"0, 0"}
];
