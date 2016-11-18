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



function initialize(globalPrefObj) {
  _prefObj = globalPrefObj;
  globalPrefObj.on('update', onPrefUpdate);
  patchAgents();
}

module.exports = {
  initialize
};