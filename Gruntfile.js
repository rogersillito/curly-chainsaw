/*jshint node:true*/
'use strict';
module.exports = function (grunt) {
  var sourceFiles = ['Gruntfile.js', 'app/**/*.js', 'test/spec/{,*/}*.js', '!app/bower_components/**/*.js'],
    environments = grunt.file.readJSON('environments.json'),
    environment = environments[grunt.option('environment') || 'vanilla'],
    distFiles = ['default.aspx', 'favicon.ico', 'index.html', 'robots.txt', 'assets/**', 'scripts/**'];

  require('jit-grunt')(grunt, {
    bower: 'grunt-bower-installer',
    useminPrepare: 'grunt-usemin',
    configureProxies: 'grunt-connect-proxy'
  });

  grunt.initConfig({
    githooks: {
      all: {
        'pre-commit': 'bower:install test'
      }
    },
    watch: {
      options: { spawn: false },
      js: {
        files: sourceFiles,
        tasks: ['newer:jshint', 'newer:jscs', 'karma']
      },
      livereload: {
        options: {
          livereload: {}
        },
        files: [
          'app/{,*/}{,*/}*.html',
          'app/{,*/}{,*/}*.js',
          'app/assets/styles/*.css',
          'app/assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          'app/assets/icons/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '!app/bower_components/**'
        ]
      }
    },
    connect: {
      options: {
        port: 9000,
        protocol: 'http',
        hostname: '0.0.0.0',
        middleware: function (connect, options) {
          var middlewares = [], serveStatic = require('serve-static');
          if (!Array.isArray(options.base)) {
            options.base = [options.base];
          }
          middlewares.push(function (req, res, next) {
            var writeHead = res.writeHead.bind(res);
            res.writeHead = function (statusCode, headers) {
              var cookie = res.getHeader('set-cookie');
              if (cookie) {
                cookie = (Array.isArray(cookie) ? cookie : [cookie]).map(function (cookie) {
                  return cookie.replace(' secure;', '');
                });
                res.setHeader('set-cookie', cookie);
              }
              writeHead(statusCode, headers);
            };
            next();
          });
          middlewares.push(require('grunt-connect-proxy/lib/utils').proxyRequest);
          options.base.forEach(function (base) {
            middlewares.push(serveStatic(base));
          });
          return middlewares;
        }
      },
      proxies: environment.proxies,
      livereload: {
        options: {
          livereload: 35729,
          base: [
            '.tmp',
            'app'
          ]
        }
      },
      browserSync: {
        options: {
          port: 2999,
          protocol: 'http',
          base: [
            '.tmp',
            'app'
          ]
        }
      },
      test: {
        options: {
          port: 9001,
          base: [
            '.tmp',
            'test',
            'app'
          ]
        }
      },
      dist: {
        options: { base: 'dist' }
      }
    },
    jscs: {
      options: { config: '.jscsrc' },
      files: {
        src: sourceFiles
      }
    },
    jshint: {
      options: {
        jshintrc: true
      },
      files: {
        src: sourceFiles
      }
    },
    clean: {
      options: {
        force: true
      },
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            'dist/*'
          ]
        }]
      },
      server: ['.tmp'],
      prepackage: ['dist/bower_components']
    },
    autoprefixer: {
      dist: {
        files: [{
          expand: true,
          cwd: 'app/assets/styles/',
          src: '*.css',
          dest: 'app/assets/styles/'
        }]
      }
    },
    bower: { install: {} },
    concat: {
      options: {
        process: function (src, filepath) {
          return /min\.js/.test(filepath) ? src.replace(/^\/\/# sourceMappingURL=.*/gm, '') : src;
        }
      }
    },
    uglify: {
      options: {
        sourceMap: true,
        sourceMapIncludeSources: true,
        sourceMapName: function (path) {
          return path + 'map';
        }
      }
    },
    rev: {
      dist: {
        files: {
          src: [
            'dist/{,*/}*.js',
            'dist/assets/fonts/*',
            'dist/assets/images/{,*/}*.{gif,jpeg,jpg,png,webp,svg}',
            'dist/assets/egames/**/*.{gif,jpeg,jpg,png,webp,svg}',
            'dist/assets/egames/**/images/*.{gif,jpeg,jpg,png,webp,svg,json}',
            'dist/assets/egames/**/sounds/*.mp3',
            'dist/assets/egames/**/styles/fonts/*',
            'dist/assets/styles/{,*/}*.css',
            'dist/assets/styles/fonts/*'
          ]
        }
      }
    },
    'inline_angular_templates': {
      dist: {
        options: {
          base: 'dist/views',
          prefix: 'views',
          unescape: {
            '&lt;': '<',
            '&gt;': '>',
            '&apos;': '\'',
            '&amp;': '&'
          }
        },
        files: {
          'dist/index.html': [
            'dist/404/404.html',
            'dist/common/**/*.html',
            'dist/drawgames/**/*.html',
            'dist/i18n/**/*.html',
            'dist/egames/**/*.html',
            'dist/mmcore/**/*.html'
          ]
        }
      }
    },
    useminPrepare: {
      html: 'app/index.html',
      options: {
        dest: 'dist',
        flow: {
          steps: {
            vendorjs: ['concat'],
            js: ['concat', 'uglify'],
            css: ['concat', 'cssmin']
          },
          post: {}
        }
      }
    },
    usemin: {
      html: ['dist/{,*/}*.html'],
      css: ['dist/assets/styles/{,*/}*.css'],
      js: 'dist/scripts/*.js',
      options: {
        assetsDirs: [
          'dist',
          'dist/assets/images',
          'dist/assets/egames',
          'dist/assets/styles',
          'dist/assets/fonts',
          'dist/assets/egames/**/styles/fonts',
          'dist/assets/egames/images',
          'dist/assets/egames/**/images',
          'dist/assets/egames/**/sounds'
        ],
        blockReplacements: {
          vendorjs: function (block) {
            return '<script defer src="' + block.dest + '"></script>';
          }
        },
        patterns: {
          js: [
            [/(assets\/(images|sounds|egames)\/.*?\.(?:gif|jpeg|jpg|png|webp|svg|json|mp3))/gm, 'Update the JS to reference our revved images']
          ]
        }
      }
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'app/assets/images',
          src: '{,*/}*.{png,jpg,jpeg,gif,svg}',
          dest: 'dist/assets/images'
        }, {
          expand: true,
          cwd: 'app/assets/icons',
          src: '{,*/}*.{png,jpg,jpeg,gif,svg}',
          dest: 'dist/assets/icons'
        }]
      }
    },
    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: 'dist',
          src: ['*.html', '*/{,*/}*.html', '!bower_components/**/*'],
          dest: 'dist'
        }]
      }
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: 'app',
          dest: 'dist',
          src: [
            '*.{ico,png,txt}',
            '*.html',
            '*/{,*/}*.html',
            'assets/fonts/*',
            'assets/images/{,*/}*.{webp}',
            'assets/egames/**/*',
            'assets/egames/**/styles/fonts/*',
            'assets/egames/**/sounds/*',
            'assets/styles/fonts/*',
            'assets/translations/**/*',
            'analytics/track.gif'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: 'dist/assets/images',
          src: ['generated/*']
        }]
      }
    },
    concurrent: {
      options: {
        logConcurrentOutput: true
      },
      watch: [
        'watch:livereload',
        'watch:js'
      ]
    },
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      }
    },
    browserSync: {
      bsFiles: {
        src: '<%= watch.livereload.files %>'
      },
      options: {
        watchTask: true,
        host: '0.0.0.0',
        proxy: 'localhost:2999',
        open: false,
        ghostMode: {
          clicks: true,
          scroll: true,
          location: true,
          forms: true
        }
      }
    },
    protractor: {
      options: {
        keepAlive: false,
        configFile: 'test/protractor.conf.js'
      },
      run: {}
    },
    compress: {
      main: {
        options: {
          archive: 'LNBMobile-dist.zip',
          mode: 'zip'
        },
        files: [
          {
            expand: true,
            cwd: 'dist/',
            src: distFiles
          },
          {
            src: 'version.txt'
          }
        ]
      }
    }
  });

  grunt.registerTask('serve', function (target) {
    var request = require('request'),
      open = require('open'),
      os = require('os'),
      networkInterfaces,
      urlCandidates,
      url,
      interval;

    if (!grunt.option('environment') || !environment) {
      grunt.log.error('Cannot serve - incorrect/no environment specified.');
      return;
    }

    networkInterfaces = os.networkInterfaces();
    urlCandidates = Object.keys(networkInterfaces)
      .filter(function (networkInterface) {
        return [/^eth/, /^en/, /Local Area Connection/, /Wireless Network Connection/]
          .some(function (matcher) {
            return matcher.test(networkInterface);
          });
      })
      .reduce(function (previousValue, currentValue) {
        return previousValue.concat(networkInterfaces[currentValue]);
      }, [])
      .filter(function (details) {
        return details.family === 'IPv4';
      })
      .map(function (details) {
        return 'http://' + details.address + ':9000';
      })
      .concat(['http://localhost:9000']);

    url = urlCandidates[0];
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
    interval = setInterval(function () {
      request('http://localhost:35729', function (err) {
        if (!err && interval) {
          grunt.log.subhead('Possible access urls:', urlCandidates.join(', '));
          open(url);
          clearInterval(interval);
          interval = undefined;
        }
      });
    }, 100);

    if (target === 'dist') {
      return grunt.task.run(['build', 'configureProxies:server', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean',
      'bower:install',
      'newer:autoprefixer',
      'configureProxies:server',
      'connect:livereload',
      'connect:browserSync',
      'browserSync',
      'concurrent:watch'
    ]);
  });

  grunt.registerTask('build', [
    'clean',
    'bower:install',
    'test',
    'useminPrepare',
    'imagemin',
    'autoprefixer',
    'concat',
    'copy:dist',
    'cssmin',
    'uglify',
    'rev',
    'usemin',
    'htmlmin',
    'inline_angular_templates'
  ]);

  grunt.registerTask('test', [
    'jshint',
    'jscs',
    'karma'
  ]);

  grunt.registerTask('package', [
    'build',
    'compress',
    'copy:output'
  ]);
};
