'use strict';

import React from 'react';
import SplitPane from 'react-split-pane';
import KeyBrowser from './KeyBrowser';
import Content from './Content';

class Database extends React.Component {
  constructor() {
    super();

    this.$window = $(window);
    this.state = {
      sidebarWidth: 260,
      key: null,
      db:0,
      version: 0,
      metaVersion: 0,
      pattern: '',
      clientHeight: this.$window.height() - $('.tab-group').height()
    };
  }

  handleCreateKey(key) {
    this.setState({key, pattern: key});
  }

  render() {
    
    return <SplitPane
      className="pane-group"
      minSize="250"
      split="vertical"
      defaultSize={260}
      ref="node"
      onChange={size => {
        this.setState({ sidebarWidth: size });
      }}>
      <KeyBrowser
        patternStore={this.props.patternStore}
        pattern={this.state.pattern}
        height={this.state.clientHeight}
        width={this.state.sidebarWidth}
        redis={this.props.redis}
        connectionKey={this.props.connectionKey}
        onSelectKey={ key => this.setState({key, version: this.state.version + 1})}
        onCreateKey={this.handleCreateKey.bind(this)}
        db={this.state.db}
        onDatabaseChange={db => this.setState({db})}
        onKeyMetaChange={ () => this.setState({metaVersion: this.state.metaVersion + 1})}
      />
      <Content 
        height={this.state.clientHeight}
        keyName={this.state.key}
        version={this.state.version}
        metaVersion={this.state.metaVersion}
        connectionKey={this.props.connectionKey}
        redis={this.props.redis}
        db={this.state.db}
        onDatabaseChange={db => this.setState({db})}
      />
    </SplitPane>
  }
}

export default Database;