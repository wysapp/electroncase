import {
  SCROBBLE_REQUEST,
  SCROBBLE_SUCCESS,
  SCROBBLE_CLEAR
} from '../constants/actionTypes';
import settings from '../utils/settings';

import _ from 'lodash';
import jw from '../../vendor/jw';


export function clearScrobble() {
  return {
    type: SCROBBLE_CLEAR
  };
}