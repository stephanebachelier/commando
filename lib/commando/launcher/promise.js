export default PromiseLauncher;

// Create a command launcher with `options`.
function PromiseLauncher(options) {
  this.options = options;
}

PromiseLauncher.prototype = {
  // Launch the execution of `Command` function. It create the command and wraps it in a Promise.
  execute: function(Command, args, options) {
    var resolver,
      _this = this;

    // create the resolver responsible for the creation and the execution
    // of the `Command`.
    // The command created must conform to the API `Command(resolve, reject)`.
    resolver = function(resolve, reject) {
      var command;
      command = new Command(resolve, reject);
      return command.execute.apply(command, args);
    };
    // return the created promise
    return this.promise(resolver).catch(options.error);
  },

  // This function is the one responsible for creating the promise around the `resolver` provided .
  // The purpose of this function is to permit overriding of the promise definition based on any logic or context.
  promise: function (resolver) {
    // create the promise based on the promise function given
    // as an option
    return new this.options.promise(resolver);
  }
};
