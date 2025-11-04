// src/components/Blockly/toolbox/ToolboxBasicPseudo.jsx
import React, { useEffect } from "react";
import {
  Block,
  Value,
  Field,
  Statement,
  Shadow,
  Category,
  Sep,
  Label,
} from "..";
import * as Blockly from "blockly/core";
import { getColour } from "@/helpers/colour";
export const ToolboxBasic = () => {
  return (
    <>
      <Category
        name={Blockly.Msg.toolbox_sensors}
        colour={getColour().sensebox}
        css-icon="customIcon fa fa-cloud"
      >
        <Block type="sensebox_sensor_temp_hum" />
      </Category>
      <Category
        css-icon="customIcon fa fa-desktop"
        name="Display"
        colour={getColour().sensebox}
      >
        <Block type="display_print_basic" />
        <Block type="text" />
      </Category>
      <Category
        name="LED"
        colour={getColour().sensebox}
        css-icon="customIcon fa fa-lightbulb"
      >
        <Block type="basic_red"></Block>
        <Block type="basic_blue"></Block>
        <Block type="basic_yellow"></Block>
        <Block type="basic_off"></Block>
      </Category>
      <Category
        name="Zeit"
        colour={getColour().logic}
        css-icon="customIcon fa fa-clock"
      >
        <Block type="time_delay_1s" />
        <Block type="time_delay_2s" />
        <Block type="time_delay_5s" />
      </Category>
    </>
  );
};
