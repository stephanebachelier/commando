# Commando Library

__ Not production ready : beta stage __

Tiny abstraction over promises and command pattern to ease decoupling in Javascript project.

This project has no dependency and only add ~1.8k in amd minified version and < 700 bytes if gzipped.


## What's in

 * command launcher which wraps your command in a promise
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

### Command launcher

```javascript
// Setup launcher with Promise object.
var launcher = new CommandLauncher({
  promise: Promise
});

// Execute a command
// Command should have a constructor which conforms to this API:
//   function(resolve, reject) {}
var promise = launcher.execute(LoginCommand);


// Add a callback
promise.then(function () {
  console.log('Success!');
}, function () {
  console.warn('Error!');
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
// * Promise (required) : any implementation of promises
// * commandMap (optional) : to register some commands
var pool = new CommandPool(eventHub, Promise, commandMap);

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

## Example

TODO

## API

### CommandLauncher

#### CommandLauncher(options)

 * `options`: Object

Create a launcher with options.

#### execute: function(Command)

 * `command`: Function

Launch the execution of `command`. It create the command and wraps it in a Promise.

#### promise: function (resolver)

 * `resolver`: Function

This function is the one responsible for creating the promise around the command.
The purpose of this function is to permit overriding of the promise definition based on any logic or context.

### CommandPool

#### `CommandPool(eventHub, Promise, commandMap)`

 * `eventHub`: Object
 * `Promise`: Function, promise constructor
 * `commandMap`: Object which is basically a map

#### `execute: function(command)`

 * `command`: Function

Launch the execution of `command`.

#### `commandError: function (error)`

A global error handler attached to the promise to avoid a silent failure.
By default this handler does nothing. It's just an empty function that you should override for your own needs.

#### `launcher: function()`

Create the launcher or return the previously created launcher that will be responsible for launching any command.

#### `getCommandsEvent: function(event)`

 * `event`: String

Return the commands bound to the `event`.

#### `addCommand: function(event, commands)`

 * `event`: String
 * `commands`: Function or Array of functions.

Bind one or more command to the `event`.

#### `setCommand: function(event, commands)`

 * `event`: String
 * `commands`: Function or Array of functions.

bind the `commands` to `event`, removing all previously defined commands.

#### `delCommand: function(event, commands)`

 * `event`: String
 * `commands`: Function or Array of functions.

If no `commands` is given it will remove all previously commands registered with `event`, else remove only the binding to commands provided.

## Roadmap

 * [ ] add tests
 * [ ] add examples
 * [X] add docs
 * [ ] provide a browser version

## License

MIT
