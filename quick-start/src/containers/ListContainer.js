import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';

import List from '../components/List';
import ListSelectors from '../selectors/list';
import * as ListActions from '../actions/list';

import { showSeries } from '../actions/series';

function mapStateToProps(state) {
  return listSelectors(state);
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(_.assign({}, listActions, { showSeries}), dispatch);
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  return _assign({}, {
    currentListType: ownProps.location.pathname === '/animelist' ? 'anime' : 'manage'
  }, stateProps, dispatchProps, ownProps);
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(List);