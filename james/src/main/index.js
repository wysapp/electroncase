import { app, BrowserWindow, ipcMain as ipc } from 'electron';
import squirrelStartup from 'electron-squirrel-startup';
import localShortcut from 'electron-localshortcut';

import path from 'path';

import constants from '../constants.js';
import config from '../config.js';


import createMenu from './menu.js';
import createUrlMapper from './url-mapper.js';
import createProxy from './proxy.js';

if (squirrelStartup) {
  process.exit(0);
}

let mainWindow = null;
createMenu();

console.log('Loading URL mappings...');
const urlMapper = createUrlMapper({
  filename: `${constants.USER_DATA}/data.nedb`,
  autoload: true
});

console.log('Starting proxy...');
const proxy = createProxy(config, urlMapper.urlMapper);

app.on('window-all-closed', () => app.quit());

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    autoHideMenuBar: true,
    show: false
  });

  const index = path.join(__dirname, '..', 'index.html');
  mainWindow.loadURL(`file://${index}`);

  mainWindow.webContents.on('did-finish-load', ()=> {

    mainWindow.show();
  })


  mainWindow.on('closed', function() {
    mainWindow = null;
  })
});

ipc.on('keyboard-listen', (event, {key}) => {
  localShortcut.register(mainWindow, key, () => event.sender.send('keyboard-press', key));
});