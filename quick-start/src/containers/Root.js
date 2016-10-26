import React, {Component, PropTypes } from 'react';
import { Provider } from 'react-redux';
import { hashHistory, Router, Redirect, Route } from 'react-router';
import hotkey from 'react-hotkey';
hotkey.activate('keydown');

import App from '../components/App';
import ListContainer from './ListContainer';


class Root extends Component {
  
  componentDidMount() {
    setTimeout(() => {
      $('body').addClass('visible');
    }, 1000);
  }

  render() {
    const store = this.props.store;

    return (
      <Provider store={store}>
        <Router history={hashHistory}>
          <Redirect from='/' to="/animelist" />
          <Route path="/" component={App}>
            <Route path="/animelist" component={ListContainer} />
          
          </Route>
        </Router>
      </Provider>
    );
  }
}

Root.propTypes = {
  store: PropTypes.object
};

export default Root;