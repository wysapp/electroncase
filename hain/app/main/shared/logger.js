'use strict';

const winston = require('winston');
const logger = new (winston.Logger)({
  level: 'debug',
  transports: [
    new (winston.transports.File)({
      filename: 'hain-debug.log',
      json: false,
      prettyPrint: true,
      maxFiles: 3,
      maxsize: 1024 * 1024
    }),
    new (winston.transports.Console)({
      timestamp: true,
      prettyPrint: true
    })
  ]
});

module.exports = logger;