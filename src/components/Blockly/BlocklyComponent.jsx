import React from "react";

import * as Blockly from "blockly/core";
import "blockly/blocks";
import "@blockly/toolbox-search"; // search plugin auto-registers here

import Toolbox from "./toolbox/Toolbox";
import { reservedWords } from "./helpers/reservedWords";
import Snackbar from "../Snackbar";

import { Card } from "@mui/material";
import {
  ScrollOptions,
  ScrollBlockDragger,
  ScrollMetricsManager,
} from "@blockly/plugin-scroll-options";

import { PositionedMinimap } from "@blockly/workspace-minimap";
import { addLog } from "@/reducers/logReducer";
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
    const { initialXml, children, ...rest } = this.props;
    const { addLog } = this.props; // aus connect

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

    const onBlocklyChange = (event) => {
      const IGNORED_EVENTS = [
        Blockly.Events.VIEWPORT_CHANGE,
        Blockly.Events.FINISHED_LOADING,
        "click",
        "selected",
        Blockly.Events.TOOLBOX_ITEM_SELECT,
        Blockly.Events.MOVE,
        Blockly.Events.BLOCK_DRAG,
        "block_field_intermediate_change",
      ];

      if (IGNORED_EVENTS.includes(event.type)) return;

      console.log("Blockly-Event:", event);

      let title = "";
      let description = "";

      switch (event.type) {
        case Blockly.Events.CREATE:
          if (event.json?.type === "arduino_functions") return;
          title = "Block erstellt";
          description = `Blocktyp: ${event.json?.type || "Unbekannt"}`;
          break;

        case Blockly.Events.DELETE:
          title = "Block gelöscht";
          description = `Blocktyp: ${event.oldJson?.type || "Unbekannt"}`;
          break;

        case Blockly.Events.CHANGE:
          title = "Block geändert";
          description = event.name
            ? `${event.name} geändert: Von "${event.oldValue}" zu "${event.newValue}"`
            : "Ein Wert wurde geändert.";
          break;

        case Blockly.Events.MOVE:
          title = "Block verschoben";
          description = `Block verschoben (ID: ${event.blockId})`;
          break;

        case Blockly.Events.BLOCK_CREATE:
          title = "Block erstellt (verschachtelt)";
          description = `Innerhalb eines Blocks erstellt: ${event.json?.type || "Unbekannt"}`;
          break;

        case Blockly.Events.BLOCK_DELETE:
          title = "Block gelöscht (verschachtelt)";
          description = `Innerhalb eines Blocks gelöscht: ${event.oldJson?.type || "Unbekannt"}`;
          break;

        case Blockly.Events.BLOCK_CHANGE:
          title = "Block geändert (verschachtelt)";
          description = `Innerhalb eines Blocks geändert: ${event.json?.type || "Unbekannt"}`;
          break;

        default:
          title = "Unbekanntes Event";
          description = `Ein unbekanntes Event wurde empfangen: ${event.type}`;
          break;
      }

      addLog({
        type: "blockly",
        title,
        description,
      });
    };

    workspace.addChangeListener(onBlocklyChange);

    workspace.addChangeListener((event) => {
      if (
        event.type === Blockly.Events.VAR_CREATE ||
        event.type === Blockly.Events.VAR_RENAME
      ) {
        const variable = workspace
          .getVariableMap()
          .getVariableById(event.varId);
        const newName = variable.name;
        if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(newName)) {
          // Check if the new name is a valid variable name
          this.setState({
            snackbar: true,
            key: Date.now(),
            type: "error",
            message: `${Blockly.Msg.messages_invalid_variable_name}`,
          });
          workspace.getVariableMap().deleteVariableById(event.varId);
        }
        if (reservedWords.has(newName)) {
          // Check if the new name is a reserved word
          this.setState({
            snackbar: true,
            key: Date.now(),
            type: "error",
            message: `"${newName}" ${Blockly.Msg.messages_reserve_word}`,
          });
          workspace.getVariableMap().deleteVariableById(event.varId);
        }
      }
    });

    this.setState({ workspace: this.primaryWorkspace });
    const plugin = new ScrollOptions(this.workspace);
    plugin.init({ enableWheelScroll: true, enableEdgeScroll: false });

    if (initialXml) {
      Blockly.Xml.domToWorkspace(
        Blockly.utils.xml.textToDom(initialXml),
        workspace,
      );
    }
  }

  // Properly dispose the workspace on unmount
  componentWillUnmount() {
    if (this.primaryWorkspace) {
      this.primaryWorkspace.dispose();
      this.primaryWorkspace = null;
    }
  }

  get workspace() {
    return this.primaryWorkspace;
  }

  setXml(xml) {
    Blockly.Xml.domToWorkspace(
      Blockly.utils.xml.textToDom(xml),
      this.primaryWorkspace,
    );
  }

  render() {
    return (
      <>
        <Card
          ref={this.blocklyDiv}
          id="blocklyDiv"
          style={this.props.style ? this.props.style : {}}
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

export default connect(null, { addLog })(BlocklyComponent);
