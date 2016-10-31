'use strict';

const electron = require('electron');
const globalShortcut = electron.globalShortcut;
const dialog = electron.dialog;

module.exports = class ShortcutService {
  constructor(appService, appPref) {
    this.appService = appService;
    this.appPref = appPref;
  }

  initializeShortcuts() {
    this.updateShortcuts();
    this.appPref.on('update', this.updateShortcuts.bind(this));
  }

  updateShortcuts() {
    this.clearShortcut();
    this.registerBasicToggleShortcut();
    this.registerCustomQueryShortcuts();
  }

  clearShortcut() {
    globalShortcut.unregisterAll();
  }
};