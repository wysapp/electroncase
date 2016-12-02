'use strict';

const lo_isNumber = require('lodash.isnumber');
const lo_isArray = require('lodash.isarray');
const lo_assign = require('lodash.assign');
const lo_isPlainObject = require('lodash.isplainobject');
const lo_isFunction = require('lodash.isfunction');
const lo_reject = require('lodash.reject');
const lo_keys = require('lodash.keys');

const co = require('co');
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const fileUtil = require('../shared/file-util');


const logger = require('../shared/logger');
const PreferencesObject = require('../shared/preferences-object');

const conf = require('../conf');


module.exports = (workerContext) => {

  const pluginLoader = require('./plugin-loader')();

  let plugins = null;
  let pluginConfigs = null;
  let pluginPrefIds = null;
  const prefObjs = {};

  const pluginContextBase = {
    MAIN_PLUGIN_REPO: conf.MAIN_PLUGIN_REPO,
    DEV_PLUGIN_REPO: conf.DEV_PLUGIN_REPO,
    INTERNAL_PLUGIN_REPO: conf.INTERNAL_PLUGIN_REPO,

    app: workerContext.app,

    logger: workerContext.logger,

    globalPreferences: workerContext.globalPreferences,
  }


  function generatePluginContext(pluginId, pluginConfig) {
    const localStorage = storages.createPluginLocalStorage(pluginId);

    let preferences = undefined;

    const hasPreferences = (pluginConfig.prefSchema !== null);
    if (hasPreferences) {
      preferences = new PreferencesObject(prefStore, pluginId, pluginConfig.prefSchema);
      prefObjs[pluginId] = preferences;
    }

    return lo_assign({}, pluginContextBase, { localStorage, preferences});
  }


  _startup() {
    logger.debug('startup: begin');
    for (const prop in plugins) {
      logger.debug(`startup: ${prop}`);
      const startupFunc = plugins[prop].startup;
      if (!lo_isFunction(startupFunc)) {
        logger.debug(`${prop}: startup property should be a Function`);
        continue;
      }

      try {
        startupFunc();
      } catch (e) {
        logger.error(e.stack || e);
      }
    }
    logger.debug('startup: end');
  }

  function removeUninstalledPlugins(listFile, removeData) {
    if (!fs.existsSync(listFile))
      return;
    
    try {
      const contents = fs.readFileSync(listFile, { encoding: 'utf8'});
      const targetPlugins = contents.split('\n').filter((val) => (val && val.trim().length > 0));

      for(const packageName of targetPlugins) {
        const packageDir = path.join(conf.MAIN_PLUGIN_REPO, packageName);
        fse.removeSync(packageDir);

        if ( removeData) {
          const storageDir = path.join(conf.LOCAL_STORAGE_DIR, packageName);
          const prefFile = path.join(conf.PLUGIN_PREF_DIR, packageName);
          fse.removeSync(storageDir);
          fse.removeSync(prefFile);
        }

        logger.debug(`${packageName} has uninstalled successfully`);
      }
      fse.removeSync(listFile);
    } catch(e) {
      logger.error(`plugin uninstall error: ${e.stack || e}`);
    }

  }

  function movePreinstalledPlugins() {
    return co(function* () {
      const preinstallDir = conf.__PLUGIN_PREINSTALL_DIR;
      if (!fs.existsSync(preinstallDir))
        return;
      
      const packageDirs = fs.readdirSync(preinstallDir);
      const repoDir = conf.MAIN_PLUGIN_REPO;
      for(const packageName of packageDirs) {
        const srcPath = path.join(preinstallDir, packageName);
        const destPath = path.join(repoDir, packageName);
        yield fileUtil.move(srcPath, destPath);
        logger.debug(`${packageName} has installed successfully`);
      }
    }).catch((err) => {
      logger.error(`plugin uninstall error: ${err.stack || err}`);
    });
  }

  function* initialize() {
    removeUninstalledPlugins(conf.__PLUGIN_UNINSTALL_LIST_FILE, true);
    removeUninstalledPlugins(conf.__PLUGIN_UPDATE_LIST_FILE, false);

    yield movePreinstalledPlugins();

    const ret = pluginLoader.loadPlugins(generatePluginContext);
    plugins = ret.plugins;
    pluginConfigs = ret.pluginConfigs;
    pluginPrefIds = lo_reject(lo_keys(pluginConfigs), x => pluginConfigs[x].prefSchema === null);

    _startup();
  }

}