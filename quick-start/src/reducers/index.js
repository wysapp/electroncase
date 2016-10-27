import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import _ from 'lodash';


import * as listReducers from './list';
import * as scrobbleReducers from './scrobble';

export default combineReducers(
  _.assign({},
    listReducers,
    scrobbleReducers,
    {
      routing: routerReducer
    }
  )
);