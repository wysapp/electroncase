import './styles/notification.scss';

import _ from 'lodash';
import cx from 'classnames';
import ReactDOM from 'react-dom';
import React, { Component } from 'react';


class Notification extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      scrobble: {}
    };
  }

  componentDidMount = () => {
    this.fadeOutTimer = null;
    ipcRenderer.on('scrobble-request', (event, data) => {
      console.log('notificationWindow: scrobble-request');
      setTimeout(() => {
        this.setState({
          visible: true,
          scrobble: data
        });
      }, 300);

      clearTimeout(this.fadeOutTimer);
      this.fadeOutTimer = setTimeout(() => {
        this.setState({
          visible: false
        });
      }, 9000);
    });
  }

  handleUpdate = () => {
    ipcRenderer.send('scrobble-confirm', this.state.scrobble);
    this.setState({
      visible: false
    });
  }

  handleCancel = () => {
    ipcRenderer.send('scrobble-cancel');
    this.setState({
      visible: false
    });
  }


  render() {
    return (
      <div 
        className={cx({
          notification: true,
          visible: this.state.visible
        })}>
        <div className="notification-content">
          <div className="notification-legend">
            Now Playing. Episode {this.state.scrobble.episode_number}
          </div>
          <div className="notification-message">
            {_.get(this.state.scrobble, 'series.title')}
          </div>
        </div>

        <div 
          className={cx({
            'notification-image': true,
            visible: this.state.visible
          })}
          style={{
            background: `url(${_.get(this.state.scrobble, 'series.image_url')})`
          }}>
        </div>
        <div className="notification-actions">
          <div className="notification-action notification-update" onClick={this.handleUpdate}>
            Update
          </div>
          <div className="notification-action notification-cancel" onClick={this.handleCancel}>
            Cancel 
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Notification />, document.getElementById('mount'));