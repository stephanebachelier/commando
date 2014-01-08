module.exports = {
  amd: {
    options: {
      mangle: true
    },
    files: {
      'dist/<%= pkg.name %>.amd.min.js': ['dist/<%= pkg.name %>.amd.js'],
    }
  }
};
