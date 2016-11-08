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

  send(channel, payload) {
    this.workerProcess.send({channel, payload});
  }
}