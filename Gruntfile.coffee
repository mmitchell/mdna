module.exports = (grunt) ->

  grunt.initConfig
    coffee:
      compile:
        files:
          'javascript/app.js': 'src/*.coffee'

  grunt.loadNpmTasks 'grunt-contrib'