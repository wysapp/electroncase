'use strict';

import * as Instance from '../backend/instance';

import remote from 'remote';

export function addInstance(data) {
  const instance = Instance.addInstance(data);
  return this.update('instances', list => list.push(instance)).set('activeInstanceKey', instance.get('key'));
}