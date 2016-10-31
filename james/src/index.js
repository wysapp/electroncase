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
import setupStore from './store/index.js';

ravenInit();



const store = setupStore(hashHistory);
const storeHistory = syncHistoryWithStore(hashHistory, store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={storeHistory} routes={routes} />
  </Provider>
, document.getElementById('app'));