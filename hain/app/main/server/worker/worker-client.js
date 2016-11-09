'use strict';

const cp = require('child_process');
const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

const logger = require('../../shared/logger');
const RpcChannel = require('../../shared/rpc-channel');

module.exports = class WorkerClient extends EventEmitter {
  constructor() {
    super();

    this.workerProcess = null;
    this.rpc = RpcChannel.create('#worker', this.send.bind(this), this.on.bind(this));
  }

  loadWorker() {
    logger.debug('WorkerWrapper: loading worker');

    const workerPath = path.join(__dirname, '../../worker/index.js');
    if (!fs.existsSync(workerPath))
      throw new Error('can\'t execute plugin process');
    
    this.workerProcess = cp.fork(workerPath, [], {
      execArgv: ['--optimize_for_size', '--gc_global', '--always_compact'],
      silent: true
    });

    this.workerProcess.stdout.on('data', process.stdout.write);
    this.workerProcess.stderr.on('data', process.stdout.write);

    this.workerProcess.on('message', (msg) => this._handleWorkerMessage(msg));
  }

  send(channel, payload) {
    this.workerProcess.send({channel, payload});
  }

  _handleWorkerMessage(msg) {
    const { channel, payload } = msg;
    this.emit(channel, payload);
  }
}