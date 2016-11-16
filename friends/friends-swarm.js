var events = require('events');
var subleveldown = require('subleveldown');
var webrtcSwarm = require('webrtc-swarm');

var signalhub = require('signalhub');
var hyperlog = require('hyperlog');
var through = require('through2');
var protobuf = require('protocol-buffers');
var multiline = require('multiline');
var nets = require('nets');

module.exports = createSwarm;

function createSwarm(db, defaultOpts) {
  var swarm = new events.EventEmitter();
  var logs = {};

  swarm.logs = logs;

  var processor;
  var sign;
  var verify;

  if ( !defaultOpts) defaultOpts = {};

  if ( !defaultOpts.hubs) {
    defaultOpts.hubs = [
      'https://signalhub.mafintosh.com'
    ]
  }

  var remoteConfigUrl = defaultOpts.remoteConfigUrl || 'https://instant.io/rtcConfig';

  swarm.changes = function(name) {
    return logs[name] ? logs[name].changes : 0;
  }

  swarm.sign = function(fn) {
    sign = fn;
  }

  swarm.verify = function(fn) {
    verify = fn;
  }

  swarm.process = function(fn) {
    processor = fn;
    Object.keys(logs).forEach(function(name) {
      startProcessor(logs[name]);
    })
  }

  swarm.addChannel = function(name) {
    if ( logs[name]) return;

    getRemoteConfig(remoteConfigUrl, function(err, config) {
      if (err) console.error('skipping remote config', err);
      if ( config) defaultOpts.config = config;

      var log = logs[name] = hyperlog(subleveldown(db, name));
      var id = 'friends-' + name;
      var hub = signalhub(id, defaultOpts.hubs);
      var sw = webrtcSwarm(hub, defaultOpts);

      log.peers = [];

      sw.on('peer', function(p, id) {
        var stream = log.replicate({live: true});

        log.peers.push(p);

        p.on('close', function() {
          var i = log.peers.indexOf(p);
          if ( i > -1) log.peers.splice(i, 1);
        })

        swarm.emit('peer', p, name, id, stream);

        stream.on('push', function() {
          swarm.emit('push', name);
        })

        stream.on('pull', function() {
          swarm.emit('pull', name);
        })

        p.pipe(stream).pipe(p);
      })

      if ( processor) startProcessor(log);
    })
  }

  function startProcessor(log) {
    
  }


  return swarm;

}

function getRemoteConfig(remoteConfigUrl, cb) {
  nets({url: remoteConfigUrl, json: true}, function gotConfig(err, resp, config) {
    if ( err || resp.statusCode > 299) config = undefined;
    cb(null, config);
  })
}