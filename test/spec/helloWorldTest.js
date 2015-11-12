describe('helloWorld', function () {
  'use strict';
  var helloWorldController, $scope;
  beforeEach(module('MyApp'));

  describe('HelloWorld1Controller', function () {
    beforeEach(function () {
      inject(function ($controller) {
        $scope = {};
        helloWorldController = $controller('HelloWorld1Controller', { $scope: $scope });
      });
    });

    it('should set message to Hello World!', function () {
      expect($scope.message).toBe('Hello World!');
    });
  });

  describe('HelloWorldService', function () {
    var service;
    beforeEach(inject(function (helloWorldService) {
      service = helloWorldService;
    }));
    it('should', function () {
      expect(service.getMessage()).toBe('Hello World!');
    });
  });
  describe('HelloWorldDirective', function () {
    var element;
    beforeEach(inject(function ($compile, $rootScope) {
      element = $compile('<hello-world></hello-world>')($rootScope);
      $rootScope.$digest();
    }));

    it('should say hello world', function () {
      expect(element.html()).toContain('Hello World!');
    });
  });
});
