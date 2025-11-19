import * as Blockly from "blockly/core";
import React from "react";
import ReactDOM from "react-dom";
import ButtonBar from "./ButtonBar";
import { Provider } from "react-redux";
import store from "@/store";

export class FieldButtonBar extends Blockly.Field {
  static fromJson() {
    return new FieldButtonBar();
  }

  constructor() {
    super("");
    this.size_ = new Blockly.utils.Size(220, 80); // Platz reservieren
    this.container = null;
  }

  initView() {
    const root = this.getSvgRoot();
    if (!root) return;

    // foreignObject erzeugen
    const fo = Blockly.utils.dom.createSvgElement(
      "foreignObject",
      {
        x: 0,
        y: 0,
        width: this.size_.width,
        height: this.size_.height,
      },
      root,
    );

    // Container für React
    this.container = document.createElement("div");
    this.container.style.width = "100%";
    this.container.style.height = "100%";
    this.container.style.overflow = "visible"; // wichtig!

    fo.appendChild(this.container);

    ReactDOM.render(
      <Provider store={store}>
        <ButtonBar />
      </Provider>,
      this.container,
    );

    this.updateSize_();
  }

  dispose() {
    // sauber unmounten
    if (this.container) {
      ReactDOM.unmountComponentAtNode(this.container);
    }
    super.dispose();
  }
}

Blockly.fieldRegistry.register("field_button_bar", FieldButtonBar);
