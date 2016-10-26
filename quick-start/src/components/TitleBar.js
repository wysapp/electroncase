import React, { Component } from 'react';


import settings from '../utils/settings';

class TitleBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullscreen: false
    };
  }

  handleClose() {

  }

  handleMinimize() {


  }

  handleMaximize() {

    
  }

  render() {
    return (
      <div className="titlebar">
        
        <div className="titlebar-draggable"></div>
        <div className="titlebar-controls">
          <div className="titlebar-minimize icon-minus" onClick={this.handleMinimize}></div>
          <div
            className="titlebar-maximize icon-document-landscape"
            onClick={this.handleMaximize}>
          </div>
          <div className="titlebar-close icon-close" onClick={this.handleClose}></div>
        </div>
      </div>
    );
  }
}

export default TitleBar;