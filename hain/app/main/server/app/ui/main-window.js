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
    this.rpc = RpcChannel.create('#MainWindow', this._send.bind(this), this._on.bind(this));
    this._setupHandlers();    
  }

  createWindow(onComplete) {
    const browserWindow = new BrowserWindow({
      width: 800,
      height: 530,
      alwaysOnTop: false,
      center: true,
      frame: true,
      show: false,
      closable: false,
      // minimizable: false,
      // maximizable: false,
      // moveable: false,
      // resizable: false,
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
      // this.hide(true);
    });

    this.browserWindow = browserWindow;
  }

  _send(channel, msg) {
    this.browserWindow.webContents.send(channel, msg);
  }

  _on(channel, listener) {
    ipc.on(channel, (evt, msg) => listener(msg));
  }

  _setupHandlers() {
    this.rpc.define('search', (payload) => {
      const { ticket, query } = payload;
      this.workerProxy.searchAll(ticket, query);
    });
    
    this.rpc.define('close', () => this.hide());
  }

  show() {
    if (this.browserWindow === null)
      return;
    
    platformUtil.saveFocus();
    // windowUtil.centerWindowOnSelectedScreen(this.browserWindow);
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