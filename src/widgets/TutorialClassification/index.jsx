import React, { useEffect, useMemo, useState } from "react";
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
import * as Blockly from "blockly/core";
import rootReducer from "../../reducers";
import { setupInterceptors } from "../../actions/authActions";
import TutorialClassificationWidget from "../../components/Pages/TeachableSensebox/tutorial/TutorialClassificationWidget";
import { De } from "../../components/Blockly/msg/de";
import { En } from "../../components/Blockly/msg/en";
import "./styles.css";

function getHostLocaleMessages() {
  const htmlLang = (document.documentElement.getAttribute("lang") || "").toLowerCase();
  return htmlLang.startsWith("de") ? De : En;
}

// Set the Blockly locale before any Blockly component/toolbox renders.
// Without this, Blockly.Msg.* is empty and toolbox category labels are blank.
Blockly.setLocale(getHostLocaleMessages());

function getHostThemeMode() {
  const attr = document.documentElement.getAttribute("data-theme");
  return attr === "dark" ? "dark" : "light";
}

function createWidgetTheme(mode) {
  const isDark = mode === "dark";
  return createTheme({
    palette: {
      mode,
      primary: {
        main: "#a056fb",
        error: "#D84343",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#DDDDDD",
      },
      background: {
        default: isDark ? "#1e1e2a" : "#ffffff",
        paper: isDark ? "#262633" : "#ffffff",
        white: isDark ? "#262633" : "#ffffff",
        grey: isDark ? "#2b2b3a" : "#f9fafb",
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
        border: isDark ? "#3f3f52" : "#DDDDDD",
      },
    },
  });
}

function createWidgetStore() {
  const store = createStore(rootReducer, {}, compose(applyMiddleware(thunk)));
  setupInterceptors(store);
  return store;
}

function WidgetRoot({ tutorials, mediaBasePath }) {
  const [store] = useState(() => createWidgetStore());
  const [mode, setMode] = useState(getHostThemeMode);

  useEffect(() => {
    const html = document.documentElement;
    const observer = new MutationObserver(() => {
      setMode(getHostThemeMode());
    });
    observer.observe(html, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  const theme = useMemo(() => createWidgetTheme(mode), [mode]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <MemoryRouter>
            <TutorialClassificationWidget
              tutorials={tutorials}
              mediaBasePath={mediaBasePath}
            />
          </MemoryRouter>
        </Provider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

function mountWidget(targetElement, config = {}) {
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

  const mediaBasePath =
    config.mediaBasePath ||
    targetElement.dataset.mediaBasePath ||
    "/media/tutorial";

  const root = createRoot(targetElement);
  root.render(
    <WidgetRoot tutorials={tutorials} mediaBasePath={mediaBasePath} />,
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
