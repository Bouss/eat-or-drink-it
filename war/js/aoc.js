var app = angular.module('aoc', []);

app.controller('AOCController', ['$scope', '$window', function($scope, $window){
  $scope.questions = data;
  $scope.scores = [];

  // Checks the answer given and adds it into scores
  this.check = function(idButton, question) {
    $scope.scores.push(
      {
        name:   question.name,
        result: (idButton == question.answer),
        score:  (idButton == question.answer) ? 1 : 0
      }
    );
    
    // Ends the game
    if ($scope.i >= data.length-1) {
      $scope.page = 3;
    }
    
    $scope.i++;
  };
  
}]);

var data = [
  {name: 'camembert', answer: 0, geo:"46.5, 42.7"},
  {name: 'muscadet',  answer: 1, geo:"0, 0"}
];
