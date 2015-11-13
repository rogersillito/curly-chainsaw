angular.module('MyApp')
  .config(['$stateProvider', function ($stateProvider) {
    'use strict';
    $stateProvider
      .state('helloWorld4', {
        url: '/helloWorld4',
        template: '<div nu-toggle-class="active" nu-something="counter" nu-action="log(counter)">Hello</div>',
        controller: function ($interval, $scope) {
          $scope.counter = 0;
          $scope.log = window.console.log.bind(window.console, 'Here');
          $interval(function () {
            $scope.counter++;
          }, 1000);
        }
      });
  }])
  .directive('nuToggleClass', function ($rootScope) {
    'use strict';
    return {
      scope: {
        className: '@nuToggleClass',
        something: '=nuSomething',
        action: '&nuAction'
      },
      link: function (scope, element) {
        $rootScope.$on('nuToggleClassClicked', window.console.log.bind(window.console));
        element.on('click', function () {
          scope.action();
          element.toggleClass(scope.className);
          $rootScope.$emit('nuToggleClassClicked', scope.something);
        });
      }
    };
  });
