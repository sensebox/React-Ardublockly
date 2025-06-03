import { Block, Value, Field, Statement, Shadow, Category, Label } from "../..";
import { getColour } from "../../helpers/colour";
import * as Blockly from "blockly/core";
export const ToolBoxEspLevel2 = (props) => {
  return (
    <>
      <Category name="WIFI" colour={getColour().sensebox}>
        <Block type="sensebox_esp32s2_wifi" />
        <Block type="sensebox_esp32s2_wifi_enterprise" />
        <Block type="sensebox_wifi_status" />
        <Block type="sensebox_wifi_rssi" />
        <Block type="sensebox_get_ip" />
        <Block type="sensebox_esp32s2_startap" />
      </Category>
      <Category name="LED Matrix" colour={getColour().sensebox}>
        <Block type="sensebox_ws2812_matrix_init"></Block>
        <Block type="sensebox_ws2812_matrix_clear" />
        <Block type="sensebox_ws2812_matrix_text" />
        <Block type="sensebox_ws2812_matrix_drawPixel" />
        <Block type="sensebox_ws2812_matrix_fullcolor" />
        <Block type="sensebox_ws2812_matrix_showBitmap" />
        <Block type="sensebox_ws2812_matrix_bitmap" />
        <Block type="sensebox_ws2812_matrix_custom_bitmap" />
        <Block type="sensebox_ws2812_matrix_draw_custom_bitmap_example" />
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
      </Category>
      <Category id="text" name="Text" colour={getColour().text}>
        <Block type="text" />
        <Block type="text_join" />
        <Block type="text_append">
          <Value name="TEXT">
            <Block type="text" />
          </Value>
        </Block>
        <Block type="text_length" />
        <Block type="text_isEmpty" />
      </Category>
    </>
  );
};
