'use strict'

const N = {

  // -- Models --------------------------------------------

  Maybe   : require('./Maybe').Maybe,
  Just    : require('./Maybe').Just,
  Nothing : require('./Maybe').Nothing,

  Either  : require('./Either').Either,
  Left    : require('./Either').Left,
  Right   : require('./Either').Right,

  // -- Functions -----------------------------------------

  lazy    : require('./lazy').lazy,

  check   : require('./check').check,
  checkFn : require('./check').checkFn,

  error   : require('./error').error,
  fnThrow : require('./error').fnThrow,
}

module.exports = N
