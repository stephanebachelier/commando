module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  var config = require('load-grunt-config')(grunt, {
    configPath: 'tasks/options',
    init: false
  });

  grunt.loadTasks('tasks');

  this.registerTask('default', ['build', 'docs']);

  // Build a new version of the library
  this.registerTask('build', 'Builds a distributable version of <%= cfg.name %>', [
    'clean',
    'transpile:amd',
    'transpile:commonjs',
    'concat:amd',
    'concat:commonjs',
    'jshint:output',
    'uglify'
  ]);

  this.registerTask('docs', 'Build the docs', [ 'docco' ]);

  //this.registerTask('test', 'Run the test', [ 'simplemocha', 'jshint:test' ]);
  this.registerTask('test', 'Run the test', [ 'karma', 'jshint:test' ]);

  var pkg = grunt.file.readJSON('package.json');

  config.env = process.env;
  config.pkg = pkg;
  config.banner = '/**\n' +
          '  @module Commando\n' +
          '  @version <%= pkg.version %>\n' +
          '  \n' +
          '  @author <%= pkg.author %>\n' +
          '  @license <%= pkg.license %>\n' +
          '*/\n';
  grunt.initConfig(config);
};
