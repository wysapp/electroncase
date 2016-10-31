'use strict';

const lo_includes = require('lodash.includes');
const co = require('co');
const cp = require('child_process');

const electron = require('electron');
const electronApp = electron.app;

const MainWindow = require('./ui/main-window');
const TrayService = require('./ui/tray-service');

const firstLaunch = require('./first-launch');
const ShortcutService = require('./shortcut-service');


const logger = require('../../shared/logger');

const AutoLauncher = require('./auto-launcher');
const autoLauncher = new AutoLauncher({
  name: 'Hain',
  path: `"${process.execPath}" --silent`
});

module.exports = class AppService {
  constructor(prefManager, workerClient, workerProxy) {
    this._isRestarting = false;
    this.prefManager = prefManager;
    this.workerClient = workerClient;
    this.workerProxy = workerProxy;

    this.mainWindow = new MainWindow(workerProxy);

    this.shortcutService = new ShortcutService(this, prefManager.appPref);
  }

  initializeAndLaunch() {
    const self = this;
    return co(function* () {
      if ( firstLaunch.isFirstLaunch) 
        autoLauncher.enable();
      
      const isRestarted = (lo_includes(process.argv, '--restarted'));
      const silentLaunch = (lo_includes(process.argv, '--silent'));
      const shouldQuit = electronApp.makeSingleInstance((cmdLine, workingDir) => {
        if ( self._isRestarting)
          return;
        self.mainWindow.show();
      });

      if ( shouldQuit && !isRestarted) 
        return electronApp.quit();
      
      electronApp.on('ready', () => {
        self.shortcutService.initializeShourtcuts();
        self.mainWindow.createWindow(() => {
          if (!silentLaunch || isRestarted) 
            self.mainWindow.show();
          
          if ( isRestarted) 
            self.mainWindow.enqueueToast('Restarted');
        });

        self.trayService.createTray();
        iconProtocol.register();
      });
    }).catch((err) => {
      logger.error(err);
    });
  }
}