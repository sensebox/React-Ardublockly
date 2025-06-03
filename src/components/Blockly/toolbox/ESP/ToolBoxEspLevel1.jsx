import { Block, Value, Field, Statement, Shadow, Category, Label } from "../..";
import { getColour } from "../../helpers/colour";
import * as Blockly from "blockly/core";

export const ToolBoxEspLevel1 = (props) => {
  return (
    <>
      <Category
        name={Blockly.Msg.toolbox_sensors}
        colour={getColour().sensebox}
      >
        <Block type="sensebox_sensor_temp_hum" level="1" />
        <Block type="sensebox_sensor_uv_light" />
        <Block type="sensebox_esp32s2_light" />
        <Block type="sensebox_esp32s2_mpu6050" />
        <Block type="sensebox_sensor_sds011" />
        <Block type="sensebox_sensor_sps30" />
        <Block type="sensebox_sensor_pressure" />
        <Block type="sensebox_sensor_dps310" />
        <Block type="sensebox_sensor_bme680_bsec" />
        <Block type="sensebox_scd30" />
        <Block type="sensebox_gps" />
        <Block type="sensebox_sensor_ultrasonic_ranger" />
        <Block type="sensebox_tof_imager" />
        <Block type="sensebox_sensor_sound" />
        <Block type="sensebox_button" />
        <Block type="sensebox_sensor_truebner_smt50_esp32" />
        <Block type="sensebox_sensor_watertemperature" />
        <Block type="sensebox_rg15_rainsensor" />
        <Block type="sensebox_soundsensor_dfrobot" />
        <Block type="sensebox_multiplexer_init">
          <Value name="nrChannels">
            <Block type="math_number">
              <Field name="NUM">1</Field>
            </Block>
          </Value>
        </Block>
        <Block type="sensebox_multiplexer_changeChannel">
          <Value name="Channel">
            <Block type="math_number">
              <Field name="NUM">1</Field>
            </Block>
          </Value>
        </Block>
      </Category>
      <Category name="LED" colour={getColour().sensebox}>
        <Block type="sensebox_ws2818_led_init">
          <Value name="NUMBER">
            <Block type="math_number">
              <Field name="NUM">1</Field>
            </Block>
          </Value>
          <Value name="BRIGHTNESS">
            <Block type="math_number">
              <Field name="NUM">30</Field>
            </Block>
          </Value>
        </Block>
        <Block type="sensebox_ws2818_led">
          <Value name="POSITION">
            <Block type="math_number">
              <Field name="NUM">0</Field>
            </Block>
          </Value>
          <Value name="COLOR">
            <Block type="math_number">
              <Field name="NUM">0</Field>
            </Block>
          </Value>
        </Block>
        <Block type="colour_picker"></Block>
        <Block type="colour_random"></Block>
        <Block type="colour_rgb">
          <Value name="RED">
            <Block type="math_number">
              <Field name="NUM">100</Field>
            </Block>
          </Value>
          <Value name="GREEN">
            <Block type="math_number">
              <Field name="NUM">50</Field>
            </Block>
          </Value>
          <Value name="BLUE">
            <Block type="math_number">
              <Field name="NUM">0</Field>
            </Block>
          </Value>
        </Block>
        <Block type="sensebox_rgb_led"></Block>
        <Block type="sensebox_led" />
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
        <Block type="sensebox_display_fastPrint">
          <Value name="Title1">
            <Block type="text">
              <Field name="TEXT">Title</Field>
            </Block>
          </Value>
          <Value name="Dimension1">
            <Block type="text">
              <Field name="TEXT">Unit</Field>
            </Block>
          </Value>
          <Value name="Title2">
            <Block type="text">
              <Field name="TEXT">Title</Field>
            </Block>
          </Value>
          <Value name="Dimension2">
            <Block type="text">
              <Field name="TEXT">Unit</Field>
            </Block>
          </Value>
        </Block>
        <Block type="sensebox_display_plotDisplay">
          <Value name="Title">
            <Block type="text"></Block>
          </Value>
          <Value name="YLabel">
            <Block type="text"></Block>
          </Value>
          <Value name="XLabel">
            <Block type="text"></Block>
          </Value>
          <Value name="XRange1">
            <Block type="math_number">
              <Field name="NUM">0</Field>
            </Block>
          </Value>
          <Value name="XRange2">
            <Block type="math_number">
              <Field name="NUM">15</Field>
            </Block>
          </Value>
          <Value name="YRange1">
            <Block type="math_number">
              <Field name="NUM">0</Field>
            </Block>
          </Value>
          <Value name="YRange2">
            <Block type="math_number">
              <Field name="NUM">50</Field>
            </Block>
          </Value>
          <Value name="XTick">
            <Block type="math_number">
              <Field name="NUM">5</Field>
            </Block>
          </Value>
          <Value name="YTick">
            <Block type="math_number">
              <Field name="NUM">0</Field>
            </Block>
          </Value>
          <Value name="TimeFrame">
            <Block type="math_number">
              <Field name="NUM">15</Field>
            </Block>
          </Value>
        </Block>
        <Block type="sensebox_display_roboeyes" />
        <Block type="sensebox_display_fillCircle">
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
          <Value name="Radius">
            <Block type="math_number">
              <Field name="NUM">0</Field>
            </Block>
          </Value>
        </Block>
        <Block type="sensebox_display_drawRectangle">
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
          <Value name="height">
            <Block type="math_number">
              <Field name="NUM">0</Field>
            </Block>
          </Value>
          <Value name="width">
            <Block type="math_number">
              <Field name="NUM">0</Field>
            </Block>
          </Value>
        </Block>
      </Category>
    </>
  );
};
