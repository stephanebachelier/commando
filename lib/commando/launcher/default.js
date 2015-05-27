export default DefaultLauncher;

// Create a command launcher with `errorHandler` and `options`.
function DefaultLauncher(errorHandler, options) {
  this.errorHandler = errorHandler;
  this.options = options || {};
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
