import React, { Component } from "react";

import * as Blockly from "blockly/core";

class BlocklySvg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      svg: "",
    };
  }

  componentDidMount() {
    this.getSvg();
  }

  componentDidUpdate(props) {
    if (props.initialXml !== this.props.initialXml) {
      this.getSvg();
    }
  }

  getSvg = () => {
    const workspace = Blockly.getMainWorkspace();
    workspace.clear();
    Blockly.Xml.domToWorkspace(
      Blockly.utils.xml.textToDom(this.props.initialXml),
      workspace,
    );
    var canvas = workspace.svgBlockCanvas_.cloneNode(true);

    if (canvas.children[0] !== undefined) {
      canvas.removeAttribute("transform");

      // Collect CSS styles
      var cssContent = "";
      for (var i = 0; i < document.getElementsByTagName("style").length; i++) {
        if (/^blockly.*$/.test(document.getElementsByTagName("style")[i].id)) {
          cssContent += document
            .getElementsByTagName("style")
            [i].firstChild.data.replace(/\..* \./g, ".");
        }
      }
      cssContent += `.blocklyPath {
        fill-opacity: 1;
      }
      .blocklyPathDark {
        display: flex;
      }
      .blocklyPathLight {
        display: flex;
      }`;

      var css =
        '<defs><style type="text/css" xmlns="http://www.w3.org/1999/xhtml"><![CDATA[' +
        cssContent +
        "]]></style></defs>";

      // Get accurate bounds by temporarily adding cloned canvas to DOM
      const tempSvg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg",
      );
      tempSvg.style.position = "absolute";
      tempSvg.style.left = "-9999px";
      tempSvg.appendChild(canvas.cloneNode(true));
      document.body.appendChild(tempSvg);
      const bbox = tempSvg.getBBox();
      document.body.removeChild(tempSvg);

      // Add small padding
      const padding = 5;
      const finalX = bbox.x - padding;
      const finalY = bbox.y - padding;
      const finalWidth = bbox.width + padding * 2;
      const finalHeight = bbox.height + padding * 2;

      var content = new XMLSerializer().serializeToString(canvas);
      var xml = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                  width="${finalWidth}" height="${finalHeight}" viewBox="${finalX} ${finalY} ${finalWidth} ${finalHeight}">
                  ${css}>${content}</svg>`;

      this.setState({ svg: xml });
    }
  };

  render() {
    return (
      <div
        style={{
          display: "inline-flex",
          justifyContent: "center",
          transform: "scale(0.8) translate(0, calc(100% * -0.2 / 2))",
        }}
        dangerouslySetInnerHTML={{ __html: this.state.svg }}
      />
    );
  }
}

export default BlocklySvg;
