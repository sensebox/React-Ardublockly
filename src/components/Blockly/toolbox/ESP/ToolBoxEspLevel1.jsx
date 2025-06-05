import { Block, Value, Field, Statement, Shadow, Category, Label } from "../..";
import { getColour } from "../../helpers/colour";
import * as Blockly from "blockly/core";

export const ToolBoxEspLevel1 = (props) => {
  return (
    <>
      <Category
        name={Blockly.Msg.toolbox_sensors}
        colour={getColour().sensebox}
        style={{ paddingBottom: "10px" }}
      >
        <Block type="sensebox_sensor_temp_hum" />
        <Block type="sensebox_sensor_uv_light" />
        <Block type="sensebox_tof_imager" />
      </Category>
      <Category name="LED" colour={getColour().sensebox}>
        <Block type="sensebox_ws2818_led_red" />
        <Block type="sensebox_ws2818_led_blue" />
        <Block type="sensebox_ws2818_led_yellow" />
        <Block type="sensebox_ws2818_led_off" />
      </Category>
      <Category name="Display" colour={getColour().sensebox}>
        <Block type="sensebox_display_printEasy" />
      </Category>
      <Category
        id="time_control"
        name={Blockly.Msg.toolbox_time_control}
        colour={getColour().time}
      >
        <Block type="time_delay_1s" />
        <Block type="time_delay_2s" />
        <Block type="time_delay_5s" />
      </Category>
    </>
  );
};
