angular.module('MyApp')
  .config(['$stateProvider', function ($stateProvider) {
    'use strict';
    $stateProvider
      .state('helloWorld1', {
        url: '/helloWorld1',
        templateUrl: 'helloWorld/helloWorld1.html',
        controller: 'HelloWorld1Controller'
      });
  }])
  .controller('HelloWorld1Controller', ['$scope', function ($scope) {
    'use strict';
    $scope.message = 'Hello World!';
    $scope.messages = [
      {text: 'First message'},
      {text: 'Second message'},
      {text: 'Third message'}
    ];
    $scope.addMore = function () {
      $scope.messages.push({text: 'Message ' + $scope.messages.length});
    };
  }]);
