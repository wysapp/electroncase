'use strict';

import React from 'react';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import InstanceTabs from './InstanceTabs';

import DocumentTitle from 'react-document-title';



class App extends React.Component {
  render() {
    console.log('App-props:', this.props);
    const { instances, activeInstance, favorites, patternStore } = this.props;

    const version = activeInstance.get('version') ? `(Redis ${activeInstance.get('version')})` : '';
    return <DocumentTitle title={version + activeInstance.get('title')}>
      <div className="window">
        <InstanceTabs
          instances={instances}
          activeInstanceKey={activeInstance.get('key')}
        />
      </div>
    </DocumentTitle>;
  }
}

const selector = createSelector(
  state => state.get('instances'),
  state => state.get('activeInstanceKey'),
  state => state.get('favorites'),
  state => state.get('patternStore'),
  (instances, activeInstanceKey, favorites, patternStore) => {
    const activeInstance = instances.find(instance => instance.get('key') === activeInstanceKey);
    return {
      instances,
      activeInstance,
      favorites,
      patternStore
    };
  }
);

export default connect(selector)(App);