import { Block, Value, Field, Statement, Shadow, Category, Label } from "..";
import { getColour } from "@/components/Blockly/helpers/colour";
import * as Blockly from "blockly/core";
import "@blockly/toolbox-search";
import "./search-category.css";

export const ToolboxEsp = () => {
  return (
    <>
      <Category name="Search" kind="search">
        {" "}
      </Category>
      <Category
        name={Blockly.Msg.toolbox_sensors}
        colour={getColour().sensebox}
      >
        <Block type="sensebox_sensor_temp_hum" />
        <Block type="sensebox_sensor_uv_light" />
        <Block type="sensebox_esp32s2_light" />
        <Block type="sensebox_esp32s2_accelerometer" />
        <Block type="sensebox_sensor_sds011" />
        <Block type="sensebox_sensor_sps30" />
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
      <Category name="WIFI" colour={getColour().sensebox}>
        <Block type="sensebox_esp32s2_wifi" />
        <Block type="sensebox_esp32s2_wifi_enterprise" />
        <Block type="sensebox_wifi_status" />
        <Block type="sensebox_wifi_rssi" />
        <Block type="sensebox_get_ip" />
        <Block type="sensebox_esp32s2_startap" />
      </Category>
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
        <Block type="sensebox_esp32s2_sd_create_file">
          <Value name="FILENAME">
            <Block type="text">
              <Field name="TEXT">Data</Field>
            </Block>
          </Value>
        </Block>
        <Block type="sensebox_esp32s2_sd_open_file">
          <Value name="FILENAME">
            <Block type="text">
              <Field name="TEXT">Data</Field>
            </Block>
          </Value>
          <Value name="SD">
            <Block type="sensebox_esp32s2_sd_write_file"></Block>
          </Value>
        </Block>
        <Block type="sensebox_esp32s2_sd_write_file" />
        <Block type="sensebox_esp32s2_sd_open_file">
          <Value name="FILENAME">
            <Block type="text">
              <Field name="TEXT">Data</Field>
            </Block>
          </Value>
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
        <Block type="sensebox_sd_exists">
          <Value name="FILENAME">
            <Block type="text">
              <Field name="TEXT">Dateiname</Field>
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
      </Category>
      <Category id="QOOOL" name="QOOOL" colour={"#b7b645"}>
        <Block type="sensebox_fluoroASM_init"></Block>
        <Block type="sensebox_fluoroASM_setLED">
          <Value name="BRIGHTNESS">
            <Block type="math_number">
              <Field name="NUM">30</Field>
            </Block>
          </Value>
        </Block>
      </Category>{" "}
      {/* <Category id="sensebox_solar" name="Solar" colour={getColour().solar}>
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
      </Category> */}
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
    </>
  );
};
