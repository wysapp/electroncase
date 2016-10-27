import {
  SWITCH_SYNCER
} from '../constants/actionTypes';

import Immutable from 'seamless-immutable';
import _ from 'lodash';

import settings from '../utils/settings';
import toshoStore from '../utils/store';


let initialState = {
  listSearchQuery: '',
  listSortBy: 'title',
  listSortOrder: 'asc',
  listStatusFilter: 'current',
  currentSyncer: null,
};

if ( process.env.APP_ENV === 'browser') {
  initialState = _.merge(initialState, {
    currentListName: settings.get('listName'),
    currentList: toshoStore.getList(settings.get('listName'))
  });
} else {
  initialState = _.merge(initialState, {
    currentListName: settings.get('listName'),
    currentList: []
  });
}

export function currentSyncer(state = initialState.currentSyncer, action = {}) {
  switch (action.type) {
    case SWITCH_SYNCER:
      return action.syncer;
    default:
      return state;
  }
}