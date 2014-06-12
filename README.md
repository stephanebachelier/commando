# Commando Library

Tiny abstraction over promises and command pattern to ease decoupling in Javascript project.

This project has no dependency and only add ~1.8k in amd minified version and < 700 bytes if gzipped.


## What's in

 * command launchers:
    * `default`, which use a function as a command,
    * `promise`, which wraps your command in a promise
 * command pool which basically create a map between event and commands

## Version

### AMD

 * non minified: `dist/commando.amd.js`
 * minified version: `dist/commando.amd.min.js`

### Common JS

 * the whole library: `dist/commonjs/commando.js`
 * or if you only want a part:
    * command launcher: `dist/commonjs/commando/launcher`
    * command pool: `dist/commonjs/commando/pool`

### Browser version

TODO

## Usage

### Command launcher without promise support

```javascript
// given this simple command
var command = function (a, b) {
  console.log(a, b);
};

// Setup default launcher without promise support.
var launcher = new DefaultLauncher();

launcher.execute(command, ['foo', 'bar']);

// it will print the following message to console
foo, bar
```


### Command launcher with promise support

```javascript
// Setup launcher with Promise object.
var launcher = new PromiseLauncher({
  promise: Promise
});

// Execute a command
// Command should have a constructor which conforms to this API:
//   function(resolve, reject) {}

Command = function (resolve, reject) {
  // keep a reference on these two resolvers
  this.success = resolve;
  this.error = reject;
};

Command.prototype.execute(a, b) {
  // do something and calls
  // e.g this function will invert a and b
  ok ? this.success(b, a) : this.error('something wrong');
};

var promise = launcher.execute(Command, ['foo', 'bar']);

// Add a callback
promise.then(function (one, two) {
  console.log('Success!', one, two); // will print 'Success, bar, foo'
}, function (error) {
  console.warn('Error!', error); // will print 'Error! something wrong'
});
```

### Command pool

```javascript

// (Optional create a command map)
var commandMap = {
  login: LoginCommand
};

// Pass some arguments
// * eventHub (required) : any object with on, off and trigger methods
// * commandMap (optional) : to register some commands
// * options: (optional): Object to set some options. Supported options:
//    + launcher: String ('default', 'promise'): enable the setup of the launcher
//      using the default ones provided. If you want to setup a custom launcher use
//      the `withLauncher(object)` method
var pool = new CommandPool(eventHub, commandMap, options);

// register a new command for `logout` event
pool.addCommand('logout', LogoutCommand);

// register two command for `username:change` event
pool.addCommand('username:change', [
  UpdateUsernameLabelCommand, // for e.g. update username label 'Hi foo'
  RequestUsernameChangeCommand // send a request to some API route
]);

// remove previously registered login command
pool.delCommand('login', LoginCommand);

// remove all commands attached to event 'username:change'
pool.delCommand('username:change');
```

#### Chaining API

You can define add multiple commands at once as the `addCommand` and `delCommand` are chainable. Thus you can write the previous example like this:

```javascript

// (Optional create a command map)
var commandMap = {
  login: LoginCommand
};

// Pass some arguments
// * eventHub (required) : any object with on, off and trigger methods
// * commandMap (optional) : to register some commands
// * options: (optional): Object to set some options. Supported options:
//    + launcher: String ('default', 'promise'): enable the setup of the launcher
//      using the default ones provided. If you want to setup a custom launcher use
//      the `withLauncher(object)` method
var pool = new CommandPool(eventHub, commandMap, options);

pool
  // register a new command for `logout` event
  .addCommand('logout', LogoutCommand)
  // register two command for `username:change` event
  .addCommand('username:change', [
    UpdateUsernameLabelCommand, // for e.g. update username label 'Hi foo'
    RequestUsernameChangeCommand // send a request to some API route
  ]);

pool
  // remove previously registered login command
  .delCommand('login', LoginCommand)
  // remove all commands attached to event 'username:change'
  .delCommand('username:change');
```

## Example

TODO

## API

See docs folder.

## Roadmap

 * [ ] add tests
 * [ ] add examples
 * [X] add docs
 * [ ] provide a browser version

## License

MIT
