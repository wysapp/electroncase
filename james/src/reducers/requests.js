import { combineReducers } from 'redux';

import * as actions from '../actions/requests.js';

const initialState = {
  filter: null,
  active: null,
  context: null,
  data: {
    requests: [],
    totalCount: 0,
    filteredCount: 0
  }
};




function data(state = initialState.data, action) {
  if ( action.type !== actions.SYNC_REQUESTS) {
    return state;
  }
  
  return action.requestData;
}

export default combineReducers({
  data
});


export function hasRequests(state) {
  return state.requests.data.totalCount > 0;
}

export function getRequestFilter(state) {
  return state.requests.filter;
}