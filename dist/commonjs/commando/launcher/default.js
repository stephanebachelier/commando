"use strict";
exports["default"] = DefaultLauncher;

// Create a command launcher with `options`.
function DefaultLauncher(errorHandler) {
  this.errorHandler = errorHandler;
}

DefaultLauncher.prototype = {
  execute: function (Command, args, options) {
    var errorHandler;

    try{
      if (options && options.error && typeof options.error === 'function') {
        errorHandler = options.error;
      }
      var command = new Command();
      return command.execute.apply(command, args);
    }
    catch (e) {
      if (errorHandler) {
        errorHandler(e);
      }

      if (this.errorHandler) {
        this.errorHandler(e);
      }
    }
  }
};