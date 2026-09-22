import React from "react";
import * as Blockly from "blockly/core";
import { Block, Category, Label } from "..";
import { getColour } from "../helpers/colour";

export default function QwiicButtonCategory() {
  return (
    <Category name="Qwiic Button" colour={getColour().sensebox}>
      <Label text={Blockly.Msg.qwiic_setup_label} />
      <Block type="sensebox_qwiic_button_init" />
      <Label text={Blockly.Msg.qwiic_loop_label} />
      <Block type="sensebox_qwiic_button_status" />
      <Block type="sensebox_qwiic_button_led" />
      <Block type="sensebox_qwiic_button_action" />
      <Block type="sensebox_qwiic_button_value" />
    </Category>
  );
}
