'use strict';

module.exports = class WorkerProxy {
  constructor(workerClient) {
    this.workerClient = workerClient;
  }

  initialize(appPref) {
    this.workerClient.rpc.call('initialize', { appPref});
  }
}