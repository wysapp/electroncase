'use strict';

const rpc = require('./rpc');


function call(moduleName, funcName, args) {
  return rpc.call('callApi', { moduleName, funcName, args});
}

function makeProxy(moduleName, functions) {
  const proxy = {};
  for(const func of functions) {
    proxy[func] = (...args) => {
      return call(moduleName, func, args);
    }
  }
}

const app = makeProxy('app', ['restart', 'quit', 'open', 'close', 'setInput', 'setQuery', 'openPreferences', 'reloadPlugins']);

const logger = makeProxy('logger', ['log']);

module.exports = {
  app,
  logger
};