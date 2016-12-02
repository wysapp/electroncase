'use strict';

const app = require('app');
const windowManager = require('./windowManager');
const Menu = require('menu');

const menuTemplate = [{
  label: 'File',
  submenu: [{
    label: 'New Connection Window',
    accelerator: 'CmdOrCtrl+N',
    click() {
      windowManager.create();
    }
  }, {
    type: 'separator'
  }, {
    label: 'Close Window',
    accelerator: 'Shift+CmdOrCtrl+W',
    click() {
      windowManager.current.close();
    }
  }]
}, {
  label: 'View',
  submenu: [{
    label: 'Reload',
    accelerator: 'CmdOrCtrl+R',
    click(item, focusedWindow) {
      if (focusedWindow) {
        focusedWindow.reload();
      }
    }
  }, {
    label: 'Toogle Full Screen',
    accelerator: (function() {
      if (process.platform === 'darwin') {
        return 'Ctrl+Command+F';
      }
      return 'F11';
    })(),
    click(item, focusedWindow) {
      if ( focusedWindow) {
        focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
      }
    }
  }, {
    label: 'Toggle Developer Tools',
    accelerator: (function() {
      if (process.platform === 'darwin') {
        return 'Alt+Command+I';
      }
      return 'Ctrl+Shift+I';
    })(),
    click(item, focusedWindow) {
      
      if (focusedWindow) {
        focusedWindow.toggleDevTools();
      }
    }
  }]
}, {
  label: 'Window',
  role: 'window',
  submenu: [{
    label: 'Minimize',
    accelerator: 'CmdOrCtrl+M',
    role: 'minimize'
  }, {
    label: 'Close',
    accelerator: 'CmdOrCtrl+W',
    role: 'close'
  }]
}, {
  label: 'Help',
  role: 'help',
  submenu: [{
    label: 'Report an Issue...',
    click() {
      require('shell').openExternal('http://www.github.com');
    }
  }, {
    label: 'Learn More',
    click() {
      require('shell').openExternal('http://getmedis.com');
    }
  }]
}];


let baseIndex = 0;
if ( process.platform == 'darwin') {
  baseIndex = 1;

  menuTemplate.unshift({
    label: app.getName(),
    submenu: [{
      label: 'About ' + app.getName(),
      role: 'about'
    }]
  })
}


const menu = Menu.buildFromTemplate(menuTemplate);

module.exports = menu;