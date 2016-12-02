'use strict';

import Immutable from 'immutable';
import { ipcRenderer } from 'electron';

export function getFavorites() {
  return Immutable.fromJS(JSON.parse(localStorage.getItem('favorites')) || []);
}