'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import remote from 'remote';
import { ipcRenderer } from 'electron';

import App from './components/main/App';

require('./styles/global.scss');

document.addEventListener('DOMContentLoaded', function() {
  remote.getCurrentWindow().show();
});


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('content')
);