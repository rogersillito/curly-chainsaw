angular.module('MyApp')
  .config(['$stateProvider', function ($stateProvider) {
    'use strict';
    $stateProvider
      .state('gameOfLifeSd', {
        url: '/gameOfLifeSd',
        template: '<game-of-life></game-of-life>'
        //templateUrl: 'helloWorld/gameoflife.html',
        //template: 'asdasdf',
        //template: 'hello!'
      });
  }])
  .service('gameOfLifeService', function () {
    'use strict';
    var ourGame = new SAMURAIPRINCIPLE.GameOfLife();
        //debugger;

  


    ourGame.toggleCellState(2,2);
    ourGame.toggleCellState(2,3);
    ourGame.toggleCellState(2,4);
    ourGame.toggleCellState(3,2);
    ourGame.toggleCellState(3,3);
    ourGame.toggleCellState(3,4);
    ourGame.toggleCellState(5,5);

	this.theCells = ourGame.isAlive;

    this.widgetTick = function () {
        console.log("?");
        ourGame.tick();
    };
    this.createNewJerk = function(event) 
    {
      console.log("jerking..");
      var l = event.x-event.target.getBoundingClientRect().left;
      var t = event.y-event.target.getBoundingClientRect().top;
              console.log("clicked yo: ", event.x,event.y);
        console.log("clicked yo: ", Math.floor(l/20),Math.floor(t/20));
        ourGame.toggleCellState(
          Math.floor(t/20),
          Math.floor(l/20)
          );
        event.preventDefault();
        return false;

    }
    
    
  })
  .directive('gameOfLife', function () {
    'use strict';
    return {
      templateUrl: '/helloWorld/gameoflife.html',
      controller: function ($scope, gameOfLifeService) {
		//gameOfLifeService.createNewJerk();
		console.log('started');
		$scope.widgetTick = function() {
			gameOfLifeService.widgetTick();
		};
		$scope.createNewJerk = gameOfLifeService.createNewJerk;
		$scope.theCells = gameOfLifeService.theCells;
      }
    };
  });

/*

angular.module('MyApp')
  .config(['$stateProvider', function ($stateProvider) {
    'use strict';
    $stateProvider
      .state('gameoflife', {
        url: '/gameoflife',
        templateUrl: 'helloWorld/gameoflife.html',
        controller: 'GameOfLifeController'
      });
  }])
  .controller('GameOfLifeController', ['$scope', function ($scope) {
    'use strict';    
    var ourGame = new SAMURAIPRINCIPLE.GameOfLife();

    $scope.theCells = ourGame.isAlive;


    ourGame.toggleCellState(2,2);
    ourGame.toggleCellState(2,3);
    ourGame.toggleCellState(2,4);
    ourGame.toggleCellState(3,2);
    ourGame.toggleCellState(3,3);
    ourGame.toggleCellState(3,4);
    ourGame.toggleCellState(5,5);

    $scope.widgetTick = function () {
        console.log("?");
        ourGame.tick();
    };
    $scope.createNewJerk = function(event) 
    {
      console.log();
      var l = event.x-event.target.getBoundingClientRect().left;
      var t = event.y-event.target.getBoundingClientRect().top;
              console.log("clicked yo: ", event.x,event.y);
        console.log("clicked yo: ", Math.floor(l/20),Math.floor(t/20));
        ourGame.toggleCellState(
          Math.floor(t/20),
          Math.floor(l/20)
          );
        event.preventDefault();
        return false;

    }
  }]);










*/