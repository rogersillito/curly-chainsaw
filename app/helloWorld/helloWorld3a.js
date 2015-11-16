angular.module('MyApp')
  .config(['$stateProvider', function ($stateProvider) {
    'use strict';
    $stateProvider
      .state('helloWorld3a', {
        url: '/helloWorld3a',
          template: '<div toggle toggleid="leaderboard1" >xxx</div><leaderboard toggleable toggleableid="leaderboard1" toggle-class="hide"></leaderboard>'
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
    })
	.directive('toggle', function ($rootScope) {
    'use strict';
    return {
      scope: {
        toggleid: '@toggleid',
        //something: '=nuSomething',
        //action: '&nuAction'
      },
      link: function (scope, element) {
        //$rootScope.$on('nuToggleClassClicked', window.console.log.bind(window.console));
		element.on('click', function () {
			console.log('clicked', scope.toggleid);
          //scope.action();
          //element.toggleClass(scope.className);
		  //debugger;
          $rootScope.$emit('toggling', scope.toggleid);
        });
      }
    };
  })
  .directive('toggleable', function ($rootScope) {
    'use strict';
    return {
      scope: {
        toggleid: '@toggleableid',
        toggleclass: '@toggleClass',
        //action: '&nuAction'
      },
      link: function (scope, element) {
        $rootScope.$on('toggling', function(e,args){
									console.log('heard event',args); 
									if(scope.toggleid === args)
									{
										console.log('toggling now',scope.toggleclass);
										element.toggleClass(scope.toggleclass);
									}
									} );
		}
      }
    }
  );
