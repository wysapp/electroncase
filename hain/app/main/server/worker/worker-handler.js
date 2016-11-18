'use strict';

const logger = require('../../shared/logger');

module.exports = class WorkerHandler {
  constructor(workerClient, appService, apiService) {
    this.workerClient= workerClient;
    this.appService = appService;
    this.apiService = apiService;
  }

  initialize() {
    const rpc = this.workerClient.rpc;
  }
}