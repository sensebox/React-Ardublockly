import Blockly from "blockly";
import { getColour } from "../helpers/colour";
import * as Types from "../helpers/types";
import { selectedBoard } from "../helpers/board";
import { FieldGridDropdown } from "@blockly/field-grid-dropdown";

/**
 * HDC1080 Temperature and Humidity Sensor
 *
 */

Blockly.Blocks["sensebox_sensor_temp_hum"] = {
  init: function () {
    this.appendDummyInput().appendField(Blockly.Msg.senseBox_temp_hum);
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Blockly.Msg.senseBox_value)
      .appendField(
        new Blockly.FieldDropdown([
          [Blockly.Msg.senseBox_temp, "Temperature"],
          [Blockly.Msg.senseBox_hum, "Humidity"],
        ]),
        "NAME"
      );
    this.setOutput(true, Types.DECIMAL.typeName);
    this.setColour(getColour().sensebox);
    this.setTooltip(Blockly.Msg.senseBox_temp_hum_tooltip);
    this.setHelpUrl(Blockly.Msg.senseBox_temp_hum_helpurl);
  },
};

/**
 * VEML6070 and TSL4513
 *
 */

Blockly.Blocks["sensebox_sensor_uv_light"] = {
  init: function () {
    this.appendDummyInput().appendField(Blockly.Msg.senseBox_uv_light);
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Blockly.Msg.senseBox_value)
      .appendField(
        new Blockly.FieldDropdown([
          [Blockly.Msg.senseBox_light, "Illuminance"],
          [Blockly.Msg.senseBox_uv, "UvIntensity"],
        ]),
        "NAME"
      );
    this.setOutput(true, Types.DECIMAL.typeName);
    this.setColour(getColour().sensebox);
    this.setTooltip(Blockly.Msg.senseBox_uv_light_tooltip);
    this.setHelpUrl(Blockly.Msg.senseBox_uv_light_helpurl);
  },
};

/*
BMX055 Three differen Blocks for Accelerometer, Gyroscope, Compass
*/

Blockly.Blocks["sensebox_sensor_bmx055_accelerometer"] = {
  init: function () {
    this.appendDummyInput().appendField(
      Blockly.Msg.senseBox_bmx055_accelerometer
    );
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_LEFT)
      .appendField(Blockly.Msg.senseBox_bmx055_accelerometer_direction)
      .appendField(
        new Blockly.FieldDropdown([
          [Blockly.Msg.senseBox_bmx055_accelerometer_direction_x, "X"],
          [Blockly.Msg.senseBox_bmx055_accelerometer_direction_y, "Y"],
          [Blockly.Msg.senseBox_bmx055_accelerometer_direction_z, "Z"],
          [Blockly.Msg.senseBox_bmx055_accelerometer_direction_total, "Total"],
        ]),
        "VALUE"
      );
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_LEFT)
      .appendField(Blockly.Msg.senseBox_bmx055_accelerometer_range)
      .appendField(
        new Blockly.FieldDropdown([
          [Blockly.Msg.senseBox_bmx055_accelerometer_range_2g, "0x3"],
          [Blockly.Msg.senseBox_bmx055_accelerometer_range_4g, "0x5"],
          [Blockly.Msg.senseBox_bmx055_accelerometer_range_8g, "0x8"],
          [Blockly.Msg.senseBox_bmx055_accelerometer_range_16g, "0x0C"],
        ]),
        "RANGE"
      );
    this.setOutput(true, Types.DECIMAL.typeName);
    this.setColour(getColour().sensebox);
    this.setTooltip(Blockly.Msg.senseBox_bmx055_accelerometer_tooltip);
    this.setHelpUrl(Blockly.Msg.senseBox_bmx055_helpurl);
  },
};

/**
 * SDS011 Fine Particular Matter Sensor
 *
 */

Blockly.Blocks["sensebox_sensor_sds011"] = {
  init: function () {
    this.appendDummyInput().appendField(Blockly.Msg.senseBox_sds011);
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Blockly.Msg.senseBox_value)
      .appendField(
        new Blockly.FieldDropdown([
          [Blockly.Msg.senseBox_sds011_pm25, "pm25"],
          [Blockly.Msg.senseBox_sds011_pm10, "pm10"],
        ]),
        "NAME"
      )
      .appendField(Blockly.Msg.senseBox_sds011_dimension)
      .appendField(
        new Blockly.FieldDropdown(
          selectedBoard().serialSensors),
        "SERIAL"
      );
    this.setOutput(true, Types.DECIMAL.typeName);
    this.setColour(getColour().sensebox);
    this.setTooltip(Blockly.Msg.senseBox_sds011_tooltip);
    this.setHelpUrl(Blockly.Msg.senseBox_sds011_helpurl);
  },
};

/**
 * BMP280 Pressure Sensor
 *
 */

Blockly.Blocks["sensebox_sensor_pressure"] = {
  init: function () {
    var dropdownOptions = [
      [Blockly.Msg.senseBox_pressure, "Pressure"],
      [Blockly.Msg.senseBox_temp, "Temperature"],
      [Blockly.Msg.senseBox_gps_alt, "Altitude"],
    ];
    var dropdown = new Blockly.FieldDropdown(dropdownOptions, function (
      option
    ) {
      var input =
        option === "Pressure" ||
        option === "Temperature" ||
        option === "Altitude";
      this.sourceBlock_.updateShape_(input);
    });
    this.appendDummyInput().appendField(Blockly.Msg.senseBox_pressure_sensor);
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Blockly.Msg.senseBox_value)
      .appendField(dropdown, "NAME");
    this.setColour(getColour().sensebox);
    this.setOutput(true, Types.DECIMAL.typeName);
    this.setTooltip(Blockly.Msg.senseBox_pressure_tooltip);
    this.setHelpUrl(Blockly.Msg.senseBox_pressure_helpurl);
    this.getField("NAME").setValidator(
      function (val) {
        this.updateShape_(val === "Altitude");
      }.bind(this)
    );
  },
  updateShape_(isAltitude) {
    if (isAltitude) {
      if (this.getInput("extraField") == null) {
        this.appendDummyInput("extraField")
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField(Blockly.Msg.senseBox_pressure_referencePressure)
          .appendField(new Blockly.FieldTextInput("1013"), "referencePressure")
          .appendField(Blockly.Msg.senseBox_pressure_referencePressure_dim);
      }
    } else {
      this.removeInput("extraField", true);
    }
  },
};

/**
 * BME680 Environmental Sensor
 *
 */

Blockly.Blocks["sensebox_sensor_bme680_bsec"] = {
  init: function () {
    var dropdownOptions = [
      [Blockly.Msg.senseBox_temp, "temperature"],
      [Blockly.Msg.senseBox_hum, "humidity"],
      [Blockly.Msg.senseBox_bme_pressure, "pressure"],
      [Blockly.Msg.senseBox_bme_iaq, "IAQ"],
      [Blockly.Msg.senseBox_bme_iaq_accuracy, "IAQAccuracy"],
      [Blockly.Msg.senseBox_bme_co2, "CO2"],
      [Blockly.Msg.senseBox_bme_breatheVocEquivalent, "breathVocEquivalent"],
    ];
    this.appendDummyInput().appendField(Blockly.Msg.senseBox_bme680);
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Blockly.Msg.senseBox_value)
      .appendField(new Blockly.FieldDropdown(dropdownOptions), "dropdown");
    this.setOutput(true, Types.DECIMAL.typeName);
    this.setColour(getColour().sensebox);
    this.setTooltip(Blockly.Msg.senseBox_bme_tooltip);
    this.setHelpUrl(Blockly.Msg.senseBox_bme680_helpurl);
  },
};

/**
 * Ultrasonic Sensor
 *
 *
 */

Blockly.Blocks["sensebox_sensor_ultrasonic_ranger"] = {
  init: function () {
    var dropdownOptions = [
      [Blockly.Msg.senseBox_ultrasonic_port_A, "A"],
      [Blockly.Msg.senseBox_ultrasonic_port_B, "B"],
      [Blockly.Msg.senseBox_ultrasonic_port_C, "C"],
    ];
    var dropdown = new FieldGridDropdown(dropdownOptions, function (option) {
      var input = option === "A" || option === "B" || option === "C";
      this.sourceBlock_.updateShape_(input);
    });

    this.setColour(getColour().sensebox);
    this.appendDummyInput()
      .appendField(Blockly.Msg.senseBox_ultrasonic)
      .appendField(dropdown, "port");
    this.appendDummyInput("TrigEcho")
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Blockly.Msg.senseBox_ultrasonic_trigger)
      .appendField(
        new Blockly.FieldDropdown(selectedBoard().digitalPins),
        "ultrasonic_trigger"
      )
      .appendField(Blockly.Msg.senseBox_ultrasonic_echo)
      .appendField(
        new Blockly.FieldDropdown(selectedBoard().digitalPins),
        "ultrasonic_echo"
      );
    this.appendDummyInput("maxDistance")
      .appendField(Blockly.Msg.senseBox_ultrasonic_maxDistance)
      .appendField(new Blockly.FieldTextInput("250"), "maxDistance")
      .appendField("cm");
    this.setOutput(true, Types.NUMBER.typeName);
    this.setTooltip(Blockly.Msg.senseBox_ultrasonic_tooltip);
    this.setHelpUrl(Blockly.Msg.senseBox_ultrasonic_helpurl);
  },
  /**
   * Parse XML to restore the number of pins available.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function (xmlElement) {
    xmlElement.getAttribute("port");
  },
  /**
   * Create XML to represent number of pins selection.
   * @return {!Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function () {
    var container = document.createElement("mutation");
    var input = this.getFieldValue("port");
    this.updateShape_(input);
    container.setAttribute("port", input);
    return container;
  },
  /**
   * Modify this block to have the correct number of pins available.
   * @param {boolean}
   * @private
   * @this Blockly.Block
   */
  updateShape_: function () {
    var input = this.getFieldValue("port");
    switch (input) {
      case "A":
        this.setFieldValue("1", "ultrasonic_trigger");
        this.setFieldValue("2", "ultrasonic_echo");
        break;
      case "B":
        this.setFieldValue("3", "ultrasonic_trigger");
        this.setFieldValue("4", "ultrasonic_echo");
        break;
      case "C":
        this.setFieldValue("5", "ultrasonic_trigger");
        this.setFieldValue("6", "ultrasonic_echo");
        break;
      default:
        break;
    }
  },
};

/**
 * Microphone
 *
 */

Blockly.Blocks["sensebox_sensor_sound"] = {
  init: function () {
    this.setColour(getColour().sensebox);
    this.appendDummyInput()
      .appendField(Blockly.Msg.senseBox_sound)
      .appendField("Pin:")
      .appendField(
        new Blockly.FieldDropdown(selectedBoard().analogPins),
        "PIN"
      );
    this.setOutput(true, Types.NUMBER.typeName);
    this.setHelpUrl(Blockly.Msg.senseBox_sound_helpurl);
    this.setTooltip(Blockly.Msg.senseBox_sound_tooltip);
  },
};

/**
 * Button
 *
 *
 */

Blockly.Blocks["sensebox_button"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(Blockly.Msg.senseBox_button)
      .appendField(
        new Blockly.FieldDropdown([
          [Blockly.Msg.senseBox_button_isPressed, "isPressed"],
          [Blockly.Msg.senseBox_button_wasPressed, "wasPressed"],
          [Blockly.Msg.senseBox_button_longPress, "longPress"],
        ]),
        "FUNCTION"
      )
      .appendField("Pin:")
      .appendField(
        new Blockly.FieldDropdown(selectedBoard().digitalPinsButton),
        "PIN"
      );
    this.setOutput(true, Types.BOOLEAN.typeName);
    this.setColour(getColour().sensebox);
    this.setTooltip(Blockly.Msg.senseBox_button_tooltip);
    this.getField("FUNCTION").setValidator(
      function (val) {
        this.updateShape_(val === "longPress");
      }.bind(this)
    );
  },
  updateShape_(isLongPress) {
    if (isLongPress) {
      if (this.getInput("extraField") == null) {
        this.appendDummyInput("extraField")
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField(Blockly.Msg.senseBox_button_longPress_time)
          .appendField(new Blockly.FieldTextInput("1000"), "time")
          .appendField("ms");
      }
    } else {
      this.removeInput("extraField", true);
    }
  },
};

/**
 * SCD30 CO2 Sensor
 *
 */

Blockly.Blocks["sensebox_scd30"] = {
  init: function () {
    var dropdownOptions = [
      [Blockly.Msg.senseBox_scd_co2, "CO2"],
      [Blockly.Msg.senseBox_temp, "temperature"],
      [Blockly.Msg.senseBox_hum, "humidity"],
    ];
    this.appendDummyInput().appendField(Blockly.Msg.senseBox_scd30);
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Blockly.Msg.senseBox_value)
      .appendField(new Blockly.FieldDropdown(dropdownOptions), "dropdown");
    this.setOutput(true, Types.NUMBER.typeName);
    this.setColour(getColour().sensebox);
    this.setTooltip(Blockly.Msg.senseBox_scd_tooltip);
    this.setHelpUrl(Blockly.Msg.senseBox_scd_helpurl);
  },
  onchange: function (e) {
    var dropdown = this.getFieldValue("dropdown");
    if (dropdown === "temperature" || dropdown === "humidity") {
      this.setOutput(true, Types.DECIMAL.typeName);
    } else if (dropdown === "CO2") {
      this.setOutput(true, Types.NUMBER.typeName);
    }
  },
};

/**
 * GPS Module
 *
 */

Blockly.Blocks["sensebox_gps"] = {
  init: function () {
    var dropdownOptions = [
      [Blockly.Msg.senseBox_gps_lat, "latitude"],
      [Blockly.Msg.senseBox_gps_lng, "longitude"],
      [Blockly.Msg.senseBox_gps_alt, "altitude"],
      [Blockly.Msg.senseBox_gps_timeStamp, "timestamp"],
      [Blockly.Msg.senseBox_gps_speed, "speed"],
      ["pDOP", "pDOP"],
      ["Fix Type", "fixType"],
    ];
    this.appendDummyInput().appendField("GPS Modul");
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Blockly.Msg.senseBox_value)
      .appendField(new Blockly.FieldDropdown(dropdownOptions), "dropdown");
    this.setOutput(true, Types.NUMBER.typeName);
    this.setColour(getColour().sensebox);
    this.setTooltip(Blockly.Msg.senseBox_gps_tooltip);
  },
};

/**
 * Block for Truebner STM50
 */

Blockly.Blocks["sensebox_sensor_truebner_smt50"] = {
  init: function () {
    var dropdownOptions = [
      [Blockly.Msg.senseBox_ultrasonic_port_A, "A"],
      [Blockly.Msg.senseBox_ultrasonic_port_B, "B"],
      [Blockly.Msg.senseBox_ultrasonic_port_C, "C"],
    ];
    this.setColour(getColour().sensebox);
    this.appendDummyInput().appendField(Blockly.Msg.senseBox_smt50);
    this.appendDummyInput()
      .appendField("Port:")
      .appendField(new Blockly.FieldDropdown(dropdownOptions), "Port");
    this.appendDummyInput()
      .appendField(Blockly.Msg.senseBox_value)
      .appendField(
        new Blockly.FieldDropdown([
          [Blockly.Msg.senseBox_temp, "temp"],
          [Blockly.Msg.senseBox_soil, "soil"],
        ]),
        "value"
      );
    this.setOutput(true, Types.NUMBER.typeName);
    this.setTooltip(Blockly.Msg.senseBox_smt50_tooltip);
    this.setHelpUrl(Blockly.Msg.senseBox_smt50_helpurl);
  },
};

/**
 * DS18B20 Watertemperature
 *
 */

Blockly.Blocks["sensebox_sensor_watertemperature"] = {
  init: function () {
    var dropdownOptions = [
      [Blockly.Msg.senseBox_ultrasonic_port_A, "A"],
      [Blockly.Msg.senseBox_ultrasonic_port_B, "B"],
      [Blockly.Msg.senseBox_ultrasonic_port_C, "C"],
    ];
    this.setColour(getColour().sensebox);
    this.appendDummyInput()
      .appendField(Blockly.Msg.senseBox_watertemperature)
      .appendField("Port:")
      .appendField(new Blockly.FieldDropdown(dropdownOptions), "Port");
    this.setOutput(true, Types.NUMBER.typeName);
    this.setTooltip(Blockly.Msg.senseBox_watertemperature_tip);
  },
};

/**
 * Windspeed
 * removed for now


Blockly.Blocks['sensebox_windspeed'] = {
  init: function () {
    this.setColour(getColour().sensebox);
    this.appendDummyInput()
      .appendField(Blockly.Msg.senseBox_windspeed)
      .appendField("Pin:")
      .appendField(new Blockly.FieldDropdown(selectedBoard().analogPins), "PIN")
    this.setOutput(true, Types.DECIMAL.typeName);
  }
};
 */

/**
 * DF Robot Soundsensor
 */

Blockly.Blocks["sensebox_soundsensor_dfrobot"] = {
  init: function () {
    var dropdownOptions = [
      [Blockly.Msg.senseBox_ultrasonic_port_A, "A"],
      [Blockly.Msg.senseBox_ultrasonic_port_B, "B"],
      [Blockly.Msg.senseBox_ultrasonic_port_C, "C"],
    ];
    this.setColour(getColour().sensebox);
    this.appendDummyInput()
      .appendField(Blockly.Msg.senseBox_soundsensor_dfrobot)
      .appendField("Port:")
      .appendField(new Blockly.FieldDropdown(dropdownOptions), "Port");
    this.setOutput(true, Types.DECIMAL.typeName);
    this.setTooltip(Blockly.Msg.senseBox_soundsensor_dfrobot_tooltip);
    this.setHelpUrl(Blockly.Msg.senseBox_soundsensor_dfrobot_helpurl);
  },
};

/**
 * Infineon DPS310 Pressure Sensor
 *
 */

Blockly.Blocks["sensebox_sensor_dps310"] = {
  init: function () {
    var dropdownOptions = [
      [Blockly.Msg.senseBox_pressure, "Pressure"],
      [Blockly.Msg.senseBox_temp, "Temperature"],
      [Blockly.Msg.senseBox_gps_alt, "Altitude"],
    ];
    var dropdown = new Blockly.FieldDropdown(dropdownOptions, function (
      option
    ) {
      var input =
        option === "Pressure" ||
        option === "Temperature" ||
        option === "Altitude";
      this.sourceBlock_.updateShape_(input);
    });
    this.appendDummyInput().appendField(Blockly.Msg.senseBox_sensor_dps310);
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Blockly.Msg.senseBox_value)
      .appendField(dropdown, "NAME");
    this.setColour(getColour().sensebox);
    this.setOutput(true, Types.DECIMAL.typeName);
    this.setTooltip(Blockly.Msg.senseBox_sensor_dps310_tooltip);
    this.setHelpUrl(Blockly.Msg.senseBox_sensor_dps310_helpurl);
    this.getField("NAME").setValidator(
      function (val) {
        this.updateShape_(val === "Altitude");
      }.bind(this)
    );
  },
  updateShape_(isAltitude) {
    if (isAltitude) {
      if (this.getInput("extraField") == null) {
        this.appendDummyInput("extraField")
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField(Blockly.Msg.senseBox_pressure_referencePressure)
          .appendField(new Blockly.FieldTextInput("1013"), "referencePressure")
          .appendField(Blockly.Msg.senseBox_pressure_referencePressure_dim);
      }
    } else {
      this.removeInput("extraField", true);
    }
  },
};

/**
 * Sensirion SPS30 Fine Particular Matter Sensor
 * added 02.12.2022 
 */

 Blockly.Blocks["sensebox_sensor_sps30"] = {
  init: function () {
    this.appendDummyInput().appendField(Blockly.Msg.senseBox_sps30);
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_LEFT)
      .appendField(Blockly.Msg.senseBox_value)
      .appendField(
        new Blockly.FieldDropdown([
          [Blockly.Msg.senseBox_sps30_1p0, "1p0"],
          [Blockly.Msg.senseBox_sps30_2p5, "2p5"],
          [Blockly.Msg.senseBox_sps30_4p0, "4p0"],
          [Blockly.Msg.senseBox_sps30_10p0, "10p0"],
        ]),
        "value"
      )
      .appendField(Blockly.Msg.senseBox_sps30_dimension);
    this.setOutput(true, Types.DECIMAL.typeName);
    this.setColour(getColour().sensebox);
    this.setTooltip(Blockly.Msg.senseBox_sps30_tooltip);
    this.setHelpUrl(Blockly.Msg.senseBox_sps30_helpurl);
  },
};