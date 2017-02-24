'use strict';

import _ from 'lodash';
import React from 'react';
import Draggable from 'react-draggable';

class Tabs extends React.Component {
  constructor(props) {
    super(props);

    const defaultState = this._tabStateFromProps(this.props);
    defaultState.selectedTab = this.props.selectedTab
      ? this.props.selectedTab 
      : this.props.tabs 
        ? this.props.tabs[0].key
        : '';
    
    this.state = defaultState;

    this.startPositions = [];
  }

  _tabStateFromProps(props) {
    const tabs = [];
    let idx = 0;
    React.Children.forEach(props.tabs, (tab) => {
      tabs[idx++] = tab;
    });

    return { tabs };
  }

  render() {
    
    const tabs = _.map(this.state.tabs, (tab) => {
      const tabTitle = tab.props.title;
      
      return (
        <Draggable 
          key={'draggable_tabs_' + tab.key}
          axis='x'
          cancel='.rdTabCloseIcon'
          start={{x: 0, y: 0}}
          moveOnStartChange={true}
          zIndex={100}
          bounds='parent'
          >
          <div 
            className={this.state.selectedTab === tab.key ? 'tab-item active' : 'tab-item'}
            ref={tab.key}>
            {tabTitle}
            <span className="icon icon-cancel icon-close-tab"></span>
          </div>
        </Draggable>
      );
    });

    return <div className="tab-group">
      {tabs}
      <div className="tab-item tab-item-btn" >
        {this.props.tabAddButton}
      </div>
    </div>;
  }
}


Tabs.defaultProps = {
  tabAddButton: (<span>{'+'}</span>),
}

Tabs.propTypes = {
  tabs: React.PropTypes.arrayOf(React.PropTypes.element),

  selectedTab: React.PropTypes.string,
  tabAddButton: React.PropTypes.element,
};

export default Tabs;