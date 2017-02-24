'use strict';

import React from 'react';
import ReactDOM from 'react-dom';


export default class ContentEditable extends React.Component {
  constructor() {
    super();
  }

  render() {
    return <div {...this.props}>
      <span 
        onInput={this.handleChange.bind(this)}
        onKeyDown={this.handleKeyDown.bind(this)}
        onBlur={this.handleSubmit.bind(this)}
        contentEditable={this.props.enabled}
        ref="text"
        dangerouslySetInnerHTML={{__html: this.props.html}}
      />
    </div>;
  }

  handleChange(evt) {
    var html = ReactDOM.findDOMNode(this.refs.text).innerHTML;
    if (html !== this.lastHtml) {
      evt.target = { value: html};
    }
    this.lastHtml = html;
  }

  handleSubmit() {

  }

  handleKeyDown(evt) {

  }
}