'use strict';

const co = require('co');
const lo_assign = require('lodash.assign');
const logger = require('../shared/logger');

const PreferencesObject = require('../shared/preferences-object');

const rpc = require('./rpc');

let plugins = null;

rpc.define('searchAll', (payload) => {
  const { query, ticket } = payload;
  const resFunc = (obj) => {
    const resultData = {
      ticket,
      type: obj.type,
      payload: obj.payload
    };
    rpc.call('requestAddResults', resultData);
  };

  plugins.searchAll(query, resFunc);
});