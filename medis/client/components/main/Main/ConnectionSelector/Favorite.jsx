'use strict';

import React from 'react';
import Sortable from 'sortablejs';

class Favorite extends React.Component {
  constructor() {
    super();

    this.state = { activeKey: null };

    this._updateSortableKey();
  }

  _updateSortableKey() {
    this.sortableKey = `sortable-${Math.round(Math.random() * 10000)}`;
  }

  render() {

    return <div style={{flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'hidden'}}>
      <nav className="nav-group">
        <h5 className="nav-group-title"></h5>
        <a className={'nav-group-item' + (this.state.activeKey ? '' : ' active')}>
          QUICK CONNECT
        </a>
        <h5 className="nav-group-title">FAVORITES</h5>

      </nav>
      <footer className="toolbar toolbar-footer">
        <button>+</button>
        <button>-</button>
      </footer>
    </div>
  }
};

export default Favorite;