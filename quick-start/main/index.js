const _ = require('lodash');
const path = require('path');

const { app, ipcMain, Tray, Menu, autoUpdater } = require('electron');
const Main = require('./MainWindow');

const Detector = require('./MediaDetector');
const Notification = require('./NotificationWindow');

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

  const notification = new Notification();
  if ( __DEV__ ) {
    notification.window.openDevTools({
      detach: true
    });
  }

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


  let notificationTimeout;
  ipcMain.on('scrobble-request', (event, scrobbleData) => {
    notification.show();
    notification.window.webContents.send('scrobble-request', scrobbleData);
    clearTimeout(notificationTimeout);
    notificationTimeout = setTimeout(() => {
      notification.hide();
    }, 11000);
  });

  // On update
  ipcMain.on('scrobble-confirm', (event, scrobbleData) => {
    main.window.webContents.send('scrobble-confirm', scrobbleData);
    clearTimeout(notificationTimeout);
    notificationTimeout = setTimeout(() => {
      notification.hide();
    }, 400);
  });

  // Cancelled scrobble
  ipcMain.on('scrobble-cancel', () => {
    clearTimeout(notificationTimeout);
    notificationTimeout = setTimeout(() => {
      notification.hide();
    }, 400);
  });

  let prevMedia = {};
  const detector = new Detector();
  
  const scrobble = () => {
    if (settings.get('mediaDetection')) {
      detector.scan()
      .then((parsedMedia) => {
        console.log('ssssssssssssssssssssssssss', parsedMedia);
        if (!_.isEqual(prevMedia, parsedMedia[0]) && !main.window.webContents.isLoading()) {
          main.window.webContents.send('media-detected', parsedMedia[0]);
          prevMedia = parsedMedia[0];
        }
        setTimeout(() => {
          scrobble();          
        }, 2000);
      })
      .catch(() => {
        
        main.window.webContents.send('media-lost');
        prevMedia = {};
        setTimeout(() => {
          scrobble();
        }, 2000);
      });
    } else {
      main.window.webContents.send('media-lost');
      prevMedia = {};
      setTimeout(() => {
        scrobble();
      }, 2000);
    }
  };

  scrobble();

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