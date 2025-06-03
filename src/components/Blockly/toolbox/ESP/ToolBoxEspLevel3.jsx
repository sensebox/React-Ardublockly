import { Block, Value, Field, Statement, Shadow, Category, Label } from "../..";
import { getColour } from "../../helpers/colour";
import * as Blockly from "blockly/core";

export const ToolBoxEspLevel3 = (props) => {
  return (
    <>
      <Category name="ESPNOW" colour={getColour().sensebox}>
        <Block type="sensebox_esp_now" />
        <Block type="sensebox_esp_now_sender" />
        <Block type="sensebox_get_mac" />
        <Block type="sensebox_esp_now_receive" />
        <Block type="sensebox_esp_now_send" />
      </Category>
      <Category name="Ethernet" colour={getColour().sensebox}>
        <Block type="sensebox_ethernet" />
        <Block type="sensebox_ethernetIp" />
      </Category>
      <Category name="SD" colour={getColour().sensebox}>
        <Block type="sensebox_esp32s2_sd_create_file" />
        <Block type="sensebox_esp32s2_sd_open_file">
          <Value name="SD">
            <Block type="sensebox_esp32s2_sd_write_file"></Block>
          </Value>
        </Block>
        <Block type="sensebox_esp32s2_sd_write_file" />
        <Block type="sensebox_esp32s2_sd_open_file">
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
      <Category name="openSenseMap" colour={getColour().sensebox}>
        <Block type="sensebox_interval_timer">
          <Value name="DO">
            <Block type="sensebox_esp32s2_osem_connection" />
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
      <Category id="Bluetooth" name="Bluetooth" colour={getColour().sensebox}>
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
        {/* <Category id="senseboxble" name="senseBox BLE" colour={getColour().phyphox}>
          <Block type="sensebox_ble_init"></Block>
        </Category> */}
      </Category>
      <Category id="webserver" name="Webserver" colour={getColour().webserver}>
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
      <Category
        id="math"
        name={Blockly.Msg.toolbox_math}
        colour={getColour().math}
      >
        <Block type="math_number"></Block>
        <Block type="math_arithmetic"></Block>
        <Block type="math_negative"></Block>
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
      <Category name={Blockly.Msg.toolbox_advanced} colour={getColour().io}>
        <Category name={Blockly.Msg.toolbox_serial} colour={getColour().serial}>
          <Block type="init_serial_monitor"></Block>
          <Block type="print_serial_monitor"></Block>
        </Category>
        <Category name={Blockly.Msg.toolbox_io} colour={getColour().io}>
          <Block type="io_analogreadmillivolt"></Block>
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
        <Category name={Blockly.Msg.toolbox_motors} colour={getColour().motors}>
          <Block type="sensebox_motors_beginServoMotor" />
          <Block type="sensebox_motors_moveServoMotor">
            <Value name="degrees">
              <Block type="math_number">
                <Field name="NUM">90</Field>
              </Block>
            </Value>
          </Block>
          {/* <Block type="sensebox_motors_I2CMotorBoard_begin" />
        <Block type="sensebox_motors_I2CMotorBoard_moveDCMotor">
          <Value name="speed">
            <Block type="math_number">
              <Field name="NUM">100</Field>
            </Block>
          </Value>
        </Block>
        <Block type="sensebox_motors_I2CMotorBoard_stopDCMotor" />
        <Block type="sensebox_motors_beginStepperMotor" />
        <Block type="sensebox_motors_moveStepperMotor">
          <Value name="steps">
            <Block type="math_number">
              <Field name="NUM">2048</Field>
            </Block>
          </Value>
        </Block> */}
        </Category>
        <Category name="Watchdog" colour={getColour().io}>
          <Block type="watchdog_enable"></Block>
          <Block type="watchdog_reset"></Block>
        </Category>
      </Category>
      <Category
        id="time"
        name={Blockly.Msg.toolbox_time}
        colour={getColour().time}
      >
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
        </Category>
        <Category
          id="time"
          name={Blockly.Msg.toolbox_rtc}
          colour={getColour().time}
        >
          <Label text={Blockly.Msg.toolbox_label_externalRTC}></Label>
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
          id="timeUTP"
          name={Blockly.Msg.toolbox_ntp}
          colour={getColour().time}
        >
          <Block type="sensebox_ntp_init"></Block>
          <Block type="sensebox_ntp_get"></Block>
        </Category>
      </Category>
    </>
  );
};

{
  /* <Category id="sensebox_solar" name="Solar" colour={getColour().solar}>
        <Block type="sensebox_solar_charger_SB041">
          <Field name="value">battery_level</Field>
        </Block>
        <Block type="sensebox_solar_ensure_wake_time">
          <Field name="wake_time">30</Field>
          <Field name="time_scale"> * 1000</Field>
        </Block>
        <Block type="sensebox_solar_deep_sleep_and_restart">
          <Field name="sleep_time">30</Field>
          <Field name="time_scale">60000</Field>
          <Field name="powerOffGPIO">TRUE</Field>
          <Field name="powerOffUART">TRUE</Field>
          <Field name="powerOffXB">TRUE</Field>
        </Block>
        <Block type="controls_ifelse">
          <Value name="IF0">
            <Block type="logic_compare">
              <Field name="OP">GT</Field>
              <Value name="A">
                <Block type="sensebox_solar_charger_SB041">
                  <Field name="value">battery_level</Field>
                </Block>
              </Value>
              <Value name="B">
                <Block type="math_number">
                  <Field name="NUM">2</Field>
                </Block>
              </Value>
            </Block>
          </Value>
          <Statement name="DO0">
            <Block type="sensebox_solar_deep_sleep_and_restart">
              <Field name="sleep_time">30</Field>
              <Field name="time_scale">60000</Field>
              <Field name="powerOffGPIO">TRUE</Field>
              <Field name="powerOffUART">TRUE</Field>
              <Field name="powerOffXB">TRUE</Field>
            </Block>
          </Statement>
          <Statement name="ELSE">
            <Block type="sensebox_solar_deep_sleep_and_restart">
              <Field name="sleep_time">12</Field>
              <Field name="time_scale">3600000</Field>
              <Field name="powerOffGPIO">TRUE</Field>
              <Field name="powerOffUART">TRUE</Field>
              <Field name="powerOffXB">TRUE</Field>
            </Block>
          </Statement>
        </Block>
      </Category> */
}
