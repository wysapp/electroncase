import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import _ from 'lodash';

import settings from '../utils/settings';

class Kicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false
    };
  }

  componentDidMount = () => {
    switch(settings.get('listName')) {
      case 'toshocat':
        this.props.switchToToshocat();
        
        break;
      default: 
        break;
    }

    ipcRenderer.removeAllListeners('media-detected');
    ipcRenderer.removeAllListeners('media-lost');
    ipcRenderer.on('media-detected', (event, detectedMedia) => {
      
      if (detectedMedia.episode_number &&
        detectedMedia.file_name !== this.props.currentScrobble.file_name) { 
          
          this.props.requestScrobble(detectedMedia);
          this.setState({
            visible: true
          });
        }
    });

    ipcRenderer.on('scrobble-confirm', (event, data) => {
      this.props.confirmScrobble(data);
    })

  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners('media-detected');
    ipcRenderer.removeAllListeners('media-lost');
  }

  render() {
    
    return (
      <div 
        className={cx({
          kicker: true,
          visible: this.state.visible
        })}>
        <div className="kicker-description">
          {`Now playing . Episode ${parseFloat(this.props.currentScrobble.episode_number) || '1'}`}
        </div>
        <div className="kicker-pipe"></div>
        <div className="kicker-topic">
          {_.get(this.props.currentScrobble, 'series.title')}
        </div>
      </div>
    )
  }
};

export default Kicker;