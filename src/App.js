import React, { Component } from "react";

import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";

import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/authActions";

import "./App.css";

import { ThemeProvider, StyledEngineProvider, createTheme, adaptV4Theme } from "@mui/material/styles";

import Content from "./components/Content";

const theme = createTheme(adaptV4Theme({
  palette: {
    primary: {
      main: "#4EAF47",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#DDDDDD",
    },
    button: {
      compile: "#e27136",
    },
  },
}));

class App extends Component {
  componentDidMount() {
    store.dispatch(loadUser());
  }

  render() {
    const customHistory = createBrowserHistory();
    return (
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <Router history={customHistory}>
              <Content />
            </Router>
          </Provider>
        </ThemeProvider>
      </StyledEngineProvider>
    );
  }
}

export default App;
