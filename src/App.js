import React from 'react';

import { BrowserRouter as Router } from 'react-router-dom';

import { Provider } from 'react-redux';
import store from './store';

import './App.css';

import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Routes from './components/Routes';

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


function App() {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <Router>
          <div className="wrapper">
            <Navbar />
            <Routes />
            <Footer />
          </div>
        </Router>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
