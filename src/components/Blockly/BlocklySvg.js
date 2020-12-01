import React, { Component } from 'react';

import * as Blockly from 'blockly/core';

class BlocklySvg extends Component {

  constructor(props) {
    super(props);
    this.state = {
      svg: ''
    };
  }

  componentDidMount() {
    this.getSvg();
  }

  componentDidUpdate(props) {
    if(props.initialXml !== this.props.initialXml){
      this.getSvg();
    }
  }

  getSvg = () => {
    const workspace = Blockly.getMainWorkspace();
    workspace.clear();
    Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(this.props.initialXml), workspace);
    var canvas = workspace.svgBlockCanvas_.cloneNode(true);

    if (canvas.children[0] !== undefined) {
      canvas.removeAttribute("transform");

      // does not work in  react
      // var cssContent = Blockly.Css.CONTENT.join('');
      var cssContent = '';
      for (var i = 0; i < document.getElementsByTagName('style').length; i++) {
        if(/^blockly.*$/.test(document.getElementsByTagName('style')[i].id)){
          cssContent += document.getElementsByTagName('style')[i].firstChild.data.replace(/\..* \./g, '.');
        }
      }
      // ensure that fill-opacity is 1, because there cannot be a replacing
      // https://github.com/google/blockly/pull/3431/files#diff-00254795773903d3c0430915a68c9521R328
      cssContent += `.blocklyPath {
        fill-opacity: 1;
      }
      .blocklyPathDark {
        display: flex;
      }
      .blocklyPathLight {
        display: flex;
      }  `;

      var css = '<defs><style type="text/css" xmlns="http://www.w3.org/1999/xhtml"><![CDATA[' + cssContent + ']]></style></defs>';
      var bbox = document.getElementsByClassName("blocklyBlockCanvas")[0].getBBox();
      var content = new XMLSerializer().serializeToString(canvas);
      var xml = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                  width="${bbox.width}" height="${bbox.height}" viewBox="${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}">
                  ${css}">${content}</svg>`;

      this.setState({svg: xml});
    }
  }

  render() {
    return (
      <div
        style={{display: 'inline-flex', justifyContent: 'center', transform: 'scale(0.8) translate(0, calc(100% * -0.2 / 2))'}}
        dangerouslySetInnerHTML={{ __html: this.state.svg }}
      />
    );
  };
}

export default BlocklySvg;
