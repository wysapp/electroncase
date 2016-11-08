module.exports = window.App = App;

var EventEmitter = require('events').EventEmitter;
var catNames = require('cat-names');
var delegate = require('dom-delegate');

var leveldown = require('leveldown');
var levelup = require('levelup');
var subleveldown = require('subleveldown');
var richMessage = require('rich-message');
var Swarm = require('../friends-swarm');
var yo = require('yo-yo');

var inherits = require('inherits');
var githubCurrentUser = require('github-current-user');

var config = require('../config');

inherits(App, EventEmitter);

function App(el, currentWindow) {
  var self = this;
  if (!(self instanceof App)) return new App(el);
  self._notifications = 0;
  self.currentWindow = currentWindow;

  var db = levelup(config.DB_PATH, {db: leveldown});

  db.channels = subleveldown(db, 'channels', {valueEncoding: 'json'});
  db.aliases = subleveldown(db, 'aliases', {valueEncoding: 'json'});

  delegate(el).on('click', 'a', function(e) {
    var href = e.target.getAttribute('href');
    if (/^https?:/.test(href)) {
      e.preventDefault();
      self.emit('openUrl', href);
    } else if (/^#/.test(href)) {
      self.emit('addChannel', href);
    }
  })

  self.data = {
    peers: 0,
    username: 'Anonymous ('+ catNames.random() +')',
    channels: [],
    messages: [],
    users: [],
    activeChannel: null
  };

  var swarm = window.swarm = Swarm(subleveldown(db, 'swarm'), {maxPeers: 20});
  var channelsFound = {};
  var usersFound = {};
  var changesOffsets = {};

  if (! githubCurrentUser.verify) {
    githubCurrentUser.verify(onCurrentUser);
  } else {
    // onCurrentUser(null, false);
    onCurrentUser(null, true, '345805844@qq.com');
  }
    

  function onCurrentUser(err, verified, username) {
   
    // if (err || !verified) self.emit('showGitHelp');
    
    
    if (err) return console.error(err.message || err);
    if ( verified) {
      self.data.username = username;
      // swarm.sign(Signature.signer(username));

      self.data.message = self.data.messages.map(function(message) {
        return richMessage(message, self.data.username);
      })

      render();
    }
  }

  self.views = {};

  var tree = self.render();
  el.appendChild(tree);

  function render() {
    var newTree = self.render();
    yo.update(tree, newTree);
  }
  
}

App.prototype.render = function() {
  var self = this;
  var views = self.views;
  var data = self.data;

  return yo`
    <div class="layout">
      <div class="sidebar">
        <div class="sidebar-scroll">
          ${views.channels.render(data.channels)}
          ${views.users.render(data.users)}
        </div>
        ${views.status.render(data.username, data.peers)}
      </div>
      <div class="content">
        ${views.messages.render(data.activeChannel, data.users)}
        ${views.composer.render(data)}
      </div>
    </div>
  `
}

App.prototype.isFocused = function() {
  if ( this.currentWindow) return this.currentWindow.isFocused();
  return true;
}