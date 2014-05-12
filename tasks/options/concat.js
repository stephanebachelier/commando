module.exports = {
  amd: {
    src: ['tmp/commando/**/*.amd.js', 'tmp/commando.amd.js'],
    dest: 'dist/commando.amd.js',
    options: {
      banner: '/**\n' +
              '  @module Commando\n' +
              '  @version <%= pkg.version %>\n' +
              '  */\n'
    }
  },

  amdNoVersion: {
    src: ['tmp/commando/**/*.amd.js', 'tmp/commando.amd.js'],
    dest: 'dist/commando.amd.js'
  },

  deps: {
    src: ['vendor/deps/*.js'],
    dest: 'tmp/deps.amd.js'
  },
};
