const _ = require('lodash');
const path = require('path');

const { app, ipcMain, Tray, Menu, autoUpdater } = require('electron');
const Main = require('./MainWindow');

const settings = require('./settings');
const AutoLaunch = require('auto-launch');
const autoLaunch = new AutoLaunch({
  name: 'Cash'
});

const __DEV__ = (process.env.NODE_ENV === 'development');


if ( require('electron-squirrel-startup')) {
  return;
}

if (settings.get('runOnStartup')) {
  autoLaunch.enable();
}

let main = null;
const shouldQuit = app.makeSingleInstance(() => {
  if ( main) {
    main.restore();
  }
});

if ( shouldQuit) {
  app.quit();
  return;
}


let mustQuit = false;

app.on('ready', ()=> {
  console.log(`Cash ${app.getVersion()}`);

  main = new Main();
  if ( __DEV__) {
    main.window.openDevTools({
      detach: true
    });
  }

  const tray = new Tray(path.resolve(__dirname, './app-icon.ico'));
  tray.on('click', () => {
    main.restore();
  });

  tray.setContextMenu(Menu.buildFromTemplate([
    {
      label: 'Open Cash',
      click: () => {
        main.restore();
      }
    },
    {
      label: 'Check for updates',
      click: () => {
        mustQuit = true;
      }
    }, {
      type: 'separator'
    }, {
      label: 'Quit Cash',
      click: () => {
        mustQuit = true;
        tray.destroy();
        app.quit();
      }
    }
  ]));

  tray.setToolTip('Cash');

  main.window.on('close', (e) => {
    if (settings.get('minimizeToTray') && !mustQuit) {
      main.window.minimize();
      main.window.setSkipTaskbar(true);
      e.preventDefault();
    } else {
      main.window.close();
    }
  });

  main.window.on('closed', () => {
    tray.destroy();
    app.quit();
  });


  const scrobble = () => {
    if (settings.get('mediaDetection')) {
      
    }
  }


});


app.on('window-all-closed', () => {
  app.quit();
});


/*
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;


let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  });

  mainWindow.loadURL(`file://${__dirname}/main.html`);

  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function(){
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', function() {
  if (mainWindow === null) {
    createWindow();
  }
})*/