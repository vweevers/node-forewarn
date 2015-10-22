'use strict';

const noop = function() {}

if (require('in-production')) {
  let warn = noop
  warn.when = noop
  module.exports = () => warn
} else {
  let global = require('global')
    , console = global.console
    , write = console ? (console.warn || console.log).bind(console) : noop
    , log

  if (require('detect-node')) {
    let { yellow: y, cyan: c } = require('chalk')
    let prefix = y('Warning from ') + c('%s') + y(': ')

    log = (scope, format, args) => write(prefix + format, scope, ...args)
  } else {
    let ua = global.navigator && global.navigator.userAgent
      , isChrome = global.chrome || (ua && ua.toLowerCase().indexOf('chrome') >= 0)
      , isFirebug = console.firebug || console.exception

    if (isChrome || isFirebug) {
      let prefix = '%cWarning from %c%s:%c '
        , prefixStyle = 'font-weight: bold'
        , scopeStyle = 'color: #333; ' + prefixStyle
        , resetStyle = ''

      log = (scope, format, args) => {
        write( prefix + format, prefixStyle
             , scopeStyle, scope
             , resetStyle, ...args)
      }
    } else {
      let prefix = 'Warning from %s: '
      log = (scope, format, args) => write(prefix + format, scope, ...args)
    }
  }

  let warn = (scope, format, ...args) => {
    if (format === undefined) {
      let msg = '`warn(format, ...args)` requires a message format argument'
      throw new Error(msg)
    }

    if (format.length < 10 || /^[s\W]*$/.test(format)) {
      throw new Error(
        'The warning format should be able to uniquely identify this ' +
        'warning. Please, use a more descriptive format than: ' + format
      )
    }

    log && log(scope, format, args)

    try {
      let error = new Error
      error.name = 'Warning'

      // --- Happy debugging ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw error
    } catch( _ ) {

    }
  }

  module.exports = function(scope) {
    if (typeof scope !== 'string' || scope === '') {
      let msg = '`forewarn(scope)` requires a string scope argument'
      throw new Error(msg)
    }

    let scoped = warn.bind(undefined, scope)
    scoped.when = (condition, ...args) => { condition && scoped(...args) }
    return scoped
  }
}
