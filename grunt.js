/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    lint: {
      files: ['grunt.js', 'lib/**/*.js', 'test/**/*.js']
    },
    qunit: {
      files: ['test/**/*.html']
    },

    watch: {
      files: ['<config:lint.files>', '<config:coffee.app.src>'],
      tasks: 'coffee:app lint qunit'
    },

    coffee: {
      app: {
        src: ['src/coffee/*.coffee'],
        dest: 'src/js',
        options: {
          bare: false
        }
      }
    },

    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {}
    },

    min: {
      dist: {
        src: ['src/js/unsizzle.js'],
        dest: 'dist/unsizzle.min.js'
      }
    }

  });

  // Default task.
  grunt.registerTask('default', 'lint qunit coffee:app min');
  grunt.loadNpmTasks('grunt-coffee');

};
