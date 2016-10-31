'use strict';

module.exports = class WorkerProxy {
  constructor(workerClient) {
    this.workerClient = workerClient;
  }
}