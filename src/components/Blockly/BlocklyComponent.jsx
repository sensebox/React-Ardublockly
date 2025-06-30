// src/components/BlocklyComponent.jsx
import React from "react";
import * as Blockly from "blockly/core";
import "blockly/blocks";
import "@blockly/toolbox-search";
import Toolbox from "./toolbox/Toolbox";
import Snackbar from "../Snackbar";

import { Card } from "@mui/material";
import {
  ScrollOptions,
  ScrollBlockDragger,
  ScrollMetricsManager,
} from "@blockly/plugin-scroll-options";
import { PositionedMinimap } from "@blockly/workspace-minimap";
import { addLog } from "../../reducers/logReducer";
import { connect } from "react-redux";

class BlocklyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.blocklyDiv = React.createRef();
    this.toolbox = React.createRef();
    this.primaryWorkspace = null;
    this.state = { workspace: undefined, snackbar: false };
  }

  componentDidMount() {
    const { initialXml, ...rest } = this.props;
    const { addLog } = this.props; // aus connect

    // Blockly-Workspace erzeugen
    const workspace = Blockly.inject(this.blocklyDiv.current, {
      toolbox: this.toolbox.current,
      plugins: {
        blockDragger: ScrollBlockDragger,
        metricsManager: ScrollMetricsManager,
      },
      ...rest,
    });
    this.primaryWorkspace = workspace;
    this.setState({ workspace });

    // Variablen-Listener (unverändert)
    workspace.addChangeListener((event) => {
      if (
        event.type === Blockly.Events.VAR_CREATE ||
        event.type === Blockly.Events.VAR_RENAME
      ) {
        /* ... Validierung ... */
      }
    });

    // Unser Blockly-Log-Listener
    const onBlocklyChange = (event) => {
      if (
        event.type === Blockly.Events.VIEWPORT_CHANGE ||
        event.type === Blockly.Events.FINISHED_LOADING ||
        event.type === "click" ||
        event.type === "selected" ||
        event.type === Blockly.Events.TOOLBOX_ITEM_SELECT ||
        event.type === Blockly.Events.MOVE ||
        event.type === Blockly.Events.BLOCK_DRAG
      )
        return;
      {
        console.log("Blockly-Event:", event);
        let actionText = "";
        const incomingEvent = event;
        let title = "";
        let description = "";
        // Wir unterscheiden die Events und erstellen eine passende Nachricht
        switch (incomingEvent.type) {
          case Blockly.Events.CREATE:
            if (incomingEvent.json.type === "arduino_functions") {
              return;
            }
            actionText = `Block erstellt: ${incomingEvent.json.type}`;
            title = "Block erstellt";
            description = `Der folgende Block wurde erstellt: ${incomingEvent.json.type}`;
            break;
          case Blockly.Events.DELETE:
            actionText = "Block gelöscht";
            title = "Block gelöscht";
            description = `Der folgende Block wurde gelöscht: ${incomingEvent.json.type}`;
            break;
          case Blockly.Events.CHANGE:
            if (event.oldValue && event.newValue) {
              actionText = `${event.name} geändert: Von "${event.oldValue}" zu "${event.newValue}"`;
            } else {
              actionText = "Block geändert";
            }
            title = "Block geändert";
            description = `Der Block wurde geändert: ${event.name}`;
            break;
          case Blockly.Events.MOVE:
            actionText = "Block verschoben";
            title = "Block verschoben";
            description = `Der Block wurde verschoben: ${incomingEvent.json.type}`;
            break;
          case Blockly.Events.BLOCK_CREATE:
            actionText = "Block erstellt (innerhalb eines Blocks)";
            title = "Block erstellt (innerhalb eines Blocks)";
            description = `Ein Block wurde innerhalb eines anderen Blocks erstellt: ${incomingEvent.json.type}`;
            break;
          case Blockly.Events.BLOCK_DELETE:
            actionText = "Block gelöscht (innerhalb eines Blocks)";
            title = "Block gelöscht (innerhalb eines Blocks)";
            description = `Ein Block wurde innerhalb eines anderen Blocks gelöscht: ${incomingEvent.oldJson.type}`;
            break;
          case Blockly.Events.BLOCK_CHANGE:
            actionText = "Block geändert (innerhalb eines Blocks)";
            title = "Block geändert (innerhalb eines Blocks)";
            description = `Ein Block wurde innerhalb eines anderen Blocks geändert: ${incomingEvent.json.type}`;
            break;
          default:
            actionText = `Unbekanntes Event: ${incomingEvent.type}`;
            title = "Unbekanntes Event";
            description = `Ein unbekanntes Event wurde empfangen: ${incomingEvent.type}`;
        }

        console.log(event);
        // Hier dispatchen wir über die prop addLog()
        addLog({
          type: "blockly",
          description,
          title,
        });
      }
    };
    workspace.addChangeListener(onBlocklyChange);

    // Scroll-Plugin initialisieren
    const plugin = new ScrollOptions(this.workspace);
    plugin.init({ enableWheelScroll: true, enableEdgeScroll: false });

    // Anfangs-XML laden, falls vorhanden
    if (initialXml) {
      Blockly.Xml.domToWorkspace(
        Blockly.utils.xml.textToDom(initialXml),
        workspace,
      );
    }
  }

  componentWillUnmount() {
    if (this.primaryWorkspace) {
      this.primaryWorkspace.dispose();
      this.primaryWorkspace = null;
    }
  }

  get workspace() {
    return this.primaryWorkspace;
  }

  render() {
    return (
      <>
        <Card
          ref={this.blocklyDiv}
          id="blocklyDiv"
          style={this.props.style || {}}
        />
        <Toolbox toolbox={this.toolbox} workspace={this.state.workspace} />
        <Snackbar
          open={this.state.snackbar}
          message={this.state.message}
          type={this.state.type}
          key={this.state.key}
        />
      </>
    );
  }
}

// bindet addLog als Prop ein
export default connect(null, { addLog })(BlocklyComponent);
