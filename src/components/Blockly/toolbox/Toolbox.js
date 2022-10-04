import React from "react";
import { Block, Value, Field, Shadow, Category } from "../";
import { getColour } from "../helpers/colour";
import "@blockly/block-plus-minus";
import { TypedVariableModal } from "@blockly/plugin-typed-variable-modal";
import * as Blockly from "blockly/core";

class Toolbox extends React.Component {
  componentDidUpdate() {
    this.props.workspace.registerToolboxCategoryCallback(
      "CREATE_TYPED_VARIABLE",
      this.createFlyout
    );

    const typedVarModal = new TypedVariableModal(
      this.props.workspace,
      "callbackName",
      [
        [`${Blockly.Msg.variable_SHORT_NUMBER}`, "char"],
        [`${Blockly.Msg.variable_NUMBER}`, "int"],
        [`${Blockly.Msg.variable_LONG}`, "long"],
        [`${Blockly.Msg.variable_DECIMAL}`, "float"],
        [`${Blockly.Msg.variables_TEXT}`, "String"],
        [`${Blockly.Msg.variables_CHARACTER}`, "char"],
        [`${Blockly.Msg.variables_BOOLEAN}`, "boolean"],
      ]
    );
    typedVarModal.init();
  }

  createFlyout(workspace) {
    let xmlList = [];

    // Add your button and give it a callback name.
    const button = document.createElement("button");
    button.setAttribute("text", "Create Typed Variable");
    button.setAttribute("callbackKey", "callbackName");

    xmlList.push(button);

    // This gets all the variables that the user creates and adds them to the
    // flyout.
    const blockList = Blockly.VariablesDynamic.flyoutCategoryBlocks(workspace);
    xmlList = xmlList.concat(blockList);
    return xmlList;
  }

  render() {
    return (
      <xml
        xmlns="https://developers.google.com/blockly/xml"
        id="blockly"
        style={{ display: "none" }}
        ref={this.props.toolbox}
      >
        <Category
          name={Blockly.Msg.toolbox_sensors}
          colour={getColour().sensebox}
        >
          <Block type="sensebox_hdc1080" />
          <Block type="sensebox_tsl4531" />
          <Block type="sensebox_bmx055" />
          <Block type="sensebox_sds011" />
          <Block type="sensebox_bmp280" />
          <Block type="sensebox_dps310" />
          <Block type="sensebox_bme680" />
          <Block type="sensebox_scd30" />
          <Block type="sensebox_gps" />
          <Block type="sensebox_hcsr04" />
          <Block type="sensebox_sensor_sound" />
          <Block type="sensebox_button" />
          <Block type="sensebox_smt50" />
          <Block type="sensebox_sensor_watertemperature" />
          {/* <Block type="sensebox_windspeed" /> */}
          <Block type="sensebox_sen0232" />
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
        <Category name="WIFI" colour={getColour().sensebox}>
          <Block type="sensebox_wifi" />
          <Block type="sensebox_wifi_status" />
          <Block type="sensebox_wifi_rssi" />
          <Block type="sensebox_get_ip" />
          <Block type="sensebox_startap" />
        </Category>
        <Category name="Ethernet" colour={getColour().sensebox}>
          <Block type="sensebox_ethernet" />
          <Block type="sensebox_ethernetIp" />
        </Category>
        <Category name="SD" colour={getColour().sensebox}>
          <Block type="sensebox_sd_create_file" />
          <Block type="sensebox_sd_open_file">
            <Value name="SD">
              <Block type="sensebox_sd_write_file"></Block>
            </Value>
          </Block>
          <Block type="sensebox_sd_write_file" />
          <Block type="sensebox_sd_open_file">
            <Value name="SD">
              <Block type="sensebox_sd_osem">
                <Value name="DO">
                  <Block type="sensebox_sd_save_for_osem"></Block>
                </Value>
              </Block>
            </Value>
          </Block>
          <Block type="sensebox_sd_osem" />
          <Block type="sensebox_sd_save_for_osem" />
        </Category>
        <Category name="LED" colour={getColour().sensebox}>
          <Block type="sensebox_rgb_led"></Block>
          <Block type="sensebox_led" />
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
        {/* <Category name="Telegram" colour={getColour().sensebox}>
          <Block type="sensebox_telegram" />
          <Block type="sensebox_telegram_do" />
          <Block type="sensebox_telegram_do_on_message" />
          <Block type="sensebox_telegram_send" />
        </Category> */}
        <Category name="openSenseMap" colour={getColour().sensebox}>
          <Block type="sensebox_interval_timer">
            <Value name="DO">
              <Block type="sensebox_osem_connection" />
            </Value>
          </Block>
          <Block type="sensebox_send_to_osem" />
        </Category>
        <Category
          id="catSenseBoxOutput_LoRa"
          name="  LoRa"
          colour={getColour().sensebox}
        >
          <Category
            id="catSenseBoxOutput_LoRa_activation"
            name="    Aktivierung"
            colour={getColour().sensebox}
          >
            <Block type="sensebox_lora_initialize_otaa" />
            <Block type="sensebox_lora_initialize_abp" />
          </Category>
          <Category
            id="catSenseBoxOutput_LoRa_loramessage"
            name="    Lora Message"
            colour={getColour().sensebox}
          >
            <Block type="sensebox_lora_message_send" />
            <Block type="sensebox_send_lora_sensor_value" />
          </Category>
          <Category
            id="catSenseBoxOutput_Map"
            name="    TTN Mapper"
            colour={getColour().sensebox}
          >
            <Block type="sensebox_lora_ttn_mapper">
              <Value name="Latitude">
                <Block type="sensebox_gps">
                  <Field name="dropdown">latitude</Field>
                </Block>
              </Value>
              <Value name="Longitude">
                <Block type="sensebox_gps">
                  <Field name="dropdown">longitude</Field>
                </Block>
              </Value>
              <Value name="Altitude">
                <Block type="sensebox_gps">
                  <Field name="dropdown">altitude</Field>
                </Block>
              </Value>
              <Value name="pDOP">
                <Block type="sensebox_gps">
                  <Field name="dropdown">pDOP</Field>
                </Block>
              </Value>
              <Value name="Fix Type">
                <Block type="sensebox_gps">
                  <Field name="dropdown">fixType</Field>
                </Block>
              </Value>
            </Block>
          </Category>
          <Category
            id="catSenseBoxOutput_LoRa_cayenne"
            name="    Cayenne LPP"
            colour={getColour().sensebox}
          >
            <Block type="sensebox_lora_cayenne_send" />
            <Block type="sensebox_lora_cayenne_temperature" />
            <Block type="sensebox_lora_cayenne_humidity" />
            <Block type="sensebox_lora_cayenne_pressure" />
            <Block type="sensebox_lora_cayenne_luminosity" />
            <Block type="sensebox_lora_cayenne_concentration" />
            <Block type="sensebox_lora_cayenne_sensor" />
            <Block type="sensebox_lora_cayenne_accelerometer" />
            <Block type="sensebox_lora_cayenne_gps" />
          </Category>
        </Category>
        <Category id="phyphox" name="Phyphox" colour={getColour().phyphox}>
          <Block type="sensebox_phyphox_init"></Block>
          <Block type="sensebox_phyphox_experiment">
            <Value name="view">
              <Block type="sensebox_phyphox_graph">
                <Value name="channel0">
                  <Block type="sensebox_phyphox_timestamp"></Block>
                </Value>
                <Value name="channel1">
                  <Block type="sensebox_phyphox_channel"></Block>
                </Value>
              </Block>
            </Value>
          </Block>
          <Block type="sensebox_phyphox_experiment_send">
            <Value name="sendValues">
              <Block type="sensebox_phyphox_sendchannel"></Block>
            </Value>
          </Block>
          <Block type="sensebox_phyphox_graph"></Block>
          <Block type="sensebox_phyphox_timestamp"></Block>
          <Block type="sensebox_phyphox_channel"></Block>
          <Block type="sensebox_phyphox_sendchannel"></Block>
        </Category>
        <Category
          id="webserver"
          name="Webserver"
          colour={getColour().webserver}
        >
          <Block type="sensebox_initialize_http_server"></Block>
          <Block type="sensebox_http_on_client_connect"></Block>
          <Block type="sensebox_ip_address"></Block>
          <Block type="sensebox_http_method"></Block>
          <Block type="sensebox_http_uri"></Block>
          <Block type="sensebox_http_protocol_version"></Block>
          <Block type="sensebox_http_user_agent"></Block>
          <Block type="sensebox_generate_http_succesful_response"></Block>
          <Block type="sensebox_generate_http_not_found_response"></Block>
          <Block type="sensebox_generate_html_doc"></Block>
          <Block type="sensebox_general_html_tag"></Block>
          <Block type="sensebox_web_readHTML"></Block>
        </Category>
        <Category id="mqtt" name="MQTT" colour={getColour().mqtt}>
          <Block type="sensebox_mqtt_setup" />
          <Block type="sensebox_mqtt_publish" />
          {/* <Block type="sensebox_mqtt_subscribe" /> */}
        </Category>
        <Category name={Blockly.Msg.toolbox_logic} colour={getColour().logic}>
          <Block type="controls_if" />
          <Block type="controls_ifelse" />
          <Block type="logic_compare" />
          <Block type="logic_operation" />
          <Block type="logic_negate" />
          <Block type="logic_boolean" />
          <Block type="switch_case" />
        </Category>
        <Category
          id="loops"
          name={Blockly.Msg.toolbox_loops}
          colour={getColour().loops}
        >
          <Block type="controls_repeat_ext">
            <Value name="TIMES">
              <Block type="math_number">
                <Field name="NUM">10</Field>
              </Block>
            </Value>
          </Block>
          <Block type="controls_whileUntil" />
          <Block type="controls_for">
            <Value name="FROM">
              <Block type="math_number">
                <Field name="NUM">1</Field>
              </Block>
            </Value>
            <Value name="TO">
              <Block type="math_number">
                <Field name="NUM">10</Field>
              </Block>
            </Value>
            <Value name="BY">
              <Block Type="math_number">
                <Field name="NUM">1</Field>
              </Block>
            </Value>
          </Block>
          <Block type="controls_flow_statements" />
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
        <Category
          id="time"
          name={Blockly.Msg.toolbox_time}
          colour={getColour().time}
        >
          <Block type="time_delay">
            <Value name="DELAY_TIME_MILI">
              <Block type="math_number">
                <Field name="NUM">1000</Field>
              </Block>
            </Value>
          </Block>
          <Block type="time_delaymicros">
            <Value name="DELAY_TIME_MICRO">
              <Block type="math_number">
                <Field name="NUM">100</Field>
              </Block>
            </Value>
          </Block>
          <Block type="time_millis"></Block>
          <Block type="time_micros"></Block>
          <Block type="infinite_loop"></Block>
          <Block type="sensebox_interval_timer"></Block>
          <Block type="sensebox_rtc_init"></Block>
          <Block type="sensebox_rtc_set">
            <Value name="second">
              <Block type="math_number">
                <Field name="NUM">00</Field>
              </Block>
            </Value>
            <Value name="minutes">
              <Block type="math_number">
                <Field name="NUM">00</Field>
              </Block>
            </Value>
            <Value name="hour">
              <Block type="math_number">
                <Field name="NUM">00</Field>
              </Block>
            </Value>
            <Value name="day">
              <Block type="math_number">
                <Field name="NUM">01</Field>
              </Block>
            </Value>
            <Value name="month">
              <Block type="math_number">
                <Field name="NUM">01</Field>
              </Block>
            </Value>
            <Value name="year">
              <Block type="math_number">
                <Field name="NUM">1970</Field>
              </Block>
            </Value>
          </Block>
          {/* <Block type="sensebox_rtc_set_ntp"></Block> */}
          <Block type="sensebox_rtc_get"></Block>
          <Block type="sensebox_rtc_get_timestamp"></Block>
        </Category>
        <Category
          id="math"
          name={Blockly.Msg.toolbox_math}
          colour={getColour().math}
        >
          <Block type="math_number"></Block>
          <Block type="math_arithmetic"></Block>
          <Block type="math_single"></Block>
          <Block type="math_trig"></Block>
          <Block type="math_constant"></Block>
          <Block type="math_number_property"></Block>
          <Block type="math_change">
            <Value name="DELTA">
              <Block type="math_number">
                <Field name="NUM">1</Field>
              </Block>
            </Value>
          </Block>
          <Block type="math_round"></Block>
          <Block type="math_modulo"></Block>
          <Block type="math_constrain">
            <Value name="LOW">
              <Block type="math_number">
                <Field name="NUM">1</Field>
              </Block>
            </Value>
            <Value name="HIGH">
              <Block type="math_number">
                <Field name="NUM">100</Field>
              </Block>
            </Value>
          </Block>
          <Block type="math_random_int">
            <Value name="FROM">
              <Block type="math_number">
                <Field name="NUM">1</Field>
              </Block>
            </Value>
            <Value name="TO">
              <Block type="math_number">
                <Field name="NUM">100</Field>
              </Block>
            </Value>
          </Block>
          <Block type="math_random_float"></Block>
          <Block type="base_map"></Block>
        </Category>
        <Category id="audio" name="Audio" colour={getColour().audio}>
          <Block type="io_tone">
            <Value name="FREQUENCY">
              <Shadow type="math_number">
                <Field name="NUM">220</Field>
              </Shadow>
            </Value>
          </Block>
          <Block type="io_notone"></Block>
        </Category>
        <Category
          name={Blockly.Msg.toolbox_variables}
          colour={getColour().variables}
          custom="CREATE_TYPED_VARIABLE"
        ></Category>
        {/* <Category name="Arrays" colour={getColour().arrays}>
          <Block type="lists_create_empty" />
          <Block type="array_getIndex" />
          <Block type="lists_length" />
        </Category> */}
        <Category
          name={Blockly.Msg.toolbox_functions}
          colour={getColour().procedures}
          custom="PROCEDURE"
        ></Category>
        <sep></sep>
        <Category name={Blockly.Msg.toolbox_advanced} colour={getColour().io}>
          <Category
            name={Blockly.Msg.toolbox_serial}
            colour={getColour().serial}
          >
            <Block type="init_serial_monitor"></Block>
            <Block type="print_serial_monitor"></Block>
          </Category>
          <Category name={Blockly.Msg.toolbox_io} colour={getColour().io}>
            <Block type="io_digitalwrite"></Block>
            <Block type="io_digitalread"></Block>
            <Block type="io_builtin_led"></Block>
            <Block type="io_analogwrite"></Block>
            <Block type="io_analogread"></Block>
            <Block type="io_highlow"></Block>
            <Block type="io_pulsein">
              <Value name="PULSETYPE">
                <Shadow type="io_highlow"></Shadow>
              </Value>
            </Block>
            <Block type="io_pulsetimeout">
              <Value name="PULSETYPE">
                <Shadow type="io_highlow"></Shadow>
              </Value>
              <Value name="TIMEOUT">
                <Shadow type="math_number">
                  <Field name="NUM">100</Field>
                </Shadow>
              </Value>
            </Block>
          </Category>
          <Category name="Watchdog" colour={getColour().io}>
            <Block type="watchdog_enable"></Block>
            <Block type="watchdog_reset"></Block>
          </Category>
        </Category>
        {/* this block is the initial block of the workspace; not necessary
                    to display, because it can only be used once anyway
                <Category name="Procedures" colour={getColour().procedures}>
                    <Block type="arduino_functions" />
                </Category>
                */}
      </xml>
    );
  }
}

export default Toolbox;
