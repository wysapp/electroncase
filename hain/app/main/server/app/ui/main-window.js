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
    this.rpc = RpcChannel.create('#mainWindow', this._send.bind(this), this._on.bind(this));
    this._setupHandlers();
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

    this.rpc.define('execute', (__payload) => {
      const { pluginId, id, payload } = __payload;
      this.workerProxy.execute(pluginId, id, payload);
    });

    this.rpc.define('renderPreview', (__payload) => {
      const { ticket, pluginId, id, payload } = __payload;
      this.workerProxy.renderPreview(ticket, pluginId, id, payload);
    });

    this.rpc.define('buttonAction', (__payload) => {
      const { pluginId, id, payload } = __payload;
      this.workerProxy.buttonAction(pluginId, id, payload);
    });

    this.rpc.define('close', () => this.hide());
  }

  show() {
    if ( this.browserWindow === null)
      return;
    
    platformUtil.saveFocus();
    windowUtil.centerWindowOnSelectedScreen(this.browserWindow);
    this.browserWindow.show();
  }

  hide(dontRestoreFocus) {
    if ( this.browserWindow === null)
      return;
    
    this.browserWindow.setPosition(0, -1000);
    this.browserWindow.hide();

    if ( !dontRestoreFocus) 
      platformUtil.restoreFocus();
  }
}