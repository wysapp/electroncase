import {
  SHOW_SERIES_REQUEST,
  SHOW_SERIES_SUCCESS,
  SHOW_SERIES_FAILURE,
  HIDE_SERIES,
  LOAD_SERIES_EPISODES_REQUEST,
  LOAD_SERIES_EPISODES_SUCCESS,
  LOAD_SERIES_EPISODES_FAILURE
} from '../constants/actionTypes';

import _ from 'lodash';
import request from 'superagent';
import settings from '../utils/settings';

export function showSeries(id, type = 'anime', seriesData) {
  if ( seriesData) {
    return (dispatch) => {
      dispatch({
        type: SHOW_SERIES_SUCCESS,
        series: seriesData
      });
    };
  }

  return (dispatch) => {
    dispatch({
      type: SHOW_SERIES_REQUEST
    });

    return new Promise((resolve, reject) => {
      request
        .get(`${settings.get('APIBase')}/${type}/${id}`)
        .end((err, res) => {
          if (err) {
            dispatch({
              type: SHOW_SERIES_FAILURE
            });
            reject(err);
          } else {
            dispatch({
              type: SHOW_SERIES_SUCCESS,
              series: res.body
            });
            resolve(res.body);
          }
        });
    });
  }
}


export function hideSeries() {
  return {
    type: HIDE_SERIES
  };
}