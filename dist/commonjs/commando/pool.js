"use strict";
var DefaultLauncher = require("commando/launcher/default")["default"];
var PromiseLauncher = require("commando/launcher/promise")["default"];
var isArray = require("commando/utils").isArray;

exports["default"] = CommandPool;

// Command pool constructor
// ------------------------
//
// Accepts these args:
//  * `eventHub`: Object to use to bind events to command calls
//  * `commandMap`: Object which is basically a map to bind event to command call.
//    Useful to create binding at startup
//  * `options`: Object to set some options. Supported options:
//      + launcher: String ('default', 'promise'): enable the setup of the launcher
//      using the default ones provided. If you want to setup a custom launcher use
//      the `withLauncher(object)` method
function CommandPool(eventHub, commandMap, options) {
  var _this = this;
  this.eventHub = eventHub;
  for(var event in commandMap) {
    _this.addCommand(event, commandMap[event]);
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
    this.launcher().execute(command, args, {error: this.commandError});
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

  // internal function to bind an `event` to a `command` call
  _bindCommand: function(event, command) {
    return this.eventHub.on(event, function () {
      this.execute(command, arguments);
    }, this);
  },

  // internal function to unbind an `event` to a `command` call
  _unbindCommand: function(event, command) {
    return this.eventHub.off(event, function () {
      this.execute(command, arguments);
    }, this);
  },

  // internal command which add an (`event`, `command`) couple to command pool
  _addCommand: function(event, Command) {
    var commands;
    this._bindCommand(event, Command);
    commands = this.getCommands(event);
    if (commands) {
      commands.push(Command);
    } else {
      this._commands[event] = [Command];
    }
  },

  // internal command which remove an (`event`, `command`) couple to command pool
  // support also the removal of all commands binded to `event` by passing a `null` `command`.
  _delCommand: function(event, command) {
    var commands;
    if (!event) {
      return this;
    }
    // unbind `command`
    this._unbindCommand(event, command);
    // remove commands
    if (!command) {
      delete this._commands[event];
    } else {
      commands = this.getCommands(event);
      // remove any commands found
      var index = commands.indexOf(command);
      if (-1 != index) {
        commands.splice(index, 1);
      }
    }
  },

  // find the commands binded to an `event`
  getCommands: function(event) {
    return this._commands[event];
  },

  // add `commands` to pool and bind them to `event`
  addCommand: function(event, commands) {
    var commandsArr,
      _this = this;
    // nothing to do
    if (!event) {
      return this;
    }
    // add support for single command
    if (!isArray(commands)) {
      commandsArr = [commands];
    }
    // now add the commands
    commandsArr.forEach(function(command) {
      _this._addCommand(event, command);
    });

    return this;
  },

  // replace *all* existing `commands` binded to an `event`
  setCommand: function(event, commands) {
    if (!event) {
      return;
    }
    this.delCommand(event);
    return this.addCommand(event, commands);
  },

  // delete `commands` binded to `event`
  delCommand: function(event, commands) {
    var commandsArr,
      _this = this;
    if (!event) {
      return this;
    }
    if (!commands) {
      this._delCommand(event);
    } else {
      if (isArray(commands)) {
        commandsArr = [commands];
      }
      // now delete the commands
      commandsArr.forEach(function(command) {
        _this._delCommand(event, command);
      });
    }
    return this;
  }
};