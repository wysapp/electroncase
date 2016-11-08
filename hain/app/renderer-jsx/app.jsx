'use strict';

const lo_orderBy = require('lodash.orderby');
const lo_uniq = require('lodash.uniq');
const lo_map = require('lodash.map');

const React = require('react');
const ReactDOM = require('react-dom');

const remote = require('electron').remote;
const ipc = require('electron').ipcRenderer;

const RpcChannel = require('../main/shared/rpc-channel');
const rpc = RpcChannel.createWithIpcRenderer('#mainWindow', ipc);

import { TextField, Avatar, SelectableContainerEnhance, List, ListItem, Subheader, FontIcon, IconButton } from 'material-ui';
import MuiThemeProvider from 'material-ui/lib/MuiThemeProvider';
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';

import { Notification} from 'react-notification';



const muiTheme = getMuiTheme({
  userAgent: false
});

class AppContainer extends React.Component {
  constructor() {
    super();

    this.isLoaded = false;
    this.state = {
      query: '',
      results: [],
      selectionIndex: 0,
      toastMessage: '',
      toastOpen: false
    };

    this.toastQueue = [];
    this.lastResultTicket = -1;
  }


  componentDidMount() {
    this.refs.query.focus();
    rpc.define('notifyPluginsLoaded', (payload) => {
      this.isLoaded = true;
      this.setQuery('');
    });

  }

  setQuery(query) {
    const _query = query || '';
    this.setState({query: _query, selectionIndex: 0});
    this.refs.query.focus();
    this.search(_query);
  }


  scrollTo(selectionIndex) {

  }

  search(query) {
    
  }

  handleEsc() {
    const query = this.state.query;
    if ( query === undefined || query.length <= 0) {
      rpc.call('close');
      return;
    }
    this.setQuery('');
  }

  handleSelection(selectionDelta) {
    const results = this.state.results;
    const upperSelectionIndex = results.length - 1;

    let newSelectionIndex = this.state.selectionIndex + selectionDelta;
  }

  handleKeyDown(evt) {
    const key = evt.key;
    const keyHandlers = {
      Escape: this.handleEsc.bind(this),
    };

    const ctrlKeyHandlers = {
      P: this.handleSelection.bind(this, -1),
      p: this.handleSelection.bind(this, -1),
      K: this.handleSelection.bind(this, -1),
      k: this.handleSelection.bind(this, -1),
      N: this.handleSelection.bind(this, 1),
      n: this.handleSelection.bind(this, 1),
      J: this.handleSelection.bind(this, 1),
      j: this.handleSelection.bind(this, 1)
    };

    const selectedHandlerForCtrl = ctrlKeyHandlers[key];
    const selectedHandler = keyHandlers[key];

    if ( evt.ctrlKey) {
      if ( selectedHandlerForCtrl !== undefined) {
        selectedHandlerForCtrl();
        evt.preventDefault();
      } else if (selectedHandler !== undefined) {
        selectedHandler();
        evt.preventDefault();
      }
    } else {
      if ( selectedHandler !== undefined) {
        selectedHandler();
        evt.preventDefault();
      }
    }
  }

  handleChange(evt) {
    const query = this.refs.query.getValue();
    this.setState({query});
    this.scrollTo(0);
    this.search(query);
  }



  render() {

    const results = this.state.results;
    const selectionIndex = this.state.selectionIndex;
    const selectedResult = results[selectionIndex];

    const containerStyles = {
      overflowX: 'hidden',
      transition: 'width 0.35s cubic-bezier(0.23, 1, 0.32, 1)',
      overflowY: 'auto', 
      width: '100%',
      height: '440px'
    };

    let previewBox = null;
    if ( selectedResult && selectedResult.preview) {
      const previewStyle = {
        float: 'left',
        boxSizing: 'border-box',
        overflowX: 'hidden',
        overflowY: 'hidden',
        padding: '10px',
        paddingRight: '0px',
        width: '470px',
        height: '440px'
      };

      containerStyles.float = 'left';
      containerStyles.width = '300px';

      previewBox = (
        <div style={previewStyle}>
          <HTMLFrame 
            html={this.state.previewHtml}
            sandbox="allow-forms allow-popups allow-origin allow-scripts"
            style={{ width: '100%', height: '100%', border: '0'}}
          />
        </div>
      );
    }
    
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
      <div>
        <div key="queryWrapper" style={{position: 'fixed', 'zIndex': 1000, top: 0, width: '776px'}}>
          <div style={{marginTop: '7px', marginBottom: '-8px', color: '#a7a7a7', fontSize: '0.7em'}}>
            <table style={{width: '100%'}}>
              <tr>
                <td width="50%">Hain</td>
                <td width="50%" style={{ textAlign:'right'}}>
                <kbd>↓</kbd> <kbd>↑</kbd> to navigate, <kbd>tab</kbd> to expand(redirect), <kbd>enter</kbd> to execute
                </td>
              </tr>
            </table>
          </div>
          <TextField
            key="query"
            ref="query"
            fullWidth={true}
            value={this.state.query}
            onKeyDown={this.handleKeyDown.bind(this)}
            onChange={this.handleChange.bind(this)}
          />
        </div>  
        <div key="containerWrapper">
          <div key="container" ref="listContainer" style={containerStyles}>

          </div>
          {previewBox}
        </div>

        <Notification 
          key="notification"
          isActive={this.state.toastOpen}
          barStyle={{maxWidth: '600px', wordWrap: 'break-word'}}
          message={<div dangerouslySetInnerHTML={{ __html: this.state.toastMessage}} />}
        />
      </div>
      </MuiThemeProvider>
    );
  }
}


const appContainer = ReactDOM.render(<AppContainer />, document.getElementById('app'));