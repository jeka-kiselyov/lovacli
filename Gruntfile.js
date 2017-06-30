module.exports = function(grunt) {

  grunt.initConfig({
    watch: {
      fortests: {
        files: ['app/**/*.js', 'includes/**/*.js', 'config/**/*.js', '*.js'],
        tasks: ['mochacli:local']
      }
    },
    env: {
      options: {},
      test: {
        NODE_ENV: 'test'
      },
      testprod: {
        NODE_ENV: 'testprod'
      }
    },
    mochacli: {
      options: {
        require: [],
        reporter: 'spec',
        bail: true,
        timeout: 1000,
        files: ['app/tests/*.js']
      },
      local: {
        timeout: 25000,
        env: {
          NODE_ENV: 'test'
        }
      }
    }
  });


  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-cli');
  grunt.loadNpmTasks('grunt-env');

  grunt.registerTask('default', ['test']);
  grunt.registerTask('watchtest', ['env:test', 'watch:fortests']);
  grunt.registerTask('test', ['env:test', 'mochacli:local']);

};