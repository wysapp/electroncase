import uniqid from 'uniqid';


export default class Proxy {
  constructor(update, config, urlMapper, createHoxy) {
    this._requests = [];
    this._urlMapper = urlMapper;
    this._config = config;
    this._update = update;
    this._isCachingEnabled = false;

    this._proxy = createHoxy();
    this._proxy.intercept('response-sent', this._onResponseSent.bind(this));
    this._proxy.intercept('request', this._onInterceptRequest.bind(this));
    this._proxy.intercept('response', this._onInterceptResponse.bind(this));
  }
}