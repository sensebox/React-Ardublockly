import React, { Component } from "react";
import * as Blockly from "blockly/core";

import BlocklyWindow from "./Blockly/BlocklyWindow";

class DocsHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      xml: null, // Start with no XML
    };
  }

  componentDidMount() {
    window.addEventListener("message", this.handlePostMessage);
    console.log("DocsHome mounted: waiting for postMessage...");
  }

  componentWillUnmount() {
    window.removeEventListener("message", this.handlePostMessage);
  }

  handlePostMessage = (event) => {
    try {
      console.log("Received postMessage:", event);
      const data =
        typeof event.data === "string" ? JSON.parse(event.data) : event.data;

      if (data && data.type === "load-xml" && data.xml) {
        console.log("Received XML via postMessage:", data.xml);

        this.setState({ xml: data.xml });
      }
    } catch (e) {
      console.error("Invalid XML in postMessage:", e);
    }
  };

  render() {
    return (
      <div className="blocklyWindow" style={{ height: "100%" }}>
        <BlocklyWindow initialXml={this.state.xml} svg />
      </div>
    );
  }
}

export default DocsHome;
