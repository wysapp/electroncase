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

  _onResponseSent(req) {
    req.completed = new Data().getTime();
    req.took = req.completed - req.started;
    req.done = true;
    this._update();
  }

  _onInterceptResponse(request, response) {
    if ( !this._isCachingEnabled) {
      delete response.headers['if-modified-since'];
      delete response.headers['if-none-match'];
      delete response.headers['last-modified'];
      delete response.headers.etag;

      response.headers.expires = '0';
      response.headers.pragma = 'no-cache';
      response.headers['cache-control'] = 'no-cache';
    }
  }

  _onInterceptRequest(request, response, cycle) {
    const fullUrl = request.fullUrl();

    request.done = false;
    request.id = uniqid();
    request.started = new Data().getTime();
    request.original = {
      fullUrl,
      port: request.port,
      protocol: request.protocol,
      hostname: request.hostname,
      url: request.url
    };

    const requestContainer = {
      request: request,
      response: response
    };

    try {
      this._requests.unshift(requestContainer);
      if ( this._requests.length > this._config.maxLogEntries) {
        this._requests.pop();
      }

      request.isMappingActive = this._urlMapper.isActiveMapperUrl(fullUrl);
      request.isMapperUrl = this._urlMapper.isMapperUrl(fullUrl);

      if ( request.isMappingActive) {
        const mappedUrl = this._urlMapper.get(fullUrl);
        request.isLocal = mappedUrl.isLocal;
        request.newUrl = mappedUrl.newUrl;

        if ( request.isLocal) {
          return cycle.serve({
            path: request.newUrl
          }, () => {
            this._update();
          });
        }

        request.fullUrl(request.newUrl);
      }

      this._update();
    } catch (e) {
      console.error(e);
    }
  }
}