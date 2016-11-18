'use strict';

const co = require('co');
const lo_assign = require('lodash.assign');
const logger = require('../shared/logger');
const globalProxyAgent = require('./global-proxy-agent');
const apiProxy = require('./api-proxy');
const PreferencesObject = require('../shared/preferences-object');

const rpc = require('./rpc');

const appPrefCopy = new PreferencesObject(null, 'hain', {});

const workerContext = lo_assign({
  globalPreferences: appPrefCopy
}, apiProxy);

let plugins = null;

function handleExceptions() {
  process.on('uncaughtException', (err) => logger.error(err));
}

rpc.define('initialize', (payload) => {
  const { appPref } = payload;
  return co(function* () {
    handleExceptions();
    appPrefCopy.update(appPref);
    globalProxyAgent.initialize(appPrefCopy);
  })
})