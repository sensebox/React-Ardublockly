import React, { Component } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import EmbeddedBlockly from "./components/EmbeddedBlockly";
import RouteHandler from "./components/RouteHandler";
import { setCompiler } from "./actions/generalActions";
import BasicEmbedded from "./components/BasicBlockly/BasicEmbedded";
import BasicPage from "./components/Pages/Basic/BasicPage";

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
      warningDark: "#b37000",
      border: "#DDDDDD",
    },
  },
});

class App extends Component {
  componentDidMount() {
    const token = localStorage.getItem("token");
    if (token) {
      store.dispatch(loadUser());
    }

    store.dispatch(setCompiler(import.meta.env.VITE_INITIAL_COMPILER_URL));
  }

  render() {
    return (
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <BrowserRouter>
              <RouteHandler />
              <ErrorBoundary>
                <Routes>
                  <Route
                    path="/embedded/share/:shareId"
                    element={<EmbeddedBlockly />}
                  />
                  <Route path="/embedded" element={<EmbeddedBlockly />} />
                  <Route path="/*" element={<Content />} />
                  <Route path="/embeddedbasic" element={<BasicPage />} />
                </Routes>
              </ErrorBoundary>
            </BrowserRouter>
          </Provider>
        </ThemeProvider>
      </StyledEngineProvider>
    );
  }
}

export default App;
