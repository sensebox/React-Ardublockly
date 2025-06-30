import { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { clearStats, workspaceName } from "../actions/workspaceActions";
import * as Blockly from "blockly/core";
import BlocklyWindow from "./Blockly/BlocklyWindow";
import store from "../store";
import { setPlatform, setRenderer } from "../actions/generalActions";
import BoardSelector from "./BoardSelector";
import { setBoard } from "../actions/boardAction";

class MinimalHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialXml: localStorage.getItem("autoSaveXML"),
    };
  }

  componentDidMount() {
    store.dispatch(setRenderer("zelos"));
    window.localStorage.setItem("ota", true);
    store.dispatch(setPlatform(false));
    // Listen for messages from Flutter
    window.addEventListener("message", this.handleFlutterMessage);
  }

  componentDidUpdate(props) {
    /* Resize and reposition all of the workspace chrome (toolbox, trash,
    scrollbars etc.) This should be called when something changes that requires
    recalculating dimensions and positions of the trash, zoom, toolbox, etc.
    (e.g. window resize). */
    const workspace = Blockly.getMainWorkspace();
    Blockly.svgResize(workspace);
  }

  componentWillUnmount() {
    this.props.clearStats();
    this.props.workspaceName(null);
    window.localStorage.removeItem("ota");
    window.removeEventListener("message", this.handleFlutterMessage);
  }

  handleFlutterMessage = (event) => {
    // You may want to check event.origin for security in production
    try {
      const data =
        typeof event.data === "string" ? JSON.parse(event.data) : event.data;
      if (data && data.action === "triggerCompile") {
        this.handleCompileFromFlutter();
      }
    } catch (e) {
      // Ignore invalid JSON
    }
  };

  handleCompileFromFlutter = async () => {
    try {
      // Simulate some work (replace with your actual logic)
      const board =
        this.props.selectedBoard === "mcu" ||
        this.props.selectedBoard === "mini"
          ? "sensebox-mcu"
          : "sensebox-esp32s2";

      const response = await fetch(`${this.props.compilerUrl}/compile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sketch: this.props.arduinoCode,
          board,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Compilation failed");
      }
      if (data.data.id) {
        const result = {
          status: "success",
          message: "Compile finished",
          sketchId: data.data.id,
          board: board,
        };
        window.FlutterChannel.postMessage(JSON.stringify(result));
        return;
      }
    } catch (e) {
      const result = {
        status: "error",
        message: e.message || "An error occurred",
      };
      window.FlutterChannel.postMessage(JSON.stringify(result));
      return;
    }
  };

  onChange = () => {
    this.setState({ codeOn: !this.state.codeOn });
    const workspace = Blockly.getMainWorkspace();
    // https://github.com/google/blockly/blob/master/core/blockly.js#L314
    if (workspace.trashcan && workspace.trashcan.flyout) {
      workspace.trashcan.flyout.hide(); // in case of resize, the trash flyout does not reposition
    }
  };

  render() {
    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <BoardSelector
            selectedBoard={this.props.selectedBoard}
            setBoard={this.props.setBoard}
          />
        </div>
        <div style={{ flex: 1 }}>
          <BlocklyWindow
            initialXml={this.state.initialXml}
            selectedBoard={
              this.props.selectedBoard === "mcu" ||
              this.props.selectedBoard === "mini"
                ? "sensebox-mcu"
                : "sensebox-esp32s2"
            }
          />
        </div>
      </div>
    );
  }
}

MinimalHome.propTypes = {
  platform: PropTypes.bool.isRequired,
  arduinoCode: PropTypes.string.isRequired,
  board: PropTypes.string.isRequired,
  compilerUrl: PropTypes.string.isRequired,
  setBoard: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  platform: state.general.platform,
  arduinoCode: state.workspace.code.arduino,
  selectedBoard: state.board.board,
  compilerUrl: state.general.compiler,
});

export default connect(mapStateToProps, {
  clearStats,
  workspaceName,
  setBoard,
})(MinimalHome);
