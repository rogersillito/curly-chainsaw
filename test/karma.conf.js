module.exports = function (config) {
  'use strict';
  config.set({
    basePath: '..',
    frameworks: ['jasmine'],
    plugins: [
      'karma-jasmine',
      'karma-teamcity-reporter',
      'karma-phantomjs-launcher'
    ],
    files: [
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-resource/angular-resource.min.js',
      'app/bower_components/angular-ui-router/release/angular-ui-router.min.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/bower_components/es5-shim/es5-shim.js',
      'app/app.js',
      'app/helloWorld/helloWorld1.js',
      'app/helloWorld/helloWorld2.js',
      'test/spec/*.js'
    ],
    exclude: [],
    port: 8080,
    logLevel: config.LOG_ERROR,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: false,
    reporters: ['teamcity', 'progress']
  });
};
