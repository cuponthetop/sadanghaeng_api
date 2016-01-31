"use strict";

var winston = require('winston')
  // , config = require('../../config/config')
  ;

module.exports = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)()
  ],
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    verbose: 3,
    debug: 4,
    silly: 5
  }
});