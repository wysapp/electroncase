import { app, BrowserWindow, ipcMain as ipc } from 'electron';
import squirrelStartup from 'electron-squirrel-startup';
import localShortcut from 'electron-localshortcut';

import path from 'path';


if (squirrelStartup) {
  process.exit(0);
}

let mainWindow = null;

console.log('Loading URL mappings...');


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