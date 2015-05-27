"use strict";
exports["default"] = function eventHubBinding(hub, pool) {
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