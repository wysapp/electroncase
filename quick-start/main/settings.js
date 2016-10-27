const Configstore = require('configstore');

const _ = require('lodash');

const settingsStore = new Configstore(
  process.env.NODE_ENV === 'development' 
    ? 'cash-dev' 
    : 'cash-prod'
);

const defaultSettings = {
  minimizeToTray: true,
  APIBase: 'http://localhost:8080',
  listName: 'toshocat',
  allowMetrics: true,
  mediaDetection: true,
  runOnStartup: true,
  minimizedOnStartup: false,
  tenTatingScale: false,
  headerOrder: [
    {
      name: 'Title',
      property: 'title'
    }
  ]
};

settingsStore.set(_.merge({}, defaultSettings, settingsStore.all));

module.exports = settingsStore;