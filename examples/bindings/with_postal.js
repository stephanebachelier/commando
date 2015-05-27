/*
This is a an example to make commando working with postal.js
The eventHub binder is just a function receiving to parameters:
 * `hub`, which is here a postal.channel
 * `pool`, which is a command(o) pool

This function must provide a basic api with `bind(name, command)` and
`unbind(name)`. The unbind command receive the command as second parameter but
it's not used in the example below.

The bind function will bind a topic `name` on the `hub` instance (a postal channel)
and if triggered, it will has the pool to execute the command named `command`.
*/

module.export = function (hub, pool) {
  return {
    bind: function(name, command) {
      hub.subscribe({
        topic: name,
        callback: function () {
          pool.execute(command, arguments);
        }.bind(pool)
      });
    },

    // internal function to unbind a `name` to a `command` call
    unbind: function(name) {
      hub.unsubscribe({
        topic: name
      });
    }
  };
};
