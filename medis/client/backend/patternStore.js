'use strict';

import Immutable from 'immutable';
import { ipcRenderer } from 'electron';

export function getPatternStore(){
  return Immutable.fromJS(JSON.parse(localStorage.getItem('patternStore')) || {});
}