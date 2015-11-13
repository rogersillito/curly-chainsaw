angular.module('MyApp')
  .config(['$stateProvider', function ($stateProvider) {
    'use strict';
    $stateProvider
      .state('helloWorld3a', {
        url: '/helloWorld3a',
          template: '<leaderboard></leaderboard>'
      });
  }])
    .service('leaderboardService', function ($resource, $q, $filter) {
        'use strict'; 
        var fetchLeaderboard = function() {
            return $resource('/assets/data/leaderboard.json').query().$promise;
        };
        var fetchPlayer = function(id) {
            return $resource('/assets/data/player/:id.json').get({id: id}).$promise
                .then(function (player) {
                    player.id = id;
                    return player;
                });
        };
        var pick = function (propertyName) {
            return function (o) {
                return o[propertyName];
            };
        };
        this.fetch = function() {
            return fetchLeaderboard()
                .then(function (leaderboard) {
                    return leaderboard.map(pick('id'));
                })
                .then(function(leaderboard) {
                    return $q.all(leaderboard.map(fetchPlayer));
                 });
        };
    }) 
    .directive('leaderboard', function () {
        'use strict';
        return {
            templateUrl: 'helloWorld/helloWorld3a.html',
            controller: function ($scope, leaderboardService) {
                $scope.loading = true;
                leaderboardService.fetch().then(function (l) {
                    $scope.leaderboard = l;
                    $scope.loading = false;
                });
                $scope.toggleLeaderboard = function () {
                    $scope.showLeaderboard = !$scope.showLeaderboard;
                };
            }
        };
    });
