import Blockly from "blockly";

/* SD-Card Blocks using the Standard SD Library*/
/**
 * Code generator for variable (X) getter.
 * Arduino code: loop { X }
 * @param {Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */

Blockly.Arduino.sensebox_sd_create_file = function (block) {
  var filename = this.getFieldValue("Filename");
  var extension = this.getFieldValue("extension");
  var newFileName = filename.concat(".", extension);
  Blockly.Arduino.libraries_["library_spi"] = "#include <SPI.h>";
  Blockly.Arduino.libraries_["library_sd"] = "#include <SD.h>";
  Blockly.Arduino.definitions_["define_" + filename] = `File ${filename};`;
  Blockly.Arduino.setupCode_["sensebox_sd"] = "SD.begin(28);\n";
  Blockly.Arduino.setupCode_[
    "sensebox_sd" + filename
  ] = `${filename} = SD.open("${newFileName}", FILE_WRITE);\n${filename}.close();\n`;
  var code = "";
  return code;
};

Blockly.Arduino.sensebox_sd_open_file = function (block) {
  var filename = this.getFieldValue("Filename");
  var extension = this.getFieldValue("extension");
  var newFileName = filename.concat(".", extension);
  var branch = Blockly.Arduino.statementToCode(block, "SD");
  var code = `${filename} = SD.open("${newFileName}", FILE_WRITE);\n`;
  code += branch;
  code += `${filename}.close();\n`;
  return code;
};

Blockly.Arduino.sensebox_sd_write_file = function (block) {
  if (this.parentBlock_ != null) {
    var filename = this.getSurroundParent().getFieldValue("Filename");
  }
  var branch =
    Blockly.Arduino.valueToCode(this, "DATA", Blockly.Arduino.ORDER_ATOMIC) ||
    '"Keine Eingabe"';
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

Blockly.Arduino.sensebox_sd_osem = function () {
  if (this.parentBlock_ != null) {
    var filename = this.getSurroundParent().getFieldValue("Filename");
  }

  var type = this.getFieldValue("type");
  var blocks = this.getDescendants();
  var branch = Blockly.Arduino.statementToCode(this, "DO");
  var count = 0;
  if (blocks !== undefined) {
    for (var i = 0; i < blocks.length; i++) {
      if (blocks[i].type === "sensebox_sd_save_for_osem") {
        count++;
      }
    }
  }
  var num_sensors = count;
  var timestamp = Blockly.Arduino.valueToCode(
    this,
    "timeStamp",
    Blockly.Arduino.ORDER_ATOMIC
  );
  Blockly.Arduino.definitions_["num_sensors"] =
    "static const uint8_t NUM_SENSORS = " + num_sensors + ";";

  Blockly.Arduino.definitions_["measurement"] = `typedef struct measurement {
    const char *sensorId;
    float value;
  } measurement;`;
  Blockly.Arduino.definitions_["buffer"] = "char buffer[750];";
  Blockly.Arduino.definitions_[
    "num_measurement"
  ] = `measurement measurements[NUM_SENSORS];
  uint8_t num_measurements = 0;`;
  if (type === "Stationary") {
    Blockly.Arduino.functionNames_["addMeasurement"] = `
void addMeasurement(const char *sensorId, float value) {
    measurements[num_measurements].sensorId = sensorId;
    measurements[num_measurements].value = value;
    num_measurements++;
    }
`;
    Blockly.Arduino.functionNames_["writeMeasurementsToSdCard"] = `
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
    Blockly.Arduino.functionNames_["saveValues"] = `
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
    Blockly.Arduino.libraries_["dtostrf.h"] = "#include <avr/dtostrf.h>";
    var lat = Blockly.Arduino.valueToCode(
      this,
      "lat",
      Blockly.Arduino.ORDER_ATOMIC
    );
    var lng = Blockly.Arduino.valueToCode(
      this,
      "lng",
      Blockly.Arduino.ORDER_ATOMIC
    );
    // var altitude = Blockly.Arduino.valueToCode(
    //   this,
    //   "altitude",
    //   Blockly.Arduino.ORDER_ATOMIC
    // );
    Blockly.Arduino.definitions_["num_sensors"] =
      "static const uint8_t NUM_SENSORS = " + num_sensors + ";";

    Blockly.Arduino.definitions_["measurement"] = `typedef struct measurement {
        const char *sensorId;
        float value;
      } measurement;`;
    Blockly.Arduino.definitions_["buffer"] = "char buffer[750];";
    Blockly.Arduino.definitions_[
      "num_measurement"
    ] = `measurement measurements[NUM_SENSORS];
      uint8_t num_measurements = 0;`;
    Blockly.Arduino.functionNames_["addMeasurement"] = `
void addMeasurement(const char *sensorId, float value) {
        measurements[num_measurements].sensorId = sensorId;
        measurements[num_measurements].value = value;
        num_measurements++;
        }
    `;
    Blockly.Arduino.functionNames_["writeMeasurementsToSdCard"] = `
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
    Blockly.Arduino.functionNames_["saveValues"] = `
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

Blockly.Arduino.sensebox_sd_save_for_osem = function (block) {
  var code = "";
  var sensor_id = this.getFieldValue("SensorID");
  var id = sensor_id.slice(-3).toUpperCase();
  var sensor_value =
    Blockly.Arduino.valueToCode(block, "Value", Blockly.Arduino.ORDER_ATOMIC) ||
    '"Keine Eingabe"';
  Blockly.Arduino.definitions_["SENSOR_ID" + id + ""] =
    "const char SENSOR_ID" + id + '[] PROGMEM = "' + sensor_id + '";';
  code += "addMeasurement(SENSOR_ID" + id + "," + sensor_value + ");\n";
  return code;
};

/**
 * senseBox-esp32-s2 sd Blocks
 */

Blockly.Arduino.sensebox_esp32s2_sd_create_file = function (block) {
  var filename = this.getFieldValue("Filename");
  var extension = this.getFieldValue("extension");
  var newFileName = filename.concat(".", extension);


  Blockly.Arduino.libraries_["library_sd"] = `#include <SD.h>`;
  Blockly.Arduino.libraries_["library_spi"] = `#include <SPI.h>`;
  Blockly.Arduino.libraries_["library_fs"] = `#include "FS.h"`;

  Blockly.Arduino.definitions_["define_" + filename] = `File ${filename};`;
  Blockly.Arduino.setupCode_["sensebox_esp32s2_sd"] = "//Init SD\n pinMode(SD_ENABLE,OUTPUT);\n digitalWrite(SD_ENABLE,LOW);\n SPIClass sdspi = SPIClass();\n sdspi.begin(VSPI_SCLK,VSPI_MISO,VSPI_MOSI,VSPI_SS);\n";

  Blockly.Arduino.setupCode_["sensebox_esp32s2_sd", newFileName] = ` ${filename} = fs.open("/${newFileName}", FILE_WRITE);\n fs.open(${filename}, FILE_WRITE);\n ${filename}.close();\n `;
  var code = "";
  return code;
};

Blockly.Arduino.sensebox_esp32s2_sd_open_file = function (block) {
  var filename = this.getFieldValue("Filename");
  var extension = this.getFieldValue("extension");
  var newFileName = filename.concat(".", extension);
  var branch = Blockly.Arduino.statementToCode(block, "SD");
  var code = ` ${filename} = fs.open("/${newFileName}", FILE_WRITE);\n`;
  code +=branch;
  code += ` ${filename}.close();\n`;
  return code;
};




Blockly.Arduino.sensebox_esp32s2_sd_write_file = function (block) {
  if (this.parentBlock_ != null) {
    var filename = this.getSurroundParent().getFieldValue("Filename");
  }



  var branch =
  Blockly.Arduino.valueToCode(this, "DATA", Blockly.Arduino.ORDER_ATOMIC) ||
  '"Keine Eingabe"';

  var linebreak = this.getFieldValue("linebreak");
  if (linebreak === "TRUE") {
    linebreak = "ln";
  } else {
    linebreak = "";
  }


  var code =`${filename}.print${linebreak}(${branch});\n`;
  return code;
};
