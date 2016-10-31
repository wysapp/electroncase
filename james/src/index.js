import { ipcRenderer as ipc } from 'electron';

import React from 'react';
import ReactDOM from 'react-dom';
import throttle from 'lodash.throttle';

import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import config from './config.js';
import routes from './routes.js';

import ravenInit from './service/raven.js';
import setupShortcuts from './service/shortcuts.js';
import setupStore from './store/index.js';

import { init } from './actions/app.js';
import { syncRequests } from './actions/requests.js';

ravenInit();

const store = setupStore(hashHistory);
const storeHistory = syncHistoryWithStore(hashHistory, store);

const onProxySync = throttle((evt, payload) => {
  store.dispatch(syncRequests(payload));
}, 300);

ipc.on('proxy-sync', onProxySync);

setupShortcuts(store);
store.dispatch(init({ config }));

ReactDOM.render(
  <Provider store={store}>
    <Router history={storeHistory} routes={routes} />
  </Provider>
, document.getElementById('app'));