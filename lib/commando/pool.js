import DefaultLauncher from 'commando/launcher/default';
import PromiseLauncher from 'commando/launcher/promise';
import { isArray } from 'commando/utils';

export default CommandPool;

// Command pool constructor
// ------------------------
//
// Accepts these args:
//  * `eventHub`: Object to use to bind events to command calls
//  * `commandMap`: Object which is basically a map to bind name to command call.
//    Useful to create binding at startup
//  * `options`: Object to set some options. Supported options:
//      + launcher: String ('default', 'promise'): enable the setup of the launcher
//      using the default ones provided. If you want to setup a custom launcher use
//      the `withLauncher(object)` method
function CommandPool(eventHub, commandMap, options) {
  var _this = this;
  this.eventHub = eventHub;
  for(var name in commandMap) {
    _this.addCommand(name, commandMap[name]);
  }
  this.options = options;
};

CommandPool.prototype = {
  _commands: {},

  // to setup a custom launcher
  // return this to enable chaining calls.
  withLauncher: function (launcher) {
    this._launcher = launcher;
    return this;
  },

  // execute a `command` using command launcher
  execute: function(command, args) {
    //this.launcher().execute(command, args).catch(this.commandError);
    return this.launcher().execute(command, args, {error: this.commandError});
  },

  executeCommand: function (name, args) {
    var commands = this.getCommands(name);
    return this.execute(commands ? commands[0] : undefined, args);
  },

  // main error handler to override
  commandError: function (error) {},

  // return existing launcher or create a new one if it does not exist
  // override this method to provide a new implementation
  launcher: function() {
    if (!this._launcher) {
      this._launcher = new DefaultLauncher();
    }
    return this._launcher;
  },

  // internal function to bind an `name` to a `command` call
  _bindCommand: function(name, command) {
    return this.eventHub.on(name, function () {
      this.execute(command, arguments);
    }, this);
  },

  // internal function to unbind an `name` to a `command` call
  _unbindCommand: function(name, command) {
    return this.eventHub.off(name, function () {
      this.execute(command, arguments);
    }, this);
  },

  // internal command which add an (`name`, `command`) couple to command pool
  _addCommand: function(name, Command) {
    var commands;
    this._bindCommand(name, Command);
    commands = this.getCommands(name);
    if (commands) {
      commands.push(Command);
    } else {
      this._commands[name] = [Command];
    }
  },

  // internal command which remove an (`name`, `command`) couple to command pool
  // support also the removal of all commands binded to `name` by passing a `null` `command`.
  _delCommand: function(name, command) {
    var commands;
    if (!name) {
      return this;
    }
    // unbind `command`
    this._unbindCommand(name, command);
    // remove commands
    if (!command) {
      delete this._commands[name];
    } else {
      commands = this.getCommands(name);
      // remove any commands found
      var index = commands.indexOf(command);
      if (-1 != index) {
        commands.splice(index, 1);
      }
    }
  },

  // find the commands binded to an `name`
  getCommands: function(name) {
    return this._commands[name];
  },

  // add `commands` to pool and bind them to `name`
  addCommand: function(name, commands) {
    var commandsArr,
      _this = this;
    // nothing to do
    if (!name) {
      return this;
    }
    // add support for single command
    if (!isArray(commands)) {
      commandsArr = [commands];
    }
    // now add the commands
    commandsArr.forEach(function(command) {
      _this._addCommand(name, command);
    });

    return this;
  },

  // replace *all* existing `commands` binded to an `name`
  setCommand: function(name, commands) {
    if (!name) {
      return;
    }
    this.delCommand(name);
    return this.addCommand(name, commands);
  },

  // delete `commands` binded to `name`
  delCommand: function(name, commands) {
    var commandsArr,
      _this = this;
    if (!name) {
      return this;
    }
    if (!commands) {
      this._delCommand(name);
    } else {
      if (isArray(commands)) {
        commandsArr = [commands];
      }
      // now delete the commands
      commandsArr.forEach(function(command) {
        _this._delCommand(name, command);
      });
    }
    return this;
  }
};
