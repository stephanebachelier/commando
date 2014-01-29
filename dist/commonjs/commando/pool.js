"use strict";
var Launcher = require("commando/launcher")["default"];
var isArray = require("commando/utils").isArray;

exports["default"] = CommandPool;

// Command pool constructor
// ------------------------
//
// Accepts these args:
//  * `eventHub`: Object to use to bind events to command calls
//  * `Promise`: Function, promise constructor to create promise
//  * `commandMap`: Object which is basically a map to bind event to command call.
//    Useful to create binding at startup
function CommandPool(eventHub, Promise, commandMap) {
  var _this = this;
  this.Promise = Promise;
  this.eventHub = eventHub;
  for(var event in commandMap) {
    _this.addCommand(event, commandMap[event]);
  }
};

CommandPool.prototype = {
  _commands: {},

  // execute a `command` using command launcher
  execute: function(command, args) {
    this.launcher().execute(command, args);
  },

  // return existing launcher or create a new one if it does not exist
  // override this method to provide a new implementation
  launcher: function() {
    if (!this._launcher) {
      this._launcher = new Launcher({
        promise: this.Promise
      });
    }
    return this._launcher;
  },

  // internal function to bind an `event` to a `command` call
  _bindCommand: function(event, command) {
    return this.eventHub.on(event, function () {
      this.execute(command, Array.prototype.splice.call(arguments, 0, 1));
    }, this);
  },

  // internal function to unbind an `event` to a `command` call
  _unbindCommand: function(event, command) {
    return this.eventHub.off(event, function () {
      this.execute(command, Array.prototype.splice.call(arguments, 0, 1));
    }, this);
  },

  // internal command which add an (`event`, `command`) couple to command pool
  _addCommand: function(event, Command) {
    var commands;
    this._bindCommand(event, Command);
    commands = this.getCommandsEvent(event);
    if (commands) {
      return commands.push(Command);
    } else {
      return this._commands[event] = [Command];
    }
  },

  // internal command which remove an (`event`, `command`) couple to command pool
  // support also the removal of all commands binded to `event` by passing a `null` `command`.
  _delCommand: function(event, command) {
    var commands;
    if (!event) {
      return;
    }
    // unbind `command`
    this._unbindCommand(event, command);
    // remove commands
    if (!command) {
      delete this._commands[event];
    } else {
      commands = this.getCommandsEvent(event);
      // remove any commands found
      var index = commands.indexOf(command);
      if (-1 != index) {
        commands.splice(index, 1);
      }
    }
    return this;
  },

  // find the commands binded to an `event`
  getCommandsEvent: function(event) {
    return this._commands[event];
  },

  // add `commands` to pool and bind them to `event`
  addCommand: function(event, commands) {
    var commandsArr,
      _this = this;
    // nothing to do
    if (!event) {
      return;
    }
    // add support for single command
    if (!isArray(commands)) {
      commandsArr = [commands];
    }
    // now add the commands
    return commandsArr.forEach(function(command) {
      return _this._addCommand(event, command);
    });
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
      return;
    }
    if (!commands) {
      return this._delCommand(event);
    } else {
      if (isArray(commands)) {
        commandsArr = [commands];
      }
      // now delete the commands
      return commandsArr.forEach(function(command) {
        return _this._delCommand(event, command);
      });
    }
  }
};