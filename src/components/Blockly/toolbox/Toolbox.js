import React from "react";
import "@blockly/block-plus-minus";
import { TypedVariableModal } from "@blockly/plugin-typed-variable-modal";
import * as Blockly from "blockly/core";
import { connect } from "react-redux";
import { ToolboxMcu } from "./ToolboxMcu";
import { ToolboxEsp } from "./ToolboxEsp";

class Toolbox extends React.Component {
  componentDidUpdate(props) {
    this.props.workspace.registerToolboxCategoryCallback(
      "CREATE_TYPED_VARIABLE",
      this.createFlyout,
    );

    const typedVarModal = new TypedVariableModal(
      this.props.workspace,
      "callbackName",
      [
        [`${Blockly.Msg.variable_NUMBER}`, "int"],
        [`${Blockly.Msg.variable_LONG}`, "long"],
        [`${Blockly.Msg.variable_DECIMAL}`, "float"],
        [`${Blockly.Msg.variables_TEXT}`, "String"],
        [`${Blockly.Msg.variables_CHARACTER}`, "char"],
        [`${Blockly.Msg.variables_BOOLEAN}`, "boolean"],
      ],
    );
    typedVarModal.init();
    if (props.selectedBoard !== this.props.selectedBoard) {
      console.log("change board");
      console.log(this.props.selectedBoard);
      this.setState({ board: this.props.selectedBoard });
    }
    this.props.workspace.updateToolbox(this.props.toolbox.current);
  }

  createFlyout(workspace) {
    let xmlList = [];

    // Add your button and give it a callback name.
    const button = document.createElement("button");
    button.setAttribute("text", Blockly.Msg.button_createVariable);
    button.setAttribute("callbackKey", "callbackName");

    xmlList.push(button);

    // This gets all the variables that the user creates and adds them to the
    // flyout.
    const blockList = Blockly.VariablesDynamic.flyoutCategoryBlocks(workspace);
    console.log(blockList);
    xmlList = xmlList.concat(blockList);
    return xmlList;
  }

  render() {
    return (
      <xml
        xmlns="https://developers.google.com/blockly/xml"
        id="blockly"
        style={{ display: "none" }}
        ref={this.props.toolbox}
      >
        {this.props.selectedBoard === "mcu" ||
        this.props.selectedBoard === "mini" ? (
          <ToolboxMcu />
        ) : (
          <ToolboxEsp />
        )}
      </xml>
    );
  }
}

const mapStateToProps = (state) => ({
  language: state.general.language,
  selectedBoard: state.board.board,
});

export default connect(mapStateToProps)(Toolbox);
