import {
  LOAD_LIST,
  SORT_LIST,
  SEARCH_LIST,
  UPDATE_LIST_ITEM,
  ADD_LIST_ITEM,
  REMOVE_LIST_ITEM,
  FILTER_LIST_STATUS,
  SWITCH_LIST_FAILURE,
  UPDATE_CURRENT_LIST_NAME,
  SWITCH_SYNCER,
  SWITCH_SYNCER_FAILURE,
  SYNC_LIST,
  UPDATE_HEADER_ORDER
} from '../constants/actionTypes';

import request from 'superagent';
import moment from 'moment';
import _ from 'lodash';

import toshoStore from '../utils/store';
import settings from '../utils/settings';


export function loadList() {
  return (dispatch, getState) => {
    const { currentListName } = getState();
    dispatch({
      type: LOAD_LIST,
      currentList: toshoStore.getList(currentListName)
    })
  }
}



export function removeSyncer() {
  return {
    type: SWITCH_SYNCER,
    syncer: null
  };
}

export function switchList(listName) {
  if ( !listName) {
    return { type: SWITCH_LIST_FAILURE };
  }

  settings.set({listName});

  return (dispatch) => {
    dispatch({
      type: UPDATE_CURRENT_LIST_NAME,
      currentListName: listName
    });
    dispatch(loadList());
  };
}