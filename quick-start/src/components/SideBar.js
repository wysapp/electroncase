import React from 'react';

import utils from '../utils';


const SideBar = () => {
  return (
    <div className="sidebar">

      <div className="sidebar-bottom">
        IN DEVELOPEMNT, ANYTHING CAN BREAK. {utils.version()}
      </div>
    </div>
  );
};

export default SideBar;