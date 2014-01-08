"use strict";
exports["default"] = CommandLauncher;

// Create a command launcher with `options`.
function CommandLauncher(options) {
  this.options = options;
}

CommandLauncher.prototype = {
  // Launch the execution of `Command` function. It create the command and wraps it in a Promise.
  execute: function(Command) {
    var args, resolver,
      _this = this;
    args = 1 <= arguments.length ? Array.prototype.slice.call(arguments, 0) : [];
    // create the resolver responsible for the creation and the execution
    // of the `Command`.
    // The command created must conform to the API `Command(resolve, reject)`.
    resolver = function(resolve, reject) {
      var command;
      command = new Command(resolve, reject);
      return command.execute(args);
    };
    // return the created promise
    return this.promise(resolver);
  },

  // This function is the one responsible for creating the promise around the `resolver` provided .
  // The purpose of this function is to permit overriding of the promise definition based on any logic or context.
  promise: function (resolver) {
    // create the promise based on the promise function given
    // as an option
    return new this.options.promise(resolver);
  }
};