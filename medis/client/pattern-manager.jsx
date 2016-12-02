'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import remote from 'remote';
import { ipcRenderer } from 'electron';

document.addEventListener('DOMContentLoaded', function() {
  remote.getCurrentWindow().show();
});