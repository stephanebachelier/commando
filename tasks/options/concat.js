module.exports = {
  amd: {
    src: ['tmp/<%= pkg.name %>/**/*.amd.js', 'tmp/<%= pkg.name %>.amd.js'],
    dest: 'dist/<%= pkg.name %>.amd.js',
    options: {
      banner: '/**\n' +
              '  @module Commando\n' +
              '  @version <%= pkg.version %>\n' +
              '  */\n'
    }
  },

  amdNoVersion: {
    src: ['tmp/<%= pkg.name %>/**/*.amd.js', 'tmp/<%= pkg.name %>.amd.js'],
    dest: 'dist/<%= pkg.name %>.amd.js'
  },

  deps: {
    src: ['vendor/deps/*.js'],
    dest: 'tmp/deps.amd.js'
  },
};
