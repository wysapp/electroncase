import React, { Component, PropTypes } from 'react';
import ReactList from 'react-list';
import cx from 'classnames';

import ListTabs from './ListTabs';
import ListSearch from './ListSearch';
import ListHeaders from './ListHeaders';

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentListType: ''
    };
  }

  render() {
    console.log('List-Props:', this.props);
    return (
      <div className="list">
        <ListTabs
          filterListByStatus={this.props.filterListByStatus}
          listStatusFilter={this.props.listStatusFilter}
          listStatusCount={this.props.listStatusCount}
        />

        <ListSearch
          searchList={this.props.searchList}
          listSearchQuery={this.props.listSearchQuery}
        />

        <ListHeaders
          listSortOrder={this.props.listSortOrder}
          listSortBy={this.props.listSortBy}
          sortListBy={this.props.sortListBy}
          headerOrder={this.props.headerOrder}
          updateHeaderOrder={this.props.updateHeaderOrder}
        />

        <div 
          className={cx({
            'list-reactlist': true,
            hidden: this.props.visibleListIsEmpty
          })}
        >
          <ReactList 
            itemRenderer={this.itemRenderer}
            length={this.props.visibleList.length}
            updateThisList={this.props.visibleList}
            type="simple"
          />
        </div>
      </div>
    )
  }
}

List.contextTypes = {
  router: PropTypes.object.isRequired
};

export default List;