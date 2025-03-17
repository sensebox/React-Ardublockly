import * as Blockly from "blockly";

/* SD-Card Blocks using the Standard SD Library*/
/**
 * Code generator for variable (X) getter.
 * Arduino code: loop { X }
 * @param {Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */

Blockly.Generator.Arduino.forBlock["sensebox_sd_create_file"] = function (
  block,
  generator,
) {
  var filename = this.getFieldValue("Filename");
  var extension = this.getFieldValue("extension");
  var newFileName = filename.concat(".", extension);
  Blockly.Generator.Arduino.libraries_["library_spi"] = "#include <SPI.h>";
  Blockly.Generator.Arduino.libraries_["library_sd"] = "#include <SD.h>";
  Blockly.Generator.Arduino.definitions_["define_" + filename] =
    `File ${filename};`;
  Blockly.Generator.Arduino.setupCode_["sensebox_sd"] = "SD.begin(28);\n";
  Blockly.Generator.Arduino.setupCode_["sensebox_sd" + filename] =
    `${filename} = SD.open("${newFileName}", FILE_WRITE);\n${filename}.close();\n`;
  var code = "";
  return code;
};

Blockly.Generator.Arduino.forBlock["sensebox_sd_open_file"] = function (
  block,
  generator,
) {
  var filename = this.getFieldValue("Filename");
  var extension = this.getFieldValue("extension");
  var newFileName = filename.concat(".", extension);
  var branch = Blockly.Generator.Arduino.statementToCode(block, "SD");
  var code = `${filename} = SD.open("${newFileName}", FILE_WRITE);\n`;
  code += branch;
  code += `${filename}.close();\n`;
  return code;
};

Blockly.Generator.Arduino.forBlock["sensebox_sd_write_file"] = function (
  block,
  generator,
) {
  if (this.parentBlock_ != null) {
    var filename = this.getSurroundParent().getFieldValue("Filename");
  }
  var branch =
    Blockly.Generator.Arduino.valueToCode(
      this,
      "DATA",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
    ) || '"Keine Eingabe"';
  var linebreak = this.getFieldValue("linebreak");
  if (linebreak === "TRUE") {
    linebreak = "ln";
  } else {
    linebreak = "";
  }
  var code = "";
  if (branch === "gps.getLongitude()" || branch === "gps.getLatitude()") {
    code = `${filename}.print${linebreak}(${branch},5);\n`;
  } else {
    code = `${filename}.print${linebreak}(${branch});\n`;
  }
  return code;
};

Blockly.Generator.Arduino.forBlock["sensebox_sd_osem"] = function () {
  if (this.parentBlock_ != null) {
    var filename = this.getSurroundParent().getFieldValue("Filename");
  }

  var type = this.getFieldValue("type");
  var blocks = this.getDescendants();
  var branch = Blockly.Generator.Arduino.statementToCode(this, "DO");
  var count = 0;
  if (blocks !== undefined) {
    for (var i = 0; i < blocks.length; i++) {
      if (blocks[i].type === "sensebox_sd_save_for_osem") {
        count++;
      }
    }
  }
  var num_sensors = count;
  var timestamp = Blockly.Generator.Arduino.valueToCode(
    this,
    "timeStamp",
    Blockly.Generator.Arduino.ORDER_ATOMIC,
  );
  Blockly.Generator.Arduino.definitions_["num_sensors"] =
    "static const uint8_t NUM_SENSORS = " + num_sensors + ";";

  Blockly.Generator.Arduino.definitions_["measurement"] =
    `typedef struct measurement {
    const char *sensorId;
    float value;
  } measurement;`;
  Blockly.Generator.Arduino.definitions_["buffer"] = "char buffer[750];";
  Blockly.Generator.Arduino.definitions_["num_measurement"] =
    `measurement measurements[NUM_SENSORS];
  uint8_t num_measurements = 0;`;
  if (type === "Stationary") {
    Blockly.Generator.Arduino.functionNames_["addMeasurement"] = `
void addMeasurement(const char *sensorId, float value) {
    measurements[num_measurements].sensorId = sensorId;
    measurements[num_measurements].value = value;
    num_measurements++;
    }
`;
    Blockly.Generator.Arduino.functionNames_["writeMeasurementsToSdCard"] = `
void writeMeasurementsToSdCard(char* timeStamp) {
    // iterate throug the measurements array
    for (uint8_t i = 0; i < num_measurements; i++) {
sprintf_P(buffer, PSTR("%s,%9.2f,%s"), measurements[i].sensorId, measurements[i].value, timeStamp);         
      // transmit buffer to client
      ${filename}.println(buffer);
    }
    // reset num_measurements
    num_measurements = 0;
}
`;
    Blockly.Generator.Arduino.functionNames_["saveValues"] = `
void saveValues() {


      // send measurements
      writeMeasurementsToSdCard(${timestamp}); 
      num_measurements = 0;
} 
`;
    var code = "";
    code += branch;
    code += "saveValues();";
  } else if (type === "Mobile") {
    /**
     * add mobile functions here
     */
    Blockly.Generator.Arduino.libraries_["dtostrf.h"] =
      "#include <avr/dtostrf.h>";
    var lat = Blockly.Generator.Arduino.valueToCode(
      this,
      "lat",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
    );
    var lng = Blockly.Generator.Arduino.valueToCode(
      this,
      "lng",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
    );
    // var altitude = Blockly.Generator.Arduino.valueToCode(
    //   this,
    //   "altitude",
    //   Blockly.Generator.Arduino.ORDER_ATOMIC
    // );
    Blockly.Generator.Arduino.definitions_["num_sensors"] =
      "static const uint8_t NUM_SENSORS = " + num_sensors + ";";

    Blockly.Generator.Arduino.definitions_["measurement"] =
      `typedef struct measurement {
        const char *sensorId;
        float value;
      } measurement;`;
    Blockly.Generator.Arduino.definitions_["buffer"] = "char buffer[750];";
    Blockly.Generator.Arduino.definitions_["num_measurement"] =
      `measurement measurements[NUM_SENSORS];
      uint8_t num_measurements = 0;`;
    Blockly.Generator.Arduino.functionNames_["addMeasurement"] = `
void addMeasurement(const char *sensorId, float value) {
        measurements[num_measurements].sensorId = sensorId;
        measurements[num_measurements].value = value;
        num_measurements++;
        }
    `;
    Blockly.Generator.Arduino.functionNames_["writeMeasurementsToSdCard"] = `
void writeMeasurementsToSdCard(char* timeStamp, int32_t latitudes, int32_t longitudes) {
    // iterate throug the measurements array
        for (uint8_t i = 0; i < num_measurements; i++) {
            char lng[20];
            char lat[20];
            float longitude = longitudes / (float)10000000;
            float latitude = latitudes / (float)10000000;
            dtostrf(longitude, 8, 7, lng);
            dtostrf(latitude, 8, 7, lat);
            sprintf_P(buffer, PSTR("%s,%9.2f,%s,%02s,%02s"),  measurements[i].sensorId, measurements[i].value, timeStamp, lng, lat);
            // transmit buffer to client
            ${filename}.println(buffer);
            }
            // reset num_measurements
            num_measurements = 0;
        }
    `;
    Blockly.Generator.Arduino.functionNames_["saveValues"] = `
    void saveValues() {
          // send measurements
          writeMeasurementsToSdCard(${timestamp}, ${lat}, ${lng}); 
          num_measurements = 0;
    } 
    `;
    code = "";
    code += branch;
    code += "saveValues();\n";
  }
  return code;
};

Blockly.Generator.Arduino.forBlock["sensebox_sd_save_for_osem"] = function (
  block,
  generator,
) {
  var code = "";
  var sensor_id = this.getFieldValue("SensorID");
  var id = sensor_id.slice(-3).toUpperCase();
  var sensor_value =
    Blockly.Generator.Arduino.valueToCode(
      block,
      "Value",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
    ) || '"Keine Eingabe"';
  Blockly.Generator.Arduino.definitions_["SENSOR_ID" + id + ""] =
    "const char SENSOR_ID" + id + '[] PROGMEM = "' + sensor_id + '";';
  code += "addMeasurement(SENSOR_ID" + id + "," + sensor_value + ");\n";
  return code;
};

/**
 * senseBox-esp32-s2 sd Blocks
 */

Blockly.Generator.Arduino.forBlock["sensebox_esp32s2_sd_create_file"] =
  function (block, generator) {
    var filename = this.getFieldValue("Filename");
    var extension = this.getFieldValue("extension");
    var newFileName = filename.concat(".", extension);

    Blockly.Generator.Arduino.libraries_["library_sd"] = `#include <SD.h>`;
    Blockly.Generator.Arduino.libraries_["library_spi"] = `#include <SPI.h>`;
    Blockly.Generator.Arduino.libraries_["library_fs"] = `#include "FS.h"`;

    Blockly.Generator.Arduino.definitions_["define_" + filename] =
      `File ${filename};`;
    Blockly.Generator.Arduino.definitions_["define_sdspi"] =
      `SPIClass sdspi = SPIClass();`;
    Blockly.Generator.Arduino.setupCode_["sensebox_esp32s2_sd"] =
      "//Init SD\n pinMode(SD_ENABLE,OUTPUT);\n digitalWrite(SD_ENABLE,LOW);\nsdspi.begin(VSPI_SCLK,VSPI_MISO,VSPI_MOSI,VSPI_SS);\n SD.begin(VSPI_SS,sdspi);";
    Blockly.Generator.Arduino.setupCode_["sensebox_esp32s2_sd" + filename] =
      ` ${filename} = SD.open("/${newFileName}", FILE_WRITE);\n ${filename}.close();\n `;
    var code = "";
    return code;
  };

Blockly.Generator.Arduino.forBlock["sensebox_esp32s2_sd_open_file"] = function (
  block,
  generator,
) {
  var filename = this.getFieldValue("Filename");
  var extension = this.getFieldValue("extension");
  var newFileName = filename.concat(".", extension);
  var branch = Blockly.Generator.Arduino.statementToCode(block, "SD");
  var code = ` ${filename} = SD.open("/${newFileName}", FILE_APPEND);\n`;
  code += branch;
  code += ` ${filename}.close();\n`;
  return code;
};

Blockly.Generator.Arduino.forBlock["sensebox_esp32s2_sd_write_file"] =
  function (block, generator) {
    if (this.parentBlock_ != null) {
      var filename = this.getSurroundParent().getFieldValue("Filename");
    }

    var branch =
      Blockly.Generator.Arduino.valueToCode(
        this,
        "DATA",
        Blockly.Generator.Arduino.ORDER_ATOMIC,
      ) || '"Keine Eingabe"';

    var linebreak = this.getFieldValue("linebreak");
    if (linebreak === "TRUE") {
      linebreak = "ln";
    } else {
      linebreak = "";
    }

    var code = `${filename}.print${linebreak}(${branch});\n`;
    return code;
  };
