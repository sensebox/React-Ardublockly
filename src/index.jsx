import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import store from "./store";
import { fetchSensors } from "./actions/sensorwikiActions";
import * as Blockly from "blockly/core";
import { De } from "./components/Blockly/msg/de";

// Set default locale before any components load
// This prevents undefined Blockly.Msg properties when blocks are registered
Blockly.setLocale(De);

// store.dispatch(fetchSensors());

// fetchSensors();

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
