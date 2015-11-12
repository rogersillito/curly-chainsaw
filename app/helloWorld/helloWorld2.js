angular.module('MyApp')
  .config(['$stateProvider', function ($stateProvider) {
    'use strict';
    $stateProvider
      .state('helloWorld2', {
        url: '/helloWorld2',
        template: '<hello-world></hello-world>'
      });
  }])
  .service('helloWorldService', function () {
    'use strict';
    this.getMessage = function () {
      return 'Hello World!';
    };
  })
  .directive('helloWorld', function () {
    'use strict';
    return {
      template: '<div>{{message}}</div>',
      controller: function ($scope, helloWorldService) {
        $scope.message = helloWorldService.getMessage();
      }
    };
  });
