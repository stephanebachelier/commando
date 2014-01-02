module.exports = {
  amd: {
    options: {
      mangle: true
    },
    files: {
      'dist/<%= pkg.name %>-<%= pkg.version %>.amd.min.js': ['dist/<%= pkg.name %>-<%= pkg.version %>.amd.js'],
    }
  }
};
