
import {
  SWITCH_LIST_FAILURE,
  SWITCH_SYNCER
} from '../constants/actionTypes';

import request from 'superagent';
import moment from 'moment';
import _ from 'lodash';

import toshoStore from '../utils/store';
import settings from '../utils/settings';

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