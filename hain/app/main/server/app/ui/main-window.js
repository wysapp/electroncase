'use strict';

const electron = require('electron');
const shell = electron.shell;
const BrowserWindow = electron.BrowserWindow;

const platformUtil = require('../../../../platform-util');
const windowUtil = require('./window-util');
const RpcChannel = require('../../../shared/rpc-channel');
const ipc = electron.ipcMain;

module.exports = class MainWindow {
  constructor(workerProxy) {
    this.workerProxy = workerProxy;
    this.browserWindow = null;
    
  }

  createWindow(onComplete) {
    const browserWindow = new BrowserWindow({
      width: 800,
      height: 530,
      alwaysOnTop: true,
      center: true,
      frame: false,
      show: false,
      closable: false,
      minimizable: false,
      maximizable: false,
      moveable: false,
      resizable: false,
      skipTaskbar: true
    });

    if ( onComplete) 
      browserWindow.webContents.on('did-finish-load', onComplete);

    browserWindow.webContents.on('new-window', (evt, url) => {
      shell.openExternal(encodeURI(url));
      evt.preventDefault();
    });

    browserWindow.loadURL(`file://${__dirname}/../../../../dist/index.html`);
    browserWindow.on('blur', () => {
      if (browserWindow.webContents.isDevToolsOpened())
        return;
      this.hide(true);
    });

    this.browserWindow = browserWindow;
  }

  show() {
    if (this.browserWindow === null)
      return;
    
    platformUtil.saveFocus();
    windowUtil.centerWindowOnSelectedScreen(this.browserWindow);
    this.browserWindow.show();
  }

  hide(dontRestoreFocus) {
    if (this.browserWindow === null)
      return;
    
    this.browserWindow.setPosition(0, -1000);
    this.browserWindow.hide();

    if (!dontRestoreFocus)
      platformUtil.restoreFocus();
  }
}