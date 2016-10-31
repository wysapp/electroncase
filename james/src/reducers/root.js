import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import app from './app.js';
import requests from './requests.js';
import browsers from './browsers.js';
import urlMappings from './url-mappings.js';

const rootReducer = combineReducers({
  app,
  requests,
  browsers,
  urlMappings,
  routing: routerReducer
});

export default rootReducer;