import hoxy from 'hoxy';
import fs from 'fs';
import EventEmitter from 'events';

import constants from '../constants.js';

import Proxy from '../service/proxy.js';

class ProxyHandler extends EventEmitter {
  constructor(config, urlMapper) {
    super();

    this.config = config;
    this.hoxy = undefined;
    this.filter = undefined;
    this.status = undefined;
    this.cachingEnabled = false;

    this.onStatusChange_({status: constants.PROXY_STATUS_STARTING});
    
    this.proxy = new Proxy(
      this.onUpdate_.bind(this),
      config,
      urlMapper,
      this.createHoxy.bind(this),
      this.isCaching.bind(this)
    );

  }

  createHoxy() {
    const opts = {};
    
    try {
      const key = fs.readFileSync(`${constants.USER_DATA}/root-ca.key.pem`);
      const cert = fs.readFileSync(`${constants.USER_DATA}/root-ca.crt.pem`);

      opts.certAuthority = {key, cert};
    } catch (e) {
      const [reason ] = e.message.split('\n');
      
      this.onStatusChange_({
        status: constants.PROXY_STATUS_NO_HTTPS,
        error: true,
        reason
      });
    }

    this.hoxy = hoxy.createServer(opts);
    this.hoxy.log('error warn info debug');
    this.hoxy.on('error', (event) => {
      if ( event.code === 'ENOTFOUND') return;
      console.warn('hoxy error: ', event.code, event);

      if ( event.code === 'EADDRINUSE' ) {
        this.onStatusChange_({
          status: constants.PROXY_STATUS_ERROR_ADDRESS_IN_USE,
          error: true,
          reason
        });
      }
    });

    return this.hoxy.listen(this.config.proxyPort, () => {
      if (this.status.error) return;
      
      this.onStatusChange_({
        status: constants.PROXY_STATUS_WORKING
      });
    });
  }

  convertRequest_(request) {
    return Object.assign({}, request, request._data, {
      query: request.query,
      params: request.params,
      fullUrl: typeof request.fullUrl === 'function' ? request.fullUrl() : request.fullUrl,
      _data: null,
      _events: null,
      source: null,
      slow: null
    });
  }

  convertResponse_(response) {
    return Object.assign({}, response, response._data, {
      params: response.params,
      _data: null,
      _events: null,
      source: null,
      slow: null
    });
  }

  sanitizeRequest_(includeResponse = false) {
    return ({request, response}) => {
      const container = {
        id: request.id
      };

      container.request = this.convertRequest_(request);
      container.request.original = this.convertRequest_(request.original);

      if ( includeResponse) {
        container.response = this.convertResponse_(response);
      } else {
        container.response = {
          statusCode: response.statusCode
        };
      }
      return container;
    }
  }

  getRequestData() {
    const requestData = this.proxy.getRequestData(this.filter);
    requestData.requests = requestData.requests.map(this.sanitizeRequest_());
    return requestData;
  }

  onUpdate_() {
    this.emit('update', {
      requestData: this.getRequestData()
    });
  }

  onStatusChange_(status) {
    this.status = status;
    
    this.emit('status', status);
  }

  setCaching(caching) {
    this.isCaching = caching;
  }

  isCaching() {
    return this.isCaching;
  }

  setFilter(filter) {
    this.filter = filter;
    this.onUpdate_();
  }
}


export default function createProxyHandler(config, urlMapper) {
  return new ProxyHandler(config, urlMapper);
}