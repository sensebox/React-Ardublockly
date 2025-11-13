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
import { useDispatch } from "react-redux";
const theme = createTheme({
  palette: {
    primary: {
      main: "#4EAF47",
      error: "#D84343",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#DDDDDD",
    },
    background: {
      white: "#ffffff",
      grey: "#f9fafb",
    },
    button: {
      compile: "#e27136",
    },
    senseboxColors: {
      blue: "#3ab0e8",
      green: "#4EAF47",
    },
    feedback: {
      success: "#4CAF50", // vorher hartkodiert
      error: "#E53935",
      warning: "#FFA000",
      border: "#DDDDDD",
    },
  },
});

class App extends Component {
  componentDidMount() {
    // In deiner App.js oder beim App-Start
    const token = localStorage.getItem("token");
    if (token) {
      store.dispatch(loadUser());
    }
    store.dispatch(setCompiler(import.meta.env.VITE_INITIAL_COMPILER_URL));
    window.dispatchRedux = store.dispatch;
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
