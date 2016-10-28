import React, { Component, PropTypes } from 'react';
import ReactOutsideEvent from 'react-outside-event';
import cx from 'classnames';
import _ from 'lodash';

class PickerButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      added: false,
      visible: false,
      locked: false,
      series: null,
      position: 'middle'
    };
  }

  onOutsideEvent() {
    if ( this.state.visible) {
      this.handleClose();
    }
  }

  handleClose = () => {
    if (this.state.visible) {
      this.setState({
        visible: false
      });
    }
  }


  render() {
    return (
      <div className="picker-btn" ref="pickerBtn">
        <div className="picker-animate-success" ref="successOvl">
          <div className="icon-check" ref="successIcon"></div>
        </div>

        <div className="picker-animate-remove" ref="removeOvl">
          <div ref="removeIcon">Removed</div>
        </div>
      
      </div>
    );
  }
}


export default new ReactOutsideEvent(PickerButton, ['mouseup']);