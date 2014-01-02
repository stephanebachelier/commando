/**
  @module Commando
  */
define("commando/launcher", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = CommandLauncher;

    function CommandLauncher(options) {
      this.options = options;
    }

    CommandLauncher.prototype = {
      execute: function(Command) {
        var args, resolver,
          _this = this;
        args = 1 <= arguments.length ? Array.prototype.slice.call(arguments, 0) : [];
        resolver = function(resolve, reject) {
          var command;
          command = new Command(resolve, reject);
          return command.execute(args);
        };
        return this.promise(resolver);
      },

      promise: function (resolver) {
        return new this.options.promise(resolver);
      }
    };
  });
define("commando/pool", 
  ["commando/launcher","commando/utils","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Launcher = __dependency1__["default"];
    var isArray = __dependency2__.isArray;

    __exports__["default"] = CommandPool;

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
  });
define("commando/utils", 
  ["exports"],
  function(__exports__) {
    "use strict";
    function isArray(x) {
      return Object.prototype.toString.call(x) === "[object Array]";
    }

    __exports__.isArray = isArray;
  });
define("commando", 
  ["./commando/launcher","./commando/pool","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Launcher = __dependency1__["default"];
    var Pool = __dependency2__["default"];

    __exports__.Launcher = Launcher;
    __exports__.Pool = Pool;
  });