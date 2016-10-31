'use strict';

const logger = require('../../shared/logger');
const fs = require('fs');

module.exports = class ApiService {
  constructor(appService) {
    this.appService = appService;
    this.apiModuleInstances = {};
  }

  loadApiModules() {
    const apiContext = {
      appService: this.appService
    };

    const moduleFiles = fs.readdirSync(`${__dirname}/apis`);
    for( const moduleFile of moduleFiles) {
      if ( !moduleFile.endsWith('.api.js')) 
        continue;
      
      const moduleName = moduleFile.substring(0, moduleFile.length - 7).toLowerCase();
      const ModuleClass = require(`./apis/${moduleFile}`);
      if (ModuleClass === undefined) {
        logger.error(`ApiService: Can't load the module: ${moduleFile}`);
        continue;
      }  

      const moduleInstance = new ModuleClass(apiContext);
      this.apiModuleInstances[moduleName] = moduleInstance;

      logger.debug(`ApiService: ${moduleFile} loaded`);
    }
  }
}