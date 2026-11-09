import { selectedInstance, instanceCodeName } from "../../helpers/instances";
import * as Blockly from "blockly";
import { selectedBoard } from "../../helpers/board";

/* SD-Card Blocks using the Standard SD Library*/

/**
 * Whether the currently selected board uses the ESP32 SD/FS API
 * (senseBox MCU-S2 and MCU-Eye) instead of the classic Arduino SD library.
 * @return {boolean}
 */
function isEsp32s2Board() {
  var board = selectedBoard().title;
  return board === "MCU-S2" || board === "MCU-Eye";
}

/**
 * Registers the libraries, definitions and setup code needed to use the SD
 * card on the currently selected board.
 */
function initSdCard(handle = "sdFile") {
  Blockly.Generator.Arduino.definitions_[`define_${handle}`] =
    `File ${handle};`;

  if (isEsp32s2Board()) {
    Blockly.Generator.Arduino.libraries_["library_sd"] = "#include <SD.h>";
    Blockly.Generator.Arduino.libraries_["library_spi"] = "#include <SPI.h>";
    Blockly.Generator.Arduino.libraries_["library_fs"] = '#include "FS.h"';
    Blockly.Generator.Arduino.definitions_["define_sdspi"] =
      "SPIClass sdspi = SPIClass();";

    const isEye = selectedBoard().title === "MCU-Eye";
    Blockly.Generator.Arduino.setupCode_["sensebox_esp32s2_sd"] =
      "// Init SD\n" +
      "pinMode(SD_ENABLE, OUTPUT);\n" +
      "digitalWrite(SD_ENABLE, LOW);\n" +
      (isEye
        ? "sdspi.begin(PIN_SPI_SCK, PIN_SPI_MISO, PIN_SPI_MOSI, PIN_SD_CS);\n" +
          "SD.begin(PIN_SD_CS, sdspi);"
        : "sdspi.begin(VSPI_SCLK, VSPI_MISO, VSPI_MOSI, VSPI_SS);\n" +
          "SD.begin(VSPI_SS, sdspi);");
  } else {
    Blockly.Generator.Arduino.libraries_["library_spi"] = "#include <SPI.h>";
    Blockly.Generator.Arduino.libraries_["library_sd"] = "#include <SD.h>";
    Blockly.Generator.Arduino.setupCode_["sensebox_sd"] = "SD.begin(28);\n";
  }
}

function sdFileReference(block, generator, declaration = false) {
  const definition = declaration ? block : selectedInstance(block, "sd_file");
  const legacy =
    !block.getFieldValue("INSTANCE") && block.getInputTargetBlock("FILENAME");
  if (!definition && !legacy) return null;
  const source = definition || block;
  const handle = definition
    ? instanceCodeName(definition, "sdFile", generator)
    : "sdFile";
  const filename =
    generator.valueToCode(source, "FILENAME", generator.ORDER_NONE) || '"Data"';
  const extension = source.getFieldValue("extension");
  const prefix = isEsp32s2Board() ? "/" : "";
  // Keep expressions intact, including variable and computed file names.
  const path = `(String("${prefix}") + String(${filename}) + ".${extension}").c_str()`;
  initSdCard(handle);
  return { handle, path };
}

function enclosingFile(block, generator) {
  let parent = block.getSurroundParent();
  while (parent) {
    if (
      ["sensebox_sd_open_file", "sensebox_esp32s2_sd_open_file"].includes(
        parent.type,
      )
    ) {
      return sdFileReference(parent, generator);
    }
    parent = parent.getSurroundParent();
  }
  return null;
}

Blockly.Generator.Arduino.forBlock["sensebox_sd_create_file"] = function (
  block,
  generator,
) {
  const file = sdFileReference(block, generator, true);
  return `${file.handle} = SD.open(${file.path}, FILE_WRITE);\n${file.handle}.close();\n`;
};

Blockly.Generator.Arduino.forBlock["sensebox_sd_open_file"] = function (
  block,
  generator,
) {
  const file = sdFileReference(block, generator);
  if (!file) return "";
  const branch = generator.statementToCode(block, "SD");
  const mode = isEsp32s2Board() ? "FILE_APPEND" : "FILE_WRITE";
  return `${file.handle} = SD.open(${file.path}, ${mode});\n${branch}${file.handle}.close();\n`;
};

Blockly.Generator.Arduino.forBlock["sensebox_sd_write_file"] = function (
  block,
  generator,
) {
  const file = enclosingFile(block, generator);
  if (!file) return "";
  const data =
    generator.valueToCode(block, "DATA", generator.ORDER_ATOMIC) ||
    '"Keine Eingabe"';
  const linebreak = block.getFieldValue("linebreak") === "TRUE" ? "ln" : "";
  const precision =
    data === "gps.getLongitude()" || data === "gps.getLatitude()" ? ",5" : "";
  return `${file.handle}.print${linebreak}(${data}${precision});\n`;
};

/**
 * Legacy aliases for the old board-specific SD block types.
 * TODO: Remove these in a future release.
 */
Blockly.Generator.Arduino.forBlock["sensebox_esp32s2_sd_create_file"] =
  Blockly.Generator.Arduino.forBlock["sensebox_sd_create_file"];
Blockly.Generator.Arduino.forBlock["sensebox_esp32s2_sd_open_file"] =
  Blockly.Generator.Arduino.forBlock["sensebox_sd_open_file"];
Blockly.Generator.Arduino.forBlock["sensebox_esp32s2_sd_write_file"] =
  Blockly.Generator.Arduino.forBlock["sensebox_sd_write_file"];

Blockly.Generator.Arduino.forBlock["sensebox_sd_osem"] = function (
  block,
  generator,
) {
  const file = enclosingFile(block, generator);
  if (!file) return "";

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
void writeMeasurementsToSdCard(File &file, char* timeStamp) {
    // iterate throug the measurements array
    for (uint8_t i = 0; i < num_measurements; i++) {
sprintf_P(buffer, PSTR("%s,%9.2f,%s"), measurements[i].sensorId, measurements[i].value, timeStamp);
      // transmit buffer to client
      file.println(buffer);
    }
    // reset num_measurements
    num_measurements = 0;
}
`;
    Blockly.Generator.Arduino.functionNames_["saveValues"] = `
void saveValues(File &file) {


      // send measurements
      writeMeasurementsToSdCard(file, ${timestamp});
      num_measurements = 0;
}
`;
    var code = "";
    code += branch;
    code += `saveValues(${file.handle});`;
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
void writeMeasurementsToSdCard(File &file, char* timeStamp, int32_t latitudes, int32_t longitudes) {
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
            file.println(buffer);
            }
            // reset num_measurements
            num_measurements = 0;
        }
    `;
    Blockly.Generator.Arduino.functionNames_["saveValues"] = `
    void saveValues(File &file) {
          // send measurements
          writeMeasurementsToSdCard(file, ${timestamp}, ${lat}, ${lng});
          num_measurements = 0;
    }
    `;
    code = "";
    code += branch;
    code += `saveValues(${file.handle});\n`;
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
 * senseBox-sd_exists Block
 */

Blockly.Generator.Arduino.forBlock["sensebox_sd_exists"] = function (
  block,
  generator,
) {
  const file = sdFileReference(block, generator);
  return [file ? `SD.exists(${file.path})` : "false", generator.ORDER_ATOMIC];
};
