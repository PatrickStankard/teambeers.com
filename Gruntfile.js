'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: [
        'js/teambeers.js'
      ],
      options: {
        browser: true,
        jquery: true,
        camelcase: true,
        eqeqeq: true,
        eqnull: true,
        indent: 2,
        latedef: true,
        newcap: true,
        quotmark: 'single',
        trailing: true,
        undef: true,
        unused: true,
        maxlen: 80
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.registerTask('test', 'jshint');
};
