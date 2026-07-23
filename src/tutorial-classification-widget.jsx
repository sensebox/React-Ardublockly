import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import {
  ThemeProvider,
  StyledEngineProvider,
  createTheme,
} from "@mui/material/styles";
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
import { setupInterceptors } from "./actions/authActions";
import TutorialClassificationWidget from "./components/Pages/TeachableSensebox/tutorial/TutorialClassificationWidget";

const theme = createTheme({
  palette: {
    primary: {
      main: "#a056fb",
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
      compile: "#f79a36",
    },
    senseboxColors: {
      blue: "#3ab0e8",
      green: "#a056fb",
    },
    feedback: {
      success: "#a056fb",
      error: "#E53935",
      warning: "#f79a36",
      warningDark: "#ab5c07",
      border: "#DDDDDD",
    },
  },
});

function createWidgetStore() {
  const store = createStore(rootReducer, {}, compose(applyMiddleware(thunk)));
  setupInterceptors(store);
  return store;
}

function mountWidget(targetElement, config = {}) {
  const store = createWidgetStore();

  // Extract tutorials from data attribute or config
  let tutorials = config.tutorials;
  if (!tutorials && targetElement.dataset.tutorials) {
    try {
      tutorials = JSON.parse(targetElement.dataset.tutorials);
    } catch (e) {
      console.warn("Failed to parse tutorials data:", e);
      tutorials = [];
    }
  }
  tutorials = tutorials || [];

  const root = createRoot(targetElement);
  root.render(
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <MemoryRouter>
            <TutorialClassificationWidget tutorials={tutorials} />
          </MemoryRouter>
        </Provider>
      </ThemeProvider>
    </StyledEngineProvider>,
  );
}

function autoMount() {
  const el = document.getElementById("tutorial-classification-root");
  if (el) {
    mountWidget(el);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", autoMount);
} else {
  autoMount();
}

window.mountTutorialClassification = mountWidget;
