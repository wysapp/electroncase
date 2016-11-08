module.exports = Desktop;

var inherits = require('util').inherits;
var remote = require('remote');
var app = remote.require('app');
var shell = require('shell');
var BrowserWindow = remote.require('browser-window');

var App = require('./');
var config = require('../config');

inherits(Desktop, App);


function Desktop() {  
  if (!(this instanceof Desktop)) return new Desktop();
  var currentWindow = remote.getCurrentWindow();  
  var self = this;

  App.call(this, document.body, currentWindow);

  currentWindow.removeAllListeners();

  currentWindow.on('focus', function() {
    self.setBadge(false);
  });

  this.on('showGitHelp', this.showGitHelp.bind(this));
  this.on('setBadge', this.setBadge.bind(this));
  this.on('openUrl', function(url) {
    shell.openExternal(url);
  })

}

Desktop.prototype.showGitHelp = function() {
  var gitHelp = new BrowserWindow({
    width: 600,
    height: 525,
    show: false,
    center: true,
    resizable: false
  });

  gitHelp.on('closed', function() {
    gitHelp = null;
  })

  gitHelp.loadURL(config.GIT_HELP);
  gitHelp.show();
}

Desktop.prototype.setBadge = function(num) {
  if ( !app.dock) return;
  if (num === false) return app.dock.setBadge('');
  if ( num == null) 
    this._notifications++;
  else 
    this._notifications = num;
  app.dock.setBadge(this._notifications.toString());
}