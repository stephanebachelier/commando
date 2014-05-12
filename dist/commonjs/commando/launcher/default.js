"use strict";
exports["default"] = DefaultLauncher;

// Create a command launcher with `options`.
function DefaultLauncher() {}

DefaultLauncher.prototype = {
  execute: function (command, args, options) {
    var errorHandler;
    if (options && options.error && typeof options.error === 'function') {
      errorHandler = options.error;
    }

    try{
      return command.apply(command, args);
    }
    catch (e) {
      if (errorHandler) {
        errorHandler(e);
      }
    }
  }
};