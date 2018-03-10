import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react'
import { Store } from './store'
import './index.css';
import App from './App';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import 'react-select/dist/react-select.css'
import 'react-virtualized/styles.css'
import 'react-virtualized-select/styles.css'

import getMuiTheme from 'material-ui/styles/getMuiTheme'
import { red900 } from 'material-ui/styles/colors'

import ReactGA from 'react-ga'
ReactGA.initialize('UA-77293857-3')
ReactGA.pageview(window.location.pathname + window.location.search)

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: red900,
  }
})

ReactDOM.render(
  <Provider store={new Store()}>
    <MuiThemeProvider muiTheme={muiTheme}>
      <App/>
    </MuiThemeProvider>
  </Provider>, 
  document.getElementById('root')
);
