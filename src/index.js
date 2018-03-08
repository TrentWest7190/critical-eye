import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import 'react-select/dist/react-select.css'
import 'react-virtualized/styles.css'
import 'react-virtualized-select/styles.css'

import getMuiTheme from 'material-ui/styles/getMuiTheme'
import { red50, red900 } from 'material-ui/styles/colors'

import ReactGA from 'react-ga'
ReactGA.initialize('UA-77293857-3')
ReactGA.pageview(window.location.pathname + window.location.search)

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: red900,
  }
})

ReactDOM.render(<MuiThemeProvider muiTheme={muiTheme}><App/></MuiThemeProvider>, document.getElementById('root'));
registerServiceWorker();
