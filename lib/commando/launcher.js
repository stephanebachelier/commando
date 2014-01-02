import RSVP from 'rsvp';

var __slice = [].slice;

export default CommandLauncher;

function CommandLauncher(options) {
  this.options = options;
}

CommandLauncher.prototype = {
  execute: function() {
    var args, promise,
      _this = this;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    promise = function(resolve, reject) {
      var Command, command;
      Command = _this.options.command;
      command = new Command(resolve, reject);
      return command.execute(args);
    };
    return promise = new RSVP.Promise(promise);
  }
};
