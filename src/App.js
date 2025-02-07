import React, { Component } from "react";

import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";

import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/authActions";
import ErrorBoundary from "./components/ErrorBoundary";

import "./App.css";

import {
  ThemeProvider,
  StyledEngineProvider,
  createTheme,
} from "@mui/material/styles";

import Content from "./components/Content";
import { setCompiler } from "./actions/generalActions";

const theme = createTheme({
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
});

class App extends Component {
  componentDidMount() {
    store.dispatch(loadUser());
    // set initial compiler 
    console.log("compiler",  process.env.REACT_APP_INITIAL_COMPILER_URL)
    store.dispatch(setCompiler(process.env.REACT_APP_INITIAL_COMPILER_URL));
  }

  render() {
    const customHistory = createBrowserHistory();
    return (
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <Router history={customHistory}>
              <ErrorBoundary>
                <Content />
              </ErrorBoundary>
            </Router>
          </Provider>
        </ThemeProvider>
      </StyledEngineProvider>
    );
  }
}

export default App;
