let test = require('tape')
  , proxyquire = require('proxyquire')
  , colors = require('chalk')

function proxy(global = {}) {
  let logged, forewarn = proxyquire('./src', { global: {
    ...global,
    console: {
      warn: (...args) => logged = args
    }
  }})

  return function spy(...args) {
    let warn = forewarn(...args)
    
    let wrap = (...args) => {
      logged = undefined;
      warn(...args)
      return logged
    }

    wrap.when = (...args) => {
      logged = undefined;
      warn.when(...args)
      return logged
    }

    return wrap
  }
}

test('forewarn', (t) => {
  let forewarn = proxy()

  t.throws(forewarn.bind(null), 'forewarn requires a scope')
  t.throws(forewarn.bind(null, 1), 'forewarn requires a string scope')
  t.throws(forewarn.bind(null, ''), 'forewarn requires a non-empty string scope')

  t.end()
})

test('warn', (t) => {
  let { yellow: y, cyan: c } = colors
  let warn = proxy()('test')

  t.throws(warn.bind(null), 'warn requires a format')
  t.throws(warn.bind(null, 'short'), 'warn requires a longer format')

  t.deepEqual
    ( warn('This is a test warning')
    , [ y('Warning from ') + c('%s') + y(': ') + 'This is a test warning', 'test' ]
    , 'message has color' )

  t.deepEqual
    ( warn.when(1, 'This is a second warning')
    , [ y('Warning from ') + c('%s') + y(': ') + 'This is a second warning', 'test' ]
    , 'warn.when logs if condition is truthy' )

  t.deepEqual
    ( warn.when(0, 'This is not a warning')
    , undefined
    , 'warn.when does not log if condition is falsy' )

  t.end()
})
