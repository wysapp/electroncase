import React, { Component, PropTypes } from 'react';
import ReactList from 'react-list';
import cx from 'classnames';

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentListType: ''
    };
  }

  render() {
    return (
      <div className="list">

      </div>
    )
  }
}

List.contextTypes = {
  router: PropTypes.object.isRequired
};

export default List;