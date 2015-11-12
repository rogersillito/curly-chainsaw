angular.module('MyApp')
  .config(['$stateProvider', function ($stateProvider) {
    'use strict';
    $stateProvider
      .state('helloWorld3', {
        url: '/helloWorld3',
        templateUrl: 'helloWorld/helloWorld3.html',
        controller: 'HelloWorld3Controller'
      });
  }])
  .factory('leaderboard', function ($resource) {
    'use strict';
    return $resource('/assets/data/leaderboard.json');
  })
  .controller('HelloWorld3Controller', ['$scope', 'leaderboard', function ($scope, leaderboard) {
    'use strict';
    leaderboard.query().$promise
      .then(function (leaderboard) {
        $scope.leaderboard = leaderboard;
      });
  }]);
