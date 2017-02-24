'use strict';

import React from 'react';
import { Tab, Tabs } from './draggable-tab';


class InstanceTabs extends React.Component {
  constructor() {
    super();
    this.style = 'block';
  }

  render() {

    return <div style={ {display: this.style, zIndex: '1000'} }>
      <Tabs
        selectedTab={ this.props.activeInstanceKey }
        tabs={
          this.props.instances.map(instance => {
            return (<Tab key={instance.get('key')} title={instance.get('title')} ></Tab>);
          }).toJS()
        }
      />
    </div>;
  }
}

export default InstanceTabs;