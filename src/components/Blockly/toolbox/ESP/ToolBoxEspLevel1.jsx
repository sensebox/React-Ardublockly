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
        <Block type="sensebox_display_beginDisplay" />
        <Block type="sensebox_display_show" />
        <Block type="sensebox_display_clearDisplay" />
        <Block type="sensebox_display_printDisplay">
          <Value name="SIZE">
            <Block type="math_number">
              <Field name="NUM">1</Field>
            </Block>
          </Value>
          <Value name="X">
            <Block type="math_number">
              <Field name="NUM">0</Field>
            </Block>
          </Value>
          <Value name="Y">
            <Block type="math_number">
              <Field name="NUM">0</Field>
            </Block>
          </Value>
        </Block>
      </Category>
      <Category
        id="time_control"
        name={Blockly.Msg.toolbox_time_control}
        colour={getColour().time}
      >
        <Block type="time_delay">
          <Value name="DELAY_TIME_MILI">
            <Block type="math_number">
              <Field name="NUM">1000</Field>
            </Block>
          </Value>
        </Block>
      </Category>
    </>
  );
};
