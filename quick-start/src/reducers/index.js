import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import _ from 'lodash';

export default combineReducers(
  _.assign({},
    {
      routing: routerReducer
    }
  )
);