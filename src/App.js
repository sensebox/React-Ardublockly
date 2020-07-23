import React from 'react';

import { BrowserRouter as Router } from 'react-router-dom';

import { Provider } from 'react-redux';
import store from './store';

import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Routes from './components/Routes';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#4EAF47',
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
            <div style={{ margin: '0 22px' }}>
              <Routes />
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
