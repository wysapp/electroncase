'use strict';

const appPref = require('./app-pref');

const APP_PREF_ID = 'Hain';
const appPrefItem = {
  id: APP_PREF_ID,
  group: 'Application'
};

module.exports = class PrefManager {
  constructor(workerProxy) {
    this.workerProxy = workerProxy;
    this.appPref = appPref;
  }
} 