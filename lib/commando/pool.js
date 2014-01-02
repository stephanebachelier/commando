import Launcher from 'commando/launcher';
import { isArray } from 'commando/utils';

export default CommandPool;

function CommandPool(eventHub, Promise, commandMap) {
  var _this = this;
  this.Promise = Promise;
  this.eventHub = eventHub;
  commandMap.forEach(function(Command, event) {
    return _this.addCommand(event, Command);
  });
};

CommandPool.prototype = {
  _commands: {},

  execute: function(command) {
    this._launcher.execute(command);
  },

  launcher: function() {
    if (!this._launcher) {
      this._launcher = new Launcher({
        promise: this.Promise
      });
    }
    return this._launcher;
  },

  _bindCommand: function(event, command) {
    return this.eventHub.on(event, function () {
      this.execute(command);
    }, this);
  },

  _unbindCommand: function(event, command) {
    return this.eventHub.off(event, function () {
      this.execute(command);
    }, this);
  },

  _addCommand: function(event, Command) {
    var command, commands;
    command = new Launcher({
      command: Command
    });
    this._bindCommand(event, command);
    commands = this.getCommandsEvent(event);
    if (commands) {
      return commands.push(command);
    } else {
      return this._commands[event] = [command];
    }
  },

  _delCommand: function(event, command) {
    var commands;
    if (!event) {
      return;
    }
    this._unbindCommand(event, command);
    if (!command) {
      delete this._commands[event];
    } else {
      commands = this.getCommandsEvent(event);
      var index = commands.indexOf(command);
      if (-1 != index) {
        commands.splice(index, 1);
      }
    }
    return this;
  },

  getCommandsEvent: function(event) {
    return this._commands[event];
  },

  addCommand: function(event, commands) {
    var commandsArr,
      _this = this;
    if (!event) {
      return;
    }
    if (!isArray(commands)) {
      commandsArr = [commands];
    }
    return commandsArr.forEach(function(command) {
      return _this._addCommand(event, command);
    });
  },

  setCommand: function(event, commands) {
    if (!event) {
      return;
    }
    this.delCommand(event);
    return this.addCommand(event, commands);
  },

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
      return commandsArr.forEach(function(command) {
        return _this._delCommand(event, command);
      });
    }
  }
};
