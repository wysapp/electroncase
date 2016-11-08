'use strict';

((function startup() {
  if ( require('electron-squirrel-startup')) return;

  const path = require('path');
  const extName = path.basename(process.execPath);
  if (!extName.startsWith('electron')) {
    process.chdir(path.dirname(process.execPath));
  }

  const dialog = require('electron').dialog;
  const electronApp = require('electron').app;
  electronApp.commandLine.appendSwitch('js-flags', '--always_compact');
  electronApp.commandLine.appendSwitch('js-flags', '--gc_glocal');
  electronApp.commandLine.appendSwitch('js-flags', '--optimize_for_size');

  const logger = require('./shared/logger');

  process.on('uncaughtException', (e) => {
    logger.debug(e);
    dialog.showErrorBox('Hain', `Unhandled Error: ${e.stack || e}`);
  })

  const Server = require('./server');
  const server = new Server();

  server.launch()
    .catch((e) => {
      dialog.showErrorBox('Hain', `Unhandled Notice Error: ${e.stack || e}`);
      electronApp.quit();
    });
})());