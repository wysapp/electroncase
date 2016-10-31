export const SET_REQUEST_FILTER = 'SET_REQUEST_FILTER';
export const SET_ACTIVE_REQUEST = 'SET_ACTIVE_REQUEST';
export const SET_CONTEXT_REQUEST = 'SET_CONTEXT_REQUEST';
export const SYNC_REQUESTS = 'SYNC_REQUESTS';


// selectors


export function setRequestFilter(filter = '') {
  return {
    type: SET_REQUEST_FILTER,
    filter
  };
}


export function syncRequests({requestData}) {
  return {
    type: SYNC_REQUESTS,
    requestData
  };
}