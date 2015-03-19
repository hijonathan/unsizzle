'use strict';

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    config: {
      src: 'lib',
      dest: './'
    },

    // watch: {
    //   files: ['<config:lint.files>', '<config:coffee.all.src>'],
    //   tasks: 'coffee lint qunit'
    // },

    coffee: {
      all: {
        files: [{
          expand: true,
          cwd: '<%= config.src %>',
          src: '{,*/}*.{coffee,litcoffee,coffee.md}',
          dest: '<% config.dest %>',
          ext: '.js'
        }]
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        'test/**/*.js'
      ]
    },

    uglify: {
      dist: {
        files: {
          'unsizzle.min.js': 'unsizzle.js',
          'reduce.min.js': 'reduce.js'
        }
      }
    }

  });

  // Default task.
  grunt.registerTask('default', [
    'jshint',
    'coffee',
    'uglify'
  ]);
};
