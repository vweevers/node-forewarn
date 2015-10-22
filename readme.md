# forewarn

**Scoped and styled warning logger.** Best used sparingly, forewarn writes a message to console unless a condition is falsy or `NODE_ENV` is production. It's meant to advise consumers of your module when some argument is invalid, but you have an alternative code path to follow. Meaning: instead of throwing an error and breaking the flow, you adapt, and through forewarn, you help developers prevent the situation in the future.

[![npm status](http://img.shields.io/npm/v/forewarn.svg?style=flat-square)](https://www.npmjs.org/package/forewarn) [![Dependency status](https://img.shields.io/david/vweevers/node-forewarn.svg?style=flat-square)](https://david-dm.org/vweevers/node-forewarn)

![example](https://github.com/vweevers/node-forewarn/raw/master/example.png)

## about

This module is adapted from React's `warning` function:

>Similar to invariant but only logs a warning if the condition is not met.
 This can be used to log issues in development environments in critical
 paths. Removing the logging code for production environments will keep the
 same logic and follow the same code paths.

Differences from React's `warning`:

- Scoped like `debug`
- The warning message is styled if the execution environment is Chrome, Electron, Firefox with Firebug or Node.js
- The `condition` argument has flipped polarity and is made explicit (because
  it's easier to read IMHO):
    - `warn.when(3 !== 3, 'Three should be three')` reads as "warn if 3 does not equal 3"
    - `warn('Three should be three')` always warns.
- Arguments are passed to `console.warn` as is, so you can use all modifiers (depending on environment) instead of just `%s` and an arbitrary number of extra arguments.

## example

```js
const warn = require('forewarn')('my-module')

let path = ['a', 'b']
  , length = path.length
  , minimum = 3

warn.when( length < minimum
         ,'Ignoring invalid path %o because length %d is less than %d'
         , path, length, minimum )
```

## api

### `warn = forewarn(scope)`

Create a `warn` function. Messages will be prefixed with the string `scope` (usually the name of your module). Returns a noop in production.

### `warn(format, ...args)`

Log a warning.

### `warn.when(condition, format, ...args)`

Log a warning if `condition` is truthy.

## install

With [npm](https://npmjs.org) do:

```
npm install forewarn
```

## license

[MIT](http://opensource.org/licenses/MIT) © [Vincent Weevers](vincentweevers.nl)
