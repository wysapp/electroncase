import fs from 'fs';
import EventEmitter from 'events';

import constants from '../constants.js';

class ProxyHandler extends EventEmitter {
  constructor(config, urlMapper) {
    super();

    this.config = config;
    this.hoxy = undefined;
    this.filter = undefined;
    this.status = undefined;
    this.cachingEnabled = false;

  }
}


export default function createProxyHandler(config, urlMapper) {
  return new ProxyHandler(config, urlMapper);
}