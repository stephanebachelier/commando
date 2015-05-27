module.exports = {
  amd: {
    src: ['tmp/commando/**/*.amd.js', 'tmp/commando.amd.js'],
    dest: 'dist/commando.amd.js',
    options: {
      banner: '<%= banner %>'
    }
  },
  commonjs: {
    src: ['dist/commonjs/main.js'],
    dest: 'dist/commonjs/main.js',
    options: {
      banner: '<%= banner %>'
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
