var app = angular.module('score', []);

app.controller('HighScoreController', ['$scope', '$window', function($scope, $window) {
  $scope.highScores = [];

  // little hack to be sure that apis.google.com/js/client.js is loaded
  // before calling
  // onload -> init() -> window.init() -> then here
  $window.init = function() {
    console.log("windowinit called");
    var rootApi = 'https://eat-or-drink-it.appspot.com/_ah/api/';
    gapi.client.load('scoreentityendpoint', 'v1', function() {
      console.log("score api loaded");
      gapi.client.scoreentityendpoint.listScoreEntity().execute(
        function(resp) {
          $scope.highScores=resp.items;
          $scope.$apply();
          console.log(resp);
        });
    }, rootApi);
    
  }
    
}]);