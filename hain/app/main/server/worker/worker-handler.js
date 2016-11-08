'use strict';

const logger = require('../../shared/logger');

module.exports = class WorkerHandler {
  constructor(workerClient, appService, apiService) {
    this.workerClient = workerClient;
    this.appService = appService;
    this.apiService = apiService;
  }

  initialize() {
    const rpc = this.workerClient.rpc;
    rpc.define('onError', this.handleOnError.bind(this));
    rpc.define('callApi', this.handleCallApi.bind(this));
  }

  handleOnError(payload) {
    logger.error(`Unhandled Plugin Error: ${payload}`);
  }

  handleCallApi(payload) {
    const { moduleName, funcName, args } = payload;
    return this.apiService.callApi(moduleName, funcName, args);
  }
}