import React, { PropTypes} from 'react';

import TitleBar from '../components/title-bar/title-bar.js';
import Footer from '../components/footer/footer.js';

const AppContainer = ({children}) => {

  return <div>
    <TitleBar />
    <div className="main-content">
      {children}
    </div>
    <Footer />
  </div>;
};

AppContainer.propTypes = {
  children: PropTypes.node
};

export default AppContainer;