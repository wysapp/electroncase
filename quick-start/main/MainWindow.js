const path = require('path');
const { BrowserWindow } = require('electron');
const Positioner = require('electron-positioner');

const CashWindow = require('./CashWindow');
const settings = require('./settings');

class MainWindow extends CashWindow {
  
  constructor() {
    super();
    this.window = new BrowserWindow({
      minWidth: 500,
      minHeight: 500,
      width: 1180,
      height: 800,
      title: 'cash',
      frame: false,
      transparent: false,
      backgroundColor: '#24282a',
      show: false
    });

    this.window.loadURL(`${path.resolve(__dirname, './main.html')}`);

    this.positioner = new Positioner(this.window);
    this.positioner.move('center');

    this.window.webContents.on('did-finish-load', () => {
      this.show();
    });
  }

  show() {
    if (!settings.get('minimizedOnStartup')) {
      setTimeout(()=> {
        this.window.focus();
        this.window.show();
      }, 500);
    }
  }
}

module.exports = MainWindow;