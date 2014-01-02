module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  var config = require('load-grunt-config')(grunt, {
    configPath: 'tasks/options',
    init: false
  });

  grunt.loadTasks('tasks');

  this.registerTask('default', ['build']);

  // Build a new version of the library
  this.registerTask('build', 'Builds a distributable version of <%= cfg.name %>', [
    'clean',
    'transpile:amd',
    'transpile:commonjs',
    'concat:amd',
    'jshint',
    'uglify'
  ]);

  config.env = process.env;
  config.pkg = grunt.file.readJSON('package.json')

  grunt.initConfig(config);
};
