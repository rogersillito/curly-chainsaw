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
  .factory('players', function ($resource) {
    'use strict';
    return $resource('/assets/data/player/:player_id.json');
  })
  .controller('HelloWorld3Controller', ['$scope', 'leaderboard', 'players', '$timeout', '$filter', function ($scope, leaderboard, players, $timeout, $filter) {
    'use strict';
    $scope.loading = true;
    $timeout(function() { 
        var player_promises = [];
        leaderboard.query().$promise
        .then(function (leaderboard) {
            leaderboard.forEach(function(entry) {
                player_promises.push(players.get({player_id: entry.id}).$promise);
            });
            Promise.all(player_promises)
            .then(function (players) {
                $scope.leaderboard = [];
                leaderboard.forEach(function(entry, idx) {
                    entry.name = $filter('filter')(players, {id: entry.id})[0].name;
                    $scope.leaderboard.push(entry);
                    console.log(entry);
                });
                $scope.loading = false;
            });
        });
    }, 400);
  }]);
