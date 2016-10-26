import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import cx from 'classnames';
import _ from 'lodash';
import hotkey from 'react-hotkey';

import utils from '../utils';
import PickerContainer from '../containers/PickerContainer';

class Series extends Component {
  constructor(props) {
    super(props);
    
    hotkey.addHandler(this.handleHotkey);
  }

  componentWillUnmount() {
    hotkey.removeHandler(this.handleHotkey);
  }

  onClick = () => {
    if ( this.props.visible) {
      this.props.hideSeries();
    }
  }

  handleHotkey = (e)=> {
    switch (e.key) {
      case 'Escape':
        this.props.hideSeries();
        break;
      default: 
        break;
    }
  }

  render() {
    return (
      <div className={cx({
        series: true,
        visible: this.props.visible
        })}
        ref="series"
      >
        <div className={cx({
            'series-content': true,
            visible: this.props.visible
          })}
          ref="seriesContent">
          <div className="series-side">
            <div className="series-image"
              style={{
                backgroundImage: this.props.series.image_url
                  ? `url(${this.props.series.image_url})`
                  : 'none'
              }}>
            </div>
            <div className="series-picker">
              <PickerContainer series={this.props.series} />
            </div>
          </div>
        
        </div>
      </div>
    );
  }
}

Series.propTypes = {

  // Props
  series: PropTypes.object
};

export default Series;