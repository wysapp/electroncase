'use strict';

const path = require('path');
const applicationConfigPath = require('application-config-path');

const HAIN_USER_PATH = applicationConfigPath('hain-user');

const APP_PREF_DIR = `${HAIN_USER_PATH}/prefs/app`;

module.exports = {
  APP_PREF_DIR,
}