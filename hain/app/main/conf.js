'use strict';

const path = require('path');
const applicationConfigPath = require('application-config-path');

const HAIN_USER_PATH = applicationConfigPath('hain-user');
const LOCAL_STORAGE_DIR = `${HAIN_USER_PATH}/localStorages`;
const PLUGIN_PREF_DIR = `${HAIN_USER_PATH}/prefs/plugins`;
const APP_PREF_DIR = `${HAIN_USER_PATH}/prefs/app`;

const __PLUGIN_PREINSTALL_DIR = path.resolve('./pre_install');
const __PLUGIN_UNINSTALL_LIST_FILE = path.resolve('./pre_uninstall');
const __PLUGIN_UPDATE_LIST_FILE = path.resolve('./pre_update');

const INTERNAL_PLUGIN_REPO = path.join(__dirname, './plugins');
const MAIN_PLUGIN_REPO = path.resolve(`${HAIN_USER_PATH}/plugins`);
const DEV_PLUGIN_REPO = path.resolve(`${HAIN_USER_PATH}/devplugins`);

const PLUGIN_REPOS = [
  INTERNAL_PLUGIN_REPO,
  MAIN_PLUGIN_REPO,
  DEV_PLUGIN_REPO
];

module.exports = {
  PLUGIN_PREF_DIR,
  APP_PREF_DIR,
  INTERNAL_PLUGIN_REPO,
  MAIN_PLUGIN_REPO,
  DEV_PLUGIN_REPO,
  LOCAL_STORAGE_DIR,
  PLUGIN_REPOS,
  __PLUGIN_PREINSTALL_DIR,
  __PLUGIN_UPDATE_LIST_FILE,
  __PLUGIN_UNINSTALL_LIST_FILE
};