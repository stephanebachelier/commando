/**
  @module Commando
  @version 0.7.2
  
  @author Stéphane Bachelier <stephane.bachelier@gmail.com>
  @license MIT
 */
define("commando/bindings/eventHub", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = function eventHubBinding(hub, pool) {
      return {
        bind: function(name, command) {
          return hub.on(name, function () {
            pool.execute(command, arguments);
          }, pool);
        },

        // internal function to unbind an `name` to a `command` call
        unbind: function(name, command) {
          return hub.off(name, function () {
            pool.execute(command, arguments);
          }, pool);
        }
      };
    }
  });
define("commando/launcher/default", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = DefaultLauncher;

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
  });
define("commando/launcher/promise", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = PromiseLauncher;

    // Create a command launcher with `options`.
    function PromiseLauncher(errorHandler) {
      this.errorHandler = errorHandler;
    }

    PromiseLauncher.prototype = {
      // Launch the execution of `Command` function. It create the command and wraps it in a Promise.
      execute: function(Command, args) {
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
        return this.promise(resolver).catch(this.errorHandler);
      },

      // This function is the one responsible for creating the promise around the `resolver` provided .
      // The purpose of this function is to permit overriding of the promise definition based on any logic or context.
      promise: function (resolver) {
        // create the promise based on the promise function given
        // as an option
        var Promise = this.options.promise || this.Promise;
        return new Promise(resolver);
      }
    };
  });
define("commando/pool", 
  ["commando/launcher/default","commando/launcher/promise","commando/utils","commando/bindings/eventHub","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var DefaultLauncher = __dependency1__["default"];
    var PromiseLauncher = __dependency2__["default"];
    var isArray = __dependency3__.isArray;
    var eventBinding = __dependency4__["default"];

    __exports__["default"] = CommandPool;

    // Command pool constructor
    // ------------------------
    //
    // Accepts these args:
    //  * `eventHub`: Object to use to bind events to command calls
    //  * `options`: Object to set some options. Supported options:
    //      + `commandMap`: Object which is basically a map to bind name to command call.
    //      Useful to create binding at startup
    //      + launcher: String ('default', 'promise'): enable the setup of the launcher
    //      using the default ones provided. If you want to setup a custom launcher use
    //      the `withLauncher(object)` method
    //      + binder: Object, provide the event binder to map event to commands
    //      by default will use the one provided with commando which expect eventHub
    //      to support `on` and `off` handlers
    function CommandPool(eventHub, options) {
      this.options = options || {};

      this._eventHub = eventHub;

      if (this.options.commandMap) {
        this.bind(this.options.commandMap);
      }
    }

    CommandPool.prototype = {
      _commands: {},

      bind: function (commandMap, binder) {
        this.withEventBinding(binder);

        for(var name in commandMap) {
          this.addCommand(name, commandMap[name]);
        }
      },

      withEventBinding: function (binder) {
        if (!this._eventBinding) {
          this._eventBinding = (binder || this.options.binder || eventBinding)(this._eventHub, this);
        }
        return this;
      },

      // to setup a custom launcher
      // return this to enable chaining calls.
      withLauncher: function (launcher) {
        this._launcher = launcher;
        return this;
      },

      // execute a `command` using command launcher
      execute: function(command, args) {
        return this.launcher().execute(command, args);
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
          this._launcher = new DefaultLauncher(this.commandError);
        }
        return this._launcher;
      },

      // internal function to bind an `name` to a `command` call
      _bindCommand: function(name, command) {
        if (!this._eventBinding) {
          this.withEventBinding();
        }
        return this._eventBinding.bind(name, command);
      },

      // internal function to unbind an `name` to a `command` call
      _unbindCommand: function(name, command) {
        return this._eventBinding.unbind(name, command);
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
          if (-1 !== index) {
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
  });
define("commando/utils", 
  ["exports"],
  function(__exports__) {
    "use strict";
    // Simple function to test if `x` is an Array
    function isArray(x) {
      return Object.prototype.toString.call(x) === "[object Array]";
    }

    __exports__.isArray = isArray;
  });
define("commando", 
  ["commando/launcher/default","commando/launcher/promise","./commando/pool","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var DefaultLauncher = __dependency1__["default"];
    var PromiseLauncher = __dependency2__["default"];
    var Pool = __dependency3__["default"];

    // export API
    __exports__.DefaultLauncher = DefaultLauncher;
    __exports__.PromiseLauncher = PromiseLauncher;
    __exports__.Pool = Pool;
  });