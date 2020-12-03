import React, { Component } from 'react';

import { BrowserRouter as Router } from 'react-router-dom';
import { createBrowserHistory } from "history";

import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/authActions';

import './App.css';

import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Routes from './components/Route/Routes';
import Cookies from './components/Cookies';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#4EAF47',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#DDDDDD'
    }
  }
});

class App extends Component {

  componentDidMount(){
    store.dispatch(loadUser());
  }

  render() {
    const customHistory = createBrowserHistory();
    return (
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <Router history={customHistory}>
            <div className="wrapper">
              <Navbar />
              <Routes />
              <Cookies />
              <Footer />
            </div>
          </Router>
        </Provider>
      </ThemeProvider>
    );
  }
}

export default App;
