import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import app from './app.js';
import urlMappings from './url-mappings.js';

const rootReducer = combineReducers({
  app,
  urlMappings,
  routing: routerReducer
});

export default rootReducer;