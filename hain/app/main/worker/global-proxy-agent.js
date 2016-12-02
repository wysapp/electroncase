'use strict';

const lo_isString = require('lodash.isstring');
const lo_assign = require('lodash.assign');

const http = require('http');
const https = require('https');
const url = require('url');
const tunnel = require('tunnel');

const logger = require('../shared/logger');

const _httpRequest = http.request;
const _httpsRequest = https.request;

let _prefObj = null;


function createHttpProxyAgent(host, port) {
  return tunnel.httpOverHttp({
    proxy: {host, port}
  });
}

function createHttpsProxyAgent(host, port) {
  return tunnel.httpsOverHttp({
    proxy: {host, port}
  });
}

function patchRequest(moduleInstance, orgReq, proxyAgent) {
  return (opts, cb) => {
    let _opts = null;
    if (lo_isString(opts)) {
      _opts = url.parse(opts);
    } else {
      _opts = lo_assign({}, opts);
    }

    if (_opts.agent === undefined)
      _opts.agent = proxyAgent;
    
    return orgReq.call(moduleInstance, _opts, cb);
  };
}


function patchAgents() {
  http.request = _httpRequest;
  https.request = _httpsRequest;

  const proxyPref = _prefObj.get('proxy');
  if (!proxyPref.useProxy)
    return;

  logger.debug('patchAgents:');
  logger.debug(proxyPref);

  const httpAgent = createHttpProxyAgent(proxyPref.host, proxyPref.port);
  const httpsAgent = createHttpsProxyAgent(proxyPref.host, proxyPref.port);

  http.request = patchRequest(http, _httpRequest, httpAgent);
  https.request = patchRequest(https, _httpsRequest, httpsAgent);
}

function onPrefUpdate() {
  patchAgents();
}

function initialize(globalPrefObj) {
  _prefObj = globalPrefObj;
  globalPrefObj.on('update', onPrefUpdate);
  patchAgents();
}

module.exports = {
  initialize
};