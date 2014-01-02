export default CommandLauncher;

function CommandLauncher(options) {
  this.options = options;
}

CommandLauncher.prototype = {
  execute: function(Command) {
    var args, resolver,
      _this = this;
    args = 1 <= arguments.length ? Array.prototype.slice.call(arguments, 0) : [];
    resolver = function(resolve, reject) {
      var command;
      command = new Command(resolve, reject);
      return command.execute(args);
    };
    return this.promise(resolver);
  },

  promise: function (resolver) {
    return new this.options.promise(resolver);
  }
};
