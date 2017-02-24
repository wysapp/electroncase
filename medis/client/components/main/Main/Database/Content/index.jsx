'use strict';

import React from 'react';
import TabBar from './TabBar';


class Content extends React.Component {
  constructor(){
    super();
    this.state = {
      pattern: '',
      db: 0,
      version: 0,
      tab: 'Content'
    };
  }

  init(keyName) {
    this.setState({keyType: null});
    if ( keyName !== null) {
      this.setState({keyType: null});
      this.props.redis.type(keyName).then(keyType => {
        if (keyName === this.props.keyName) {
          this.setState({keyType});
        }
      });
    }
  }

  componentDidMount() {
    this.init(this.props.keyName);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.keyName !== this.props.keyName || nextProps.version !== this.props.version) {
      this.init(nextProps.keyName);
    }
    if (nextProps.metaVersion !== this.props.metaVersion){
      this.setState({version: this.state.version + 1});
    }
  }

  handleTabChange(tab) {
    this.setState({tab});
  }

  render() {
    
    return <div className="pane sidebar" style={{height: '100%'}}>
      <TabBar 
        onSelectTab={this.handleTabChange.bind(this)}
      />
    </div>
  }
}

export default Content;