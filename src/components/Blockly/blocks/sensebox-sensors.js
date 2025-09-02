import * as Blockly from "blockly";
import { getColour } from "@/components/Blockly/helpers/colour";
import * as Types from "../helpers/types";
import { selectedBoard } from "@/components/Blockly/helpers/board";
import { FieldSlider } from "@blockly/field-slider";
import { withBoardParam } from "../helpers/helpUrlBuilder";

/**
 * HDC1080 Temperature and Humidity Sensor
 *
 */

Blockly.Blocks["sensebox_sensor_temp_hum"] = {
  init: function () {
    this.appendDummyInput().appendField(Blockly.Msg.senseBox_temp_hum);
    this.appendDummyInput()
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(Blockly.Msg.senseBox_value)
      .appendField(
        new Blockly.FieldDropdown([
          [Blockly.Msg.senseBox_temp, "Temperature"],
          [Blockly.Msg.senseBox_hum, "Humidity"],
        ]),
        "NAME",
      );
    this.setOutput(true, Types.DECIMAL.typeName);
    this.setColour(getColour().sensebox);
    this.setTooltip(Blockly.Msg.senseBox_temp_hum_tooltip);
    this.setHelpUrl(withBoardParam(Blockly.Msg.senseBox_temp_hum_helpurl));
    this.data = { name: "hdc1080", connection: "I2C" };
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
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(Blockly.Msg.senseBox_value)
      .appendField(
        new Blockly.FieldDropdown([
          [Blockly.Msg.senseBox_light, "Illuminance"],
          [Blockly.Msg.senseBox_uv, "UvIntensity"],
        ]),
        "NAME",
      );
    this.setOutput(true, Types.DECIMAL.typeName);
    this.setColour(getColour().sensebox);
    this.setTooltip(Blockly.Msg.senseBox_uv_light_tooltip);
    this.setHelpUrl(withBoardParam(Blockly.Msg.senseBox_uv_light_helpurl));
    this.data = { name: "veml6070" };
  },
};

/*
BMX055 Three differen Blocks for Accelerometer, Gyroscope, Compass
*/

Blockly.Blocks["sensebox_sensor_bmx055_accelerometer"] = {
  init: function () {
    this.appendDummyInput().appendField(
      Blockly.Msg.senseBox_bmx055_accelerometer,
    );
    this.appendDummyInput()
      .setAlign(Blockly.inputs.Align.LEFT)
      .appendField(Blockly.Msg.senseBox_bmx055_accelerometer_direction)
      .appendField(
        new Blockly.FieldDropdown([
          [Blockly.Msg.senseBox_bmx055_accelerometer_direction_x, "X"],
          [Blockly.Msg.senseBox_bmx055_accelerometer_direction_y, "Y"],
          [Blockly.Msg.senseBox_bmx055_accelerometer_direction_z, "Z"],
          [Blockly.Msg.senseBox_bmx055_accelerometer_direction_total, "Total"],
        ]),
        "VALUE",
      );
    this.appendDummyInput()
      .setAlign(Blockly.inputs.Align.LEFT)
      .appendField(Blockly.Msg.senseBox_bmx055_accelerometer_range)
      .appendField(
        new Blockly.FieldDropdown([
          [Blockly.Msg.senseBox_bmx055_accelerometer_range_2g, "0x3"],
          [Blockly.Msg.senseBox_bmx055_accelerometer_range_4g, "0x5"],
          [Blockly.Msg.senseBox_bmx055_accelerometer_range_8g, "0x8"],
          [Blockly.Msg.senseBox_bmx055_accelerometer_range_16g, "0x0C"],
        ]),
        "RANGE",
      );
    this.setOutput(true, Types.DECIMAL.typeName);
    this.setColour(getColour().sensebox);
    this.setTooltip(Blockly.Msg.senseBox_bmx055_accelerometer_tooltip);
    this.setHelpUrl(Blockly.Msg.senseBox_bmx055_helpurl);
    this.data = { name: "bmx055" };
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
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(Blockly.Msg.senseBox_value)
      .appendField(
        new Blockly.FieldDropdown([
          [Blockly.Msg.senseBox_sds011_pm25, "25"],
          [Blockly.Msg.senseBox_sds011_pm10, "10"],
        ]),
        "NAME",
      )
      .appendField(Blockly.Msg.senseBox_sds011_dimension)
      .appendField(
        new Blockly.FieldDropdown(selectedBoard().serialSensors),
        "SERIAL",
      );
    this.setOutput(true, Types.DECIMAL.typeName);
    this.setColour(getColour().sensebox);
    this.setTooltip(Blockly.Msg.senseBox_sds011_tooltip);
    this.setHelpUrl(Blockly.Msg.senseBox_sds011_helpurl);
    this.data = { name: "sds011" };
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
      option,
    ) {
      var input =
        option === "Pressure" ||
        option === "Temperature" ||
        option === "Altitude";
      this.sourceBlock_.updateShape_(input);
    });
    this.appendDummyInput().appendField(Blockly.Msg.senseBox_pressure_sensor);
    this.appendDummyInput()
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(Blockly.Msg.senseBox_value)
      .appendField(dropdown, "NAME");
    this.setColour(getColour().sensebox);
    this.setOutput(true, Types.DECIMAL.typeName);
    this.setTooltip(Blockly.Msg.senseBox_pressure_tooltip);
    this.setHelpUrl(withBoardParam(Blockly.Msg.senseBox_pressure_helpurl));
    this.data = { name: "bmp280" };
    this.getField("NAME").setValidator(
      function (val) {
        this.updateShape_(val === "Altitude");
      }.bind(this),
    );
  },
  updateShape_(isAltitude) {
    if (isAltitude) {
      if (this.getInput("extraField") == null) {
        this.appendDummyInput("extraField")
          .setAlign(Blockly.inputs.Align.RIGHT)
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
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(Blockly.Msg.senseBox_value)
      .appendField(new Blockly.FieldDropdown(dropdownOptions), "dropdown");
    this.setOutput(true, Types.DECIMAL.typeName);
    this.setColour(getColour().sensebox);
    this.setTooltip(Blockly.Msg.senseBox_bme_tooltip);
    this.setHelpUrl(Blockly.Msg.senseBox_bme680_helpurl);
    this.data = { name: "bme680" };
  },
};

/**
 * Ultrasonic Sensor
 *
 *
 */

Blockly.Blocks["sensebox_sensor_ultrasonic_ranger"] = {
  init: function () {
    // var dropdown = new FieldGridDropdown(
    //   selectedBoard().digitalPorts,
    //   function (option) {
    //     var input = option === "A" || option === "B" || option === "C";
    //     this.sourceBlock_.updateShape_(input);
    //   },
    // );

    var dropdown2 = new Blockly.FieldDropdown(
      selectedBoard().digitalPorts,
      function (option) {
        var input = option === "A" || option === "B" || option === "C";
        this.sourceBlock_.updateShape_(input);
      },
    );

    this.setColour(getColour().sensebox);
    this.appendDummyInput()
      .appendField(Blockly.Msg.senseBox_ultrasonic)
      .appendField(dropdown2, "port");
    this.appendDummyInput("TrigEcho")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(Blockly.Msg.senseBox_ultrasonic_trigger)
      .appendField(
        new Blockly.FieldDropdown(selectedBoard().digitalPins),
        "ultrasonic_trigger",
      )
      .appendField(Blockly.Msg.senseBox_ultrasonic_echo)
      .appendField(
        new Blockly.FieldDropdown(selectedBoard().digitalPins),
        "ultrasonic_echo",
      );
    this.appendDummyInput("maxDistance")
      .appendField(Blockly.Msg.senseBox_ultrasonic_maxDistance)
      .appendField(new Blockly.FieldTextInput("250"), "maxDistance")
      .appendField("cm");
    this.setOutput(true, Types.NUMBER.typeName);
    this.setTooltip(Blockly.Msg.senseBox_ultrasonic_tooltip);
    this.setHelpUrl(Blockly.Msg.senseBox_ultrasonic_helpurl);
    this.data = { name: "hc-sr04" };
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
      case "IO1_2":
        this.setFieldValue("1", "ultrasonic_trigger");
        this.setFieldValue("2", "ultrasonic_echo");
        break;
      case "IO3_2":
        this.setFieldValue("3", "ultrasonic_trigger");
        this.setFieldValue("2", "ultrasonic_echo");
        break;
      case "IO3_4":
        this.setFieldValue("3", "ultrasonic_trigger");
        this.setFieldValue("4", "ultrasonic_echo");
        break;
      case "IO5_4":
        this.setFieldValue("5", "ultrasonic_trigger");
        this.setFieldValue("4", "ultrasonic_echo");
        break;
      case "IO5_6":
        this.setFieldValue("5", "ultrasonic_trigger");
        this.setFieldValue("6", "ultrasonic_echo");
        break;
      case "IO7_6":
        this.setFieldValue("7", "ultrasonic_trigger");
        this.setFieldValue("6", "ultrasonic_echo");
        break;
      default:
        break;
    }
  },
};
/**
 * ToF Imager
 *
 */

Blockly.Blocks["sensebox_tof_imager"] = {
  init: function () {
    var dropdownOptions = [
      [Blockly.Msg.sensebox_distance, "DistanzCM"],
      [Blockly.Msg.sensebox_distance_bitmap, "DistanzBM"],
    ];
    var dropdown = new Blockly.FieldDropdown(dropdownOptions);
    this.setColour(getColour().sensebox);
    this.appendDummyInput().appendField(Blockly.Msg.sensebox_tof_imager);
    this.appendDummyInput()
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(Blockly.Msg.senseBox_value)
      .appendField(dropdown, "dropdown");
    this.setOutput(true, Types.NUMBER.typeName);
    this.setTooltip(Blockly.Msg.sensebox_tof_imager_tooltip);
    this.setHelpUrl(withBoardParam(Blockly.Msg.sensebox_tof_imager_helpurl));
    this.getField("dropdown").setValidator(
      function (val) {
        this.updateShape_(val === "DistanzBM");
      }.bind(this),
    );
  },
  updateShape_(isAltitude) {
    if (isAltitude) {
      this.setOutput(true, Types.BITMAP.typeName);
      if (this.getInput("extraField") == null) {
        this.appendDummyInput("extraField")
          // .setAlign(Blockly.inputs.Align.RIGHT) // This doesnt work for manual data input
          .appendField(Blockly.Msg.sensebox_tof_imager_max_distance)
          .appendField(new FieldSlider(200, 1, 400), "maxDistance")
          .appendField(Blockly.Msg.sensebox_tof_imager_max_distance_unit);
      }
    } else {
      this.setOutput(true, Types.NUMBER.typeName);
      this.removeInput("extraField", true);
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
        "PIN",
      );
    this.setOutput(true, Types.NUMBER.typeName);
    this.setHelpUrl(withBoardParam(Blockly.Msg.senseBox_sound_helpurl));
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
          [Blockly.Msg.senseBox_button_switch, "toggleButton"],
        ]),
        "FUNCTION",
      )
      .appendField("Pin:")
      .appendField(
        new Blockly.FieldDropdown(selectedBoard().digitalPinsButton),
        "PIN",
      );
    this.setOutput(true, Types.BOOLEAN.typeName);
    this.setColour(getColour().sensebox);
    this.setTooltip(Blockly.Msg.senseBox_button_tooltip);
    this.getField("FUNCTION").setValidator(
      function (val) {
        this.updateShape_(val === "longPress");
      }.bind(this),
    );
  },
  updateShape_(isLongPress) {
    if (isLongPress) {
      if (this.getInput("extraField") == null) {
        this.appendDummyInput("extraField")
          .setAlign(Blockly.inputs.Align.RIGHT)
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
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(Blockly.Msg.senseBox_value)
      .appendField(new Blockly.FieldDropdown(dropdownOptions), "dropdown");
    this.setOutput(true, Types.NUMBER.typeName);
    this.setColour(getColour().sensebox);
    this.setTooltip(Blockly.Msg.senseBox_scd_tooltip);
    this.setHelpUrl(Blockly.Msg.senseBox_scd_helpurl);
    this.data = { name: "scd30" };
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
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(Blockly.Msg.senseBox_value)
      .appendField(new Blockly.FieldDropdown(dropdownOptions), "dropdown");
    this.setOutput(true, Types.NUMBER.typeName);
    this.setColour(getColour().sensebox);
    this.setTooltip(Blockly.Msg.senseBox_gps_tooltip);
    this.setHelpUrl(Blockly.Msg.senseBox_gps_helpurl);
  },
};

/**
 * Block for Truebner STM50
 */

Blockly.Blocks["sensebox_sensor_truebner_smt50"] = {
  init: function () {
    this.setColour(getColour().sensebox);
    this.appendDummyInput().appendField(Blockly.Msg.senseBox_smt50);
    this.appendDummyInput()
      .appendField("Port:")
      .appendField(
        new Blockly.FieldDropdown(selectedBoard().digitalPorts),
        "Port",
      );
    this.appendDummyInput()
      .appendField(Blockly.Msg.senseBox_value)
      .appendField(
        new Blockly.FieldDropdown([
          [Blockly.Msg.senseBox_temp, "temp"],
          [Blockly.Msg.senseBox_soil, "soil"],
        ]),
        "value",
      );
    this.setOutput(true, Types.NUMBER.typeName);
    this.setTooltip(Blockly.Msg.senseBox_smt50_tooltip);
    this.setHelpUrl(Blockly.Msg.senseBox_smt50_helpurl);
    this.data = { name: "smt50" };
  },
};

/**
 * Block for Truebner STM50 with MCUS2
 */

Blockly.Blocks["sensebox_sensor_truebner_smt50_esp32"] = {
  init: function () {
    this.setColour(getColour().sensebox);
    this.appendDummyInput().appendField(Blockly.Msg.senseBox_smt50);
    this.appendDummyInput()
      .appendField("Port:")
      .appendField(
        new Blockly.FieldDropdown(selectedBoard().digitalPorts),
        "Port",
      );
    this.appendDummyInput()
      .appendField(Blockly.Msg.senseBox_value)
      .appendField(
        new Blockly.FieldDropdown([
          [Blockly.Msg.senseBox_temp, "temp"],
          [Blockly.Msg.senseBox_soil, "soil"],
        ]),
        "value",
      );
    this.setOutput(true, Types.NUMBER.typeName);
    this.setTooltip(Blockly.Msg.senseBox_smt50_tooltip);
    this.setHelpUrl(withBoardParam(Blockly.Msg.senseBox_smt50_helpurl));
    this.data = { name: "smt50" };
  },
};

/**
 * DS18B20 Watertemperature
 *
 */

Blockly.Blocks["sensebox_sensor_watertemperature"] = {
  init: function () {
    this.setColour(getColour().sensebox);
    this.appendDummyInput()
      .appendField(Blockly.Msg.senseBox_watertemperature)
      .appendField("Port:")
      .appendField(
        new Blockly.FieldDropdown(selectedBoard().digitalPorts),
        "Port",
      )
      .appendField("Index:")
      .appendField(new Blockly.FieldDropdown(selectedBoard().oneWire), "Index");
    this.setOutput(true, Types.NUMBER.typeName);
    this.setTooltip(Blockly.Msg.senseBox_watertemperature_tooltip);
    this.data = { name: "ds18b20" };
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
    this.setColour(getColour().sensebox);
    this.appendDummyInput()
      .appendField(Blockly.Msg.senseBox_soundsensor_dfrobot)
      .appendField("Port:")
      .appendField(
        new Blockly.FieldDropdown(selectedBoard().digitalPorts),
        "Port",
      );
    this.setOutput(true, Types.DECIMAL.typeName);
    this.setTooltip(Blockly.Msg.senseBox_soundsensor_dfrobot_tooltip);
    this.setHelpUrl(Blockly.Msg.senseBox_soundsensor_dfrobot_helpurl);
  },
};

/**
 * rg15 rainsensor
 */

Blockly.Blocks["sensebox_rg15_rainsensor"] = {
  init: function () {
    var dropdownOptionsValues = [
      [Blockly.Msg.sensebox_rg15_rainsensor_totalAcc, "getTotalAccumulation"],
      [Blockly.Msg.sensebox_rg15_rainsensor_acc, "getAccumulation"],
      [Blockly.Msg.sensebox_rg15_rainsensor_eventAcc, "getEventAccumulation"],
      [Blockly.Msg.sensebox_rg15_rainsensor_rainInt, "getRainfallIntensity"],
    ];
    this.setColour(getColour().sensebox);
    this.appendDummyInput().appendField(Blockly.Msg.sensebox_rg15_rainsensor);
    this.appendDummyInput()
      .appendField(Blockly.Msg.sensebox_rg15_rainsensor_port)
      .appendField(
        new Blockly.FieldDropdown(selectedBoard().serialSensors),
        "SERIAL",
      );
    this.appendDummyInput()
      .appendField(Blockly.Msg.sensebox_rg15_rainsensor_value)
      .appendField(new Blockly.FieldDropdown(dropdownOptionsValues), "VALUE");
    this.setOutput(true, Types.DECIMAL.typeName);
    this.setTooltip(Blockly.Msg.sensebox_rg15_rainsensor_tooltip);
    this.setHelpUrl(Blockly.Msg.sensebox_rg15_rainsensor_helpurl);
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
      option,
    ) {
      var input =
        option === "Pressure" ||
        option === "Temperature" ||
        option === "Altitude";
      this.sourceBlock_.updateShape_(input);
    });
    this.appendDummyInput().appendField(Blockly.Msg.senseBox_sensor_dps310);
    this.appendDummyInput()
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(Blockly.Msg.senseBox_value)
      .appendField(dropdown, "NAME");
    this.setColour(getColour().sensebox);
    this.setOutput(true, Types.DECIMAL.typeName);
    this.setTooltip(Blockly.Msg.senseBox_sensor_dps310_tooltip);
    this.setHelpUrl(withBoardParam(Blockly.Msg.senseBox_sensor_dps310_helpurl));
    this.data = { name: "dps310" };
    this.getField("NAME").setValidator(
      function (val) {
        this.updateShape_(val === "Altitude");
      }.bind(this),
    );
  },
  updateShape_(isAltitude) {
    if (isAltitude) {
      if (this.getInput("extraField") == null) {
        this.appendDummyInput("extraField")
          .setAlign(Blockly.inputs.Align.RIGHT)
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
      .setAlign(Blockly.inputs.Align.LEFT)
      .appendField(Blockly.Msg.senseBox_value)
      .appendField(
        new Blockly.FieldDropdown([
          [Blockly.Msg.senseBox_sps30_1p0, "1p0"],
          [Blockly.Msg.senseBox_sps30_2p5, "2p5"],
          [Blockly.Msg.senseBox_sps30_4p0, "4p0"],
          [Blockly.Msg.senseBox_sps30_10p0, "10p0"],
        ]),
        "value",
      )
      .appendField(Blockly.Msg.senseBox_sps30_dimension);
    this.setOutput(true, Types.DECIMAL.typeName);
    this.setColour(getColour().sensebox);
    this.setTooltip(Blockly.Msg.senseBox_sps30_tooltip);
    this.setHelpUrl(Blockly.Msg.senseBox_sps30_helpurl);
  },
};

/**
 * senseBox-MCU-S2 onBoard Light Sensor
 *
 *
 */

Blockly.Blocks["sensebox_esp32s2_light"] = {
  init: function () {
    this.appendDummyInput().appendField("ESP32-S2 Phododiode");
    this.appendDummyInput()
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(Blockly.Msg.senseBox_value)
      .appendField(
        new Blockly.FieldDropdown([
          [Blockly.Msg.senseBox_esp32_photodiode, "Light intensity"],
        ]),
        "NAME",
      );
    this.setOutput(true, Types.DECIMAL.typeName);
    this.setColour(getColour().sensebox);
    this.setTooltip(Blockly.Msg.senseBox_esp32_photodiode_tooltip);
    this.setHelpUrl(Blockly.Msg.senseBox_esp32_photodiode_helpurl);
    this.data = { name: "Photodiode" };
  },
};

/**
 * senseBox-MCU ESP32-S2 onBoard accelerometer
 *
 *
 */

Blockly.Blocks["sensebox_esp32s2_accelerometer"] = {
  init: function () {
    this.appendDummyInput().appendField(Blockly.Msg.senseBox_accelerometer);
    this.appendDummyInput()
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(Blockly.Msg.senseBox_value)
      .appendField(
        new Blockly.FieldDropdown([
          ["X", "accelerationX"],
          ["Y", "accelerationY"],
          ["Z", "accelerationZ"],
          [Blockly.Msg.senseBox_temp, "temperature"],
        ]),
        "value",
      );
    this.setOutput(true, Types.DECIMAL.typeName);
    this.setColour(getColour().sensebox);
    this.setTooltip(Blockly.Msg.senseBox_accelerometer_tooltip);
    this.setHelpUrl(withBoardParam(Blockly.Msg.senseBox_accelerometer_helpurl));
    this.data = { name: "acceleration" };
  },
};

Blockly.Blocks["sensebox_sensor_icm20948"] = {
  init: function () {
    this.appendDummyInput().appendField(Blockly.Msg.senseBox_icm20948);
    this.appendDummyInput()
      .setAlign(Blockly.inputs.Align.LEFT)
      .appendField(Blockly.Msg.senseBox_bmx055_accelerometer_direction)
      .appendField(
        new Blockly.FieldDropdown([
          [
            Blockly.Msg.senseBox_bmx055_accelerometer_direction_x,
            "accelerationX",
          ],
          [
            Blockly.Msg.senseBox_bmx055_accelerometer_direction_y,
            "accelerationY",
          ],
          [
            Blockly.Msg.senseBox_bmx055_accelerometer_direction_z,
            "accelerationZ",
          ],
        ]),
        "VALUE",
      );
    this.appendDummyInput()
      .setAlign(Blockly.inputs.Align.LEFT)
      .appendField(Blockly.Msg.senseBox_bmx055_accelerometer_range)
      .appendField(
        new Blockly.FieldDropdown([
          [Blockly.Msg.senseBox_bmx055_accelerometer_range_2g, "2G"],
          [Blockly.Msg.senseBox_bmx055_accelerometer_range_4g, "4G"],
          [Blockly.Msg.senseBox_bmx055_accelerometer_range_8g, "8G"],
          [Blockly.Msg.senseBox_bmx055_accelerometer_range_16g, "16G"],
        ]),
        "RANGE",
      );
    this.setOutput(true, Types.DECIMAL.typeName);
    this.setColour(getColour().sensebox);
    this.setTooltip(Blockly.Msg.senseBox_accelerometer_tooltip);
    this.setHelpUrl(Blockly.Msg.senseBox_accelerometer_helpurl);
    this.data = { name: "icm20948" };
  },
};
