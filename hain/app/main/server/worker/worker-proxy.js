'use strict';

module.exports = class WorkerProxy {
  constructor(workerClient) {
    this.workerClient = workerClient;
  }

  searchAll(ticket, query) {
    this.workerClient.rpc.call('searchAll', { ticket, query });
  }
}