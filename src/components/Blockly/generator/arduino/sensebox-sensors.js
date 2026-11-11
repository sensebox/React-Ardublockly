import * as Blockly from "blockly";
import { selectedBoard } from "@/components/Blockly/helpers/board";

/**
 * HDC1080 Temperature and Humidity Sensor
 *
 */

Blockly.Generator.Arduino.forBlock["sensebox_sensor_temp_hum"] = function () {
  var dropdown_name = this.getFieldValue("NAME");

  Blockly.Generator.Arduino.libraries_["library_adafruithdc1000"] =
    "#include <Adafruit_HDC1000.h> // http://librarymanager/All#Adafruit_HDC1000_Library";
  Blockly.Generator.Arduino.definitions_["define_hdc"] =
    "Adafruit_HDC1000 hdc = Adafruit_HDC1000();";
  Blockly.Generator.Arduino.setupCode_["sensebox_sensor_temp_hum"] =
    "hdc.begin();";
  var code = `hdc.read${dropdown_name}()`;
  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};

/**
 * VEML 6070 and TSL4513 UV-Light/Illuminance Sensor
 *
 */

Blockly.Generator.Arduino.forBlock["sensebox_sensor_uv_light"] = function () {
  var dropdown_name = this.getFieldValue("NAME");
  let code = "";
  if (dropdown_name === "UvIntensity") {
    Blockly.Generator.Arduino.libraries_["library_veml6070"] =
      "#include <VEML6070.h>";
    Blockly.Generator.Arduino.definitions_["define_veml"] = "VEML6070 veml;";
    Blockly.Generator.Arduino.setupCode_["sensebox_sensor_uv_light"] =
      "veml.begin();";
    code = "veml.getUV()";
  }
  if (dropdown_name === "Illuminance") {
    Blockly.Generator.Arduino.libraries_["library_ltr329"] =
      `#include <LTR329.h>`;
    Blockly.Generator.Arduino.libraries_["library_wire"] = "#include <Wire.h>";
    Blockly.Generator.Arduino.codeFunctions_["read_reg"] = `
int read_reg(byte address, uint8_t reg)
  {
    int i = 0;
    Wire.beginTransmission(address);
    Wire.write(reg);
    Wire.endTransmission();
    Wire.requestFrom((uint8_t)address, (uint8_t)1);
    delay(1);
    if(Wire.available())
      i = Wire.read();
    return i;
  }
    `;
    Blockly.Generator.Arduino.codeFunctions_["write_reg"] = `
void write_reg(byte address, uint8_t reg, uint8_t val)
  {
    Wire.beginTransmission(address);
    Wire.write(reg);
    Wire.write(val);
    Wire.endTransmission();
  }`;
    Blockly.Generator.Arduino.preSetupCode_["Wire.begin"] = "Wire.begin();";
    Blockly.Generator.Arduino.codeFunctions_["Lightsensor_begin"] = `
void Lightsensor_begin()
  {
    unsigned int u = 0;
    u = read_reg(0x29, 0x80 | 0x0A); //id register
    if ((u & 0xF0) == 0xA0)            // TSL45315
      {
        write_reg(0x29, 0x80 | 0x00, 0x03); //control: power on
        write_reg(0x29, 0x80 | 0x01, 0x02); //config: M=4 T=100ms
        delay(120);
        lightsensortype = 0; //TSL45315
      }
    else
      {
        LTR.begin();
        LTR.setControl(gain, false, false);
        LTR.setMeasurementRate(integrationTime, measurementRate);
        LTR.setPowerUp(); //power on with default settings
        delay(10); //Wait 10 ms (max) - wakeup time from standby
        lightsensortype = 1;                     //
      }
  }
`;

    Blockly.Generator.Arduino.codeFunctions_["Lightsensor_getIlluminance"] = `
  uint32_t Lightsensor_getIlluminance()
  {
    unsigned int lux = 0;
    if (lightsensortype == 0) // TSL45315
    {
      unsigned int u = (read_reg(0x29, 0x80 | 0x04) << 0);  //data low
      u |= (read_reg(0x29, 0x80 | 0x05) << 8); //data high
      lux = u * 4; // calc lux with M=4 and T=100ms
    }
    else if (lightsensortype == 1) //LTR-329ALS-01
    {
      delay(100);
      unsigned int data0, data1;
      for (int i = 0; i < 5; i++) {
        if (LTR.getData(data0, data1)) {
          if(LTR.getLux(gain, integrationTime, data0, data1, lux));
          if(lux > 0) break;
          else delay(10);
        }
        else {
        byte error = LTR.getError();
      }
    }
  }
  return lux;
  }
    `;
    Blockly.Generator.Arduino.definitions_["define_lightsensor"] = `
bool lightsensortype = 0; //0 for tsl - 1 for ltr
//settings for LTR sensor
LTR329 LTR;
unsigned char gain = 1;
unsigned char integrationTime = 0;
unsigned char measurementRate = 3;
`;
    Blockly.Generator.Arduino.setupCode_["sensebox_sensor_illuminance"] =
      "Lightsensor_begin();";
    code = "Lightsensor_getIlluminance()";
  }

  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};

/**
 * BMX055 Accelerometer
 *
 */

Blockly.Generator.Arduino.forBlock["sensebox_sensor_bmx055_accelerometer"] =
  function () {
    var dropdown_value = this.getFieldValue("VALUE");
    var range = this.getFieldValue("RANGE");
    Blockly.Generator.Arduino.libraries_["library_bmx055"] =
      `#include <BMX055.h>`;
    Blockly.Generator.Arduino.definitions_["define_bmx"] = "BMX055 bmx;";
    Blockly.Generator.Arduino.setupCode_["sensebox_sensor_bmx055"] =
      "bmx.beginAcc(" + range + ");";
    var code = "bmx.getAcceleration" + dropdown_value + "()";
    return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
  };

/**
 * SDS011 Fine Particlar Matter
 *
 */

Blockly.Generator.Arduino.forBlock["sensebox_sensor_sds011"] = function () {
  var dropdown_name = this.getFieldValue("NAME");
  var serial_name = this.getFieldValue("SERIAL");
  Blockly.Generator.Arduino.libraries_["SdsDustSensor"] =
    `#include <SdsDustSensor.h> // http://librarymanager/All#Nova_Fitness_Sds_dust_sensors_library`;
  Blockly.Generator.Arduino.definitions_["define_sds011"] =
    "SdsDustSensor sds(" + serial_name + ");";
  Blockly.Generator.Arduino.functionNames_["sds011_getPmData()"] = `
float getPmData(int type) {
  PmResult pm = sds.queryPm();
  if (pm.isOk()) {
    if (type == 25){
      return pm.pm25;
    } else if (type == 10) {
      return pm.pm10;
    }
  else return 0;
  }
}
`;
  Blockly.Generator.Arduino.setupCode_["sds011_begin"] = "sds.begin();";
  Blockly.Generator.Arduino.setupCode_["sds011_setQueryReportingMode"] =
    "sds.setQueryReportingMode();";
  // Blockly.Generator.Arduino.loopCodeOnce_[
  //   "sds011_getData"
  // ] = `PmResult pm = sds.queryPm();`;
  var code = `getPmData(${dropdown_name})`;
  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};

/**
 * BMP280 Pressure Sensor
 *
 */

Blockly.Generator.Arduino.forBlock["sensebox_sensor_pressure"] = function () {
  var dropdown_name = this.getFieldValue("NAME");
  var code = "";
  var referencePressure = this.getFieldValue("referencePressure");
  Blockly.Generator.Arduino.libraries_["adafruit_bmp280"] =
    `#include <Adafruit_BMP280.h> // http://librarymanager/All#Adafruit_BMP280_Library`;
  Blockly.Generator.Arduino.definitions_["define_pressure"] =
    "Adafruit_BMP280 bmp;";
  Blockly.Generator.Arduino.setupCode_["sensebox_bmp_sensor"] =
    "bmp.begin(0x76);";
  Blockly.Generator.Arduino.setupCode_["bmp_setSampling"] = `
bmp.setSampling(Adafruit_BMP280::MODE_NORMAL,    
                  Adafruit_BMP280::SAMPLING_X2,  
                  Adafruit_BMP280::SAMPLING_X16,  
                  Adafruit_BMP280::FILTER_X16,      
                  Adafruit_BMP280::STANDBY_MS_500);
  `;
  switch (dropdown_name) {
    case "Temperature":
      code = "bmp.readTemperature()";
      break;
    case "Pressure":
      code = "bmp.readPressure()/100";
      break;
    case "Altitude":
      code = "bmp.readAltitude(" + referencePressure + ")";
      break;
    default:
      code = "";
  }
  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};

/**
 * BME680 Environmental Sensor
 *
 */

Blockly.Generator.Arduino.forBlock["sensebox_sensor_bme680_bsec"] =
  function () {
    var dropdown_name = this.getFieldValue("dropdown");
    let code = "";
    Blockly.Generator.Arduino.libraries_["library_bsec2"] =
      "#include <bsec2.h> // http://librarymanager/All#BSEC_Software_Library";
    Blockly.Generator.Arduino.definitions_["bsec2_bme680"] = "Bsec2 bme680;";
    Blockly.Generator.Arduino.variables_["bmeTemperatur"] =
      "float bmeTemperatur;";
    Blockly.Generator.Arduino.variables_["bmeHumidity"] = "float bmeHumidity;";
    Blockly.Generator.Arduino.variables_["bmePressure"] = "double bmePressure;";
    Blockly.Generator.Arduino.variables_["bmeIAQ"] = "float bmeIAQ;";
    Blockly.Generator.Arduino.variables_["bmeIAQAccuracy"] =
      "float bmeIAQAccuracy;";
    Blockly.Generator.Arduino.variables_["bmeCO2"] = "int bmeCO2;";
    Blockly.Generator.Arduino.variables_["bmeBreathVocEquivalent"] =
      "float bmeBreathVocEquivalent;";

    Blockly.Generator.Arduino.functionNames_["BME680begin"] = `
bool BME680begin() {
  bme680.begin(BME68X_I2C_ADDR_LOW, Wire);
  if (bme680.status != BSEC_OK || bme680.sensor.status != BME68X_OK) {
    return false;
  }

  bsecSensor sensorList[14] = {
    BSEC_OUTPUT_IAQ,
    BSEC_OUTPUT_RAW_TEMPERATURE,
    BSEC_OUTPUT_RAW_PRESSURE,
    BSEC_OUTPUT_RAW_HUMIDITY,
    BSEC_OUTPUT_RAW_GAS,
    BSEC_OUTPUT_STABILIZATION_STATUS,
    BSEC_OUTPUT_RUN_IN_STATUS,
    BSEC_OUTPUT_SENSOR_HEAT_COMPENSATED_TEMPERATURE,
    BSEC_OUTPUT_SENSOR_HEAT_COMPENSATED_HUMIDITY,
    BSEC_OUTPUT_STATIC_IAQ,
    BSEC_OUTPUT_CO2_EQUIVALENT,
    BSEC_OUTPUT_BREATH_VOC_EQUIVALENT,
    BSEC_OUTPUT_GAS_PERCENTAGE,
    BSEC_OUTPUT_COMPENSATED_GAS
  };

  bme680.updateSubscription(sensorList, ARRAY_LEN(sensorList), 1); // 1Hz
  if (bme680.status != BSEC_OK || bme680.sensor.status != BME68X_OK) {
    return false;
  }
  return true;
}

    `;
    //Setup Code
    Blockly.Generator.Arduino.preSetupCode_["Wire.begin"] = "Wire.begin();";
    Blockly.Generator.Arduino.setupCode_["bme680.begin"] = "BME680begin();";
    //Loop Code
    Blockly.Generator.Arduino.loopCodeOnce_["bme680loop"] = `
    if (bme680.run()) {
      bmeTemperatur = bme680.getData(BSEC_OUTPUT_SENSOR_HEAT_COMPENSATED_TEMPERATURE).signal;
      bmeHumidity = bme680.getData(BSEC_OUTPUT_SENSOR_HEAT_COMPENSATED_HUMIDITY).signal;
      bmePressure = bme680.getData(BSEC_OUTPUT_RAW_PRESSURE).signal;
      bmeIAQ = bme680.getData(BSEC_OUTPUT_IAQ).signal;
      bmeIAQAccuracy = bme680.getData(BSEC_OUTPUT_STATIC_IAQ).signal;
      bmeCO2 = bme680.getData(BSEC_OUTPUT_CO2_EQUIVALENT).signal;
      bmeBreathVocEquivalent = bme680.getData(BSEC_OUTPUT_BREATH_VOC_EQUIVALENT).signal;
    }
    `;
    switch (dropdown_name) {
      case "temperature":
        code = "bmeTemperatur";
        break;
      case "humidity":
        code = "bmeHumidity";
        break;
      case "pressure":
        code = "bmePressure";
        break;
      case "IAQ":
        code = "bmeIAQ";
        break;
      case "IAQAccuracy":
        code = "bmeIAQAccuracy";
        break;
      case "CO2":
        code = "bmeCO2";
        break;
      case "breathVocEquivalent":
        code = "bmeBreathVocEquivalent";
        break;
      default:
        break;
    }
    return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
  };

/**
 * Ultrasonic Distance Sensor
 *
 */

Blockly.Generator.Arduino.forBlock["sensebox_sensor_ultrasonic_ranger"] =
  function () {
    var dropdown_pin_RX = this.getFieldValue("ultrasonic_trigger");
    var dropdown_pin_TX = this.getFieldValue("ultrasonic_echo");
    var port = this.getFieldValue("port");
    var maxDistance = this.getFieldValue("maxDistance");
    Blockly.Generator.Arduino.libraries_["library_newPing"] =
      `#include <NewPing.h> // http://librarymanager/All#NewPing`;
    Blockly.Generator.Arduino.variables_["define_newPingVariables" + port] = `
#define TRIGGER_PIN_${port} ${dropdown_pin_RX}
#define ECHO_PIN_${port} ${dropdown_pin_TX}
#define MAX_DISTANCE_${port} ${maxDistance}
  `;
    Blockly.Generator.Arduino.definitions_["define_newPing" + port] =
      `NewPing sonar${port}(TRIGGER_PIN_${port}, ECHO_PIN_${port}, MAX_DISTANCE_${port});`;
    var code;
    code = `sonar${port}.ping_cm()`;
    return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
  };

/**
 *
 * ToF Imager
 */

Blockly.Generator.Arduino.forBlock["sensebox_tof_imager"] = function () {
  var dropdown_name = this.getFieldValue("dropdown");
  var maxDistance = this.getFieldValue("maxDistance");
  Blockly.Generator.Arduino.libraries_["library_wire"] = "#include <Wire.h>";
  Blockly.Generator.Arduino.libraries_[`library_vl53l8cx`] =
    `#include <vl53l8cx.h> `;
  Blockly.Generator.Arduino.variables_["define:_vl53l8cx"] = `
    VL53L8CX sensor_vl53l8cx(&Wire, -1, -1);  
    `;

  Blockly.Generator.Arduino.preSetupCode_["Wire.begin"] = "Wire.begin();";
  Blockly.Generator.Arduino.preSetupCode_["vl53l8cx_clock_address"] =
    `sensor_vl53l8cx.set_i2c_address(0x51); // need to change address, because default address is shared with other sensor`;

  Blockly.Generator.Arduino.setupCode_["setup_vl53l8cx"] = `
  Wire.setClock(1000000); // vl53l8cx can operate at 1MHz
  sensor_vl53l8cx.begin(0x51);
  sensor_vl53l8cx.init();
  sensor_vl53l8cx.set_ranging_frequency_hz(30);
  sensor_vl53l8cx.set_resolution(VL53L8CX_RESOLUTION_8X8);
  sensor_vl53l8cx.start_ranging();
  Wire.setClock(100000); // lower the I2C clock to 0.1MHz again for compatibility with other sensors
  `;
  var code = "";
  switch (dropdown_name) {
    case "DistanzCM":
      Blockly.Generator.Arduino.codeFunctions_["define_tof_range"] = `
    float oldVl53l8cxMin = -1.0;
    float getVl53l8cxMin() {
      VL53L8CX_ResultsData Results;
      uint8_t NewDataReady = 0;
      uint8_t status;

      Wire.setClock(1000000); // vl53l8cx can operate at 1MHz
      status = sensor_vl53l8cx.check_data_ready(&NewDataReady);

      if ((!status) && (NewDataReady != 0)) {
        sensor_vl53l8cx.get_ranging_data(&Results);
        Wire.setClock(100000); // lower the I2C clock to 0.1MHz again for compatibility with other sensors
        float minStatus5 = 10000.0;
        float minStatus69 = 10000.0;
        for(int i = 0; i < VL53L8CX_RESOLUTION_8X8*VL53L8CX_NB_TARGET_PER_ZONE; i++) {
          float distance = ((&Results)->distance_mm[i])/10;
          float target_status = (&Results)->target_status[i];
          if(target_status == 5 && minStatus5 > distance) {
            minStatus5 = distance;
          } else if((target_status == 6 || target_status == 9) && minStatus69 > distance) {
            minStatus69 = distance;
          }
        }
        if (minStatus5 < 10000.0 && minStatus5 >=0) {
          oldVl53l8cxMin = minStatus5;
        } else if (minStatus69 < 10000.0 && minStatus69 >=0) {
          oldVl53l8cxMin = minStatus69;
        } else {
          oldVl53l8cxMin = 0.0;
        }
      }
      return oldVl53l8cxMin;
      }`;
      code += "getVl53l8cxMin()";
      break;
    case "DistanzBM":
      Blockly.Generator.Arduino.codeFunctions_["define_tof_bitmap"] = `
      uint16_t oldVl53l8cxBitmap[96] =
      {
        0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000,
        0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000,
        0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000,
        0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000,
        0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000,
        0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000,
      };
      uint16_t* getVl53l8cxBitmap() {
        VL53L8CX_ResultsData Result;
        uint8_t NewDataReady = 0;
        uint8_t status;
      
        Wire.setClock(1000000); // vl53l8cx can operate at 1MHz
        status = sensor_vl53l8cx.check_data_ready(&NewDataReady);
      
        if ((!status) && (NewDataReady != 0)) {
          sensor_vl53l8cx.get_ranging_data(&Result);
          Wire.setClock(100000); // lower the I2C clock to 0.1MHz again for compatibility with other sensors
          int8_t i, j, k;
          uint8_t zones_per_line;
          uint8_t number_of_zones = VL53L8CX_RESOLUTION_8X8;
      
          zones_per_line = (number_of_zones == 16) ? 4 : 8;
      
          for (j = 0; j < number_of_zones; j += zones_per_line)
          {
            for (k = (zones_per_line - 1); k >= 0; k--)
            {
              float target_status = (&Result)->target_status[(VL53L8CX_NB_TARGET_PER_ZONE * (j+k))];
              if(target_status != 5 && target_status != 6 && target_status != 9) {
                oldVl53l8cxBitmap[j + k + 2 + ((j+1)/2)] = (((0 >> 3) & 0x1F)<<11 | (((0 >> 2) & 0x3F) << 5) | ((0 >> 3) & 0x1F));
              } else {
                long distance = (long)(&Result)->distance_mm[(VL53L8CX_NB_TARGET_PER_ZONE * (j+k))];
                int maxDist = distance;
                if (maxDist > ${maxDistance} * 10) {
                  maxDist = ${maxDistance} * 10;
                }
                int colVal = map(maxDist,0,${maxDistance} * 10,10,310);
                oldVl53l8cxBitmap[j + k + 2 + ((j+1)/2)] = setLedColorHSV(colVal,1,1,(j+1)/8, k);
              }
            }
          }
        }
        return oldVl53l8cxBitmap;
      }
      
      uint16_t setLedColorHSV(int h, double s, double v, int x, int y) {
        //this is the algorithm to convert from RGB to HSV
        double r=0; 
        double g=0; 
        double b=0;
      
        double hf=h/60.0;
      
        int i=(int)floor(h/60.0);
        double f = h/60.0 - i;
        double pv = v * (1 - s);
        double qv = v * (1 - s*f);
        double tv = v * (1 - s * (1 - f));
      
        switch (i)
        {
        case 0: //rojo dominante
          r = v;
          g = tv;
          b = pv;
          break;
        case 1: //verde
          r = qv;
          g = v;
          b = pv;
          break;
        case 2: 
          r = pv;
          g = v;
          b = tv;
          break;
        case 3: //azul
          r = pv;
          g = qv;
          b = v;
          break;
        case 4:
          r = tv;
          g = pv;
          b = v;
          break;
        case 5: //rojo
          r = v;
          g = pv;
          b = qv;
          break;
        }
      
        //set each component to a integer value between 0 and 255
        uint16_t red=constrain((int)255*r,0,255);
        uint16_t green=constrain((int)255*g,0,255);
        uint16_t blue=constrain((int)255*b,0,255);
        return (((red >> 3) & 0x1F)<<11 | (((green >> 2) & 0x3F) << 5) | ((blue >> 3) & 0x1F));
      }`;
      code += "getVl53l8cxBitmap()";
      break;
    default:
      break;
  }
  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};

/**
 * Microphone
 *
 */

Blockly.Generator.Arduino.forBlock["sensebox_sensor_sound"] = function () {
  var dropdown_pin = this.getFieldValue("PIN");
  Blockly.Generator.Arduino.codeFunctions_["define_sound"] = `
float getSoundValue(int pin) {
    unsigned long start = millis(); // Start des Messintervalls
    unsigned int peakToPeak = 0;	// Abstand von maximalem zu minimalem Amplitudenausschlag
    unsigned int signalMax = 0;
    unsigned int signalMin = 1023;
    const int sampleTime = 100;
    unsigned int micValue;
  
    // Sammle Daten für 100 Millisekunden
    while (millis() - start < sampleTime)
    {
      micValue = analogRead(pin); // Messe den aktuellen Wert
      if (micValue < 1023)		 // sortiere Fehlmessungen aus, deren Werte über dem max Wert 1024 liegen
      {
        if (micValue > signalMax)
        {
          signalMax = micValue; // speichere den maximal gemessenen Wert
        }
        else if (micValue < signalMin)
        {
          signalMin = micValue; // speichere den minimal gemessenen Wert
        }
      }
    }
    peakToPeak = signalMax - signalMin;		  // max - min = Abstand von maximalem zu minimalem Amplitudenausschlag
    double volts = (peakToPeak * 5.0) / 1023; // wandle in Volt um
    return volts;
}`;
  var code = "getSoundValue(" + dropdown_pin + ")";
  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};

/**
 * Button
 *
 */

Blockly.Generator.Arduino.forBlock["sensebox_button"] = function () {
  var dropdown_pin = this.getFieldValue("PIN");
  var dropown_function = this.getFieldValue("FUNCTION");
  Blockly.Generator.Arduino.libraries_["library_jcButtons"] =
    `#include <JC_Button.h> // http://librarymanager/All#JC_Button`;

  Blockly.Generator.Arduino.definitions_["define_button" + dropdown_pin + ""] =
    "Button button_" + dropdown_pin + "(" + dropdown_pin + ");";
  Blockly.Generator.Arduino.setupCode_["setup_button" + dropdown_pin + ""] =
    "button_" + dropdown_pin + ".begin();";
  Blockly.Generator.Arduino.loopCodeOnce_["loop_button" + dropdown_pin + ""] =
    "button_" + dropdown_pin + ".read();";
  var code = "";
  if (dropown_function === "isPressed") {
    code = "button_" + dropdown_pin + ".isPressed()";
  } else if (dropown_function === "wasPressed") {
    code = "button_" + dropdown_pin + ".wasPressed()";
  } else if (dropown_function === "longPress") {
    var time = this.getFieldValue("time");
    code = "button_" + dropdown_pin + ".pressedFor(" + time + ")";
  } else if (dropown_function === "toggleButton") {
    code = "button_" + dropdown_pin + ".toggleState()";
    Blockly.Generator.Arduino.definitions_[
      "define_button" + dropdown_pin + ""
    ] = "ToggleButton button_" + dropdown_pin + "(" + dropdown_pin + ");";
  }
  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};

/**
 * SCD30 CO2 Sensor
 *
 */

Blockly.Generator.Arduino.forBlock["sensebox_scd30"] = function () {
  var dropdown = this.getFieldValue("dropdown");
  Blockly.Generator.Arduino.libraries_["scd30_library"] =
    "#include <SparkFun_SCD30_Arduino_Library.h> // http://librarymanager/All#SparkFun_SCD30_Arduino_Library";
  Blockly.Generator.Arduino.definitions_["SCD30"] = "SCD30 airSensor;";
  Blockly.Generator.Arduino.preSetupCode_["Wire.begin"] = "Wire.begin();";
  Blockly.Generator.Arduino.setupCode_["init_scd30"] = ` 
if (airSensor.begin() == false)
{
  while (1)
    ;
}`;
  Blockly.Generator.Arduino.setupCode_["scd30_staleData"] =
    "airSensor.useStaleData(true);";
  var code = "";
  switch (dropdown) {
    case "temperature":
      code = "airSensor.getTemperature()";
      break;
    case "humidity":
      code = "airSensor.getHumidity()";
      break;
    case "CO2":
      code = "airSensor.getCO2()";
      break;
    default:
      code = "";
  }
  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};

/**
 * GPS Module
 *
 */

Blockly.Generator.Arduino.forBlock["sensebox_gps"] = function () {
  var dropdown = this.getFieldValue("dropdown");
  Blockly.Generator.Arduino.libraries_["gps_library"] =
    "#include <SparkFun_u-blox_GNSS_Arduino_Library.h> // http://librarymanager/All#SparkFun_u-blox_GNSS_Arduino_Library";
  Blockly.Generator.Arduino.libraries_["library_wire"] = "#include <Wire.h>";
  Blockly.Generator.Arduino.definitions_["GPS"] = "SFE_UBLOX_GNSS myGNSS;";
  Blockly.Generator.Arduino.preSetupCode_["Wire.begin"] = "Wire.begin();";
  Blockly.Generator.Arduino.setupCode_["init_gps"] = `

  if (myGNSS.begin() == false) //Connect to the Ublox module using Wire port
  {
    Serial.println(F("Ublox GPS not detected at default I2C address. Please check wiring. Freezing."));
    while (1);
  }

  myGNSS.setI2COutput(COM_TYPE_UBX); //Set the I2C port to output UBX only (turn off NMEA noise)
  myGNSS.saveConfiguration(); //Save the current settings to flash and BBR`;
  var code = "";
  switch (dropdown) {
    case "latitude":
      code = "myGNSS.getLatitude()";
      break;
    case "longitude":
      code = "myGNSS.getLongitude()";
      break;
    case "altitude":
      code = "myGNSS.getAltitudeMSL()";
      break;
    case "pDOP":
      code = "myGNSS.getPDOP()";
      break;
    case "fixType":
      code = "myGNSS.getFixType()";
      break;
    case "timestamp":
      Blockly.Generator.Arduino.variables_["timestampVars"] = `
char tsBuffer[21];
      `;
      Blockly.Generator.Arduino.codeFunctions_["getTimeStamp()"] = `
char* getTimeStamp()
{
  if (myGNSS.getTimeValid() == true)
    {
    sprintf(tsBuffer, "%04d-%02d-%02dT%02d:%02d:%02dZ",
    myGNSS.getYear(), myGNSS.getMonth(), myGNSS.getDay(), myGNSS.getHour(), myGNSS.getMinute(), myGNSS.getSecond());
    }
return tsBuffer;
}
      `;
      code = "getTimeStamp()";
      break;
    case "speed":
      code = "myGNSS.getGroundSpeed()";
      break;
    default:
      code = "";
  }
  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};

/**
 * Block for Truebner STM50
 */

Blockly.Generator.Arduino.forBlock["sensebox_sensor_truebner_smt50"] =
  function () {
    var dropdown_port = this.getFieldValue("Port");
    var dropdown_value = this.getFieldValue("value");
    var dropdown_pin = 1;
    var code = "";
    if (dropdown_value === "temp") {
      switch (dropdown_port) {
        case "IO3_2":
          dropdown_pin = 3;
          break;
        case "IO3_4":
          dropdown_pin = 3;
          break;
        case "IO5_4":
          dropdown_pin = 5;
          break;
        case "IO5_6":
          dropdown_pin = 5;
          break;
        case "IO7_6":
          dropdown_pin = 7;
          break;
        default: // "IO1_2"
          dropdown_pin = 1;
      }
      Blockly.Generator.Arduino.codeFunctions_["sensebox_smt50_temp"] =
        "float getSMT50Temperature(int analogPin){\n  int sensorValue = analogRead(analogPin);\n  float voltage = sensorValue * (3.3 / 1024.0);\n   return (voltage - 0.5) * 100;\n}";
      code = "getSMT50Temperature(" + dropdown_pin + ")";
      return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
    } else if (dropdown_value === "soil") {
      switch (dropdown_port) {
        case "IO3_2":
          dropdown_pin = 2;
          break;
        case "IO3_4":
          dropdown_pin = 4;
          break;
        case "IO5_4":
          dropdown_pin = 4;
          break;
        case "IO5_6":
          dropdown_pin = 6;
          break;
        case "IO7_6":
          dropdown_pin = 6;
          break;
        default: // "IO1_2"
          dropdown_pin = 2;
      }
      Blockly.Generator.Arduino.codeFunctions_["sensebox_smt50_soil"] =
        "float getSMT50Moisture(int analogPin){\n   int sensorValue = analogRead(analogPin);\n    float voltage = sensorValue * (3.3 / 1024.0);\n   return (voltage * 50) / 3;\n}";
      code = "getSMT50Moisture(" + dropdown_pin + ")";
      return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
    }
  };

/**
 * DS18B20 Watertemperature
 *
 */

Blockly.Generator.Arduino.forBlock["sensebox_sensor_watertemperature"] =
  function () {
    var dropdown_port = this.getFieldValue("Port");
    var dropdown_pin = 1;
    switch (dropdown_port) {
      case "IO3_2":
        dropdown_pin = 3;
        break;
      case "IO3_4":
        dropdown_pin = 3;
        break;
      case "IO5_4":
        dropdown_pin = 5;
        break;
      case "IO5_6":
        dropdown_pin = 5;
        break;
      case "IO7_6":
        dropdown_pin = 7;
        break;
      default: // "IO1_2"
        dropdown_pin = 1;
    }
    var dropdown_index = this.getFieldValue("Index");
    Blockly.Generator.Arduino.libraries_["library_oneWire"] =
      "#include <OneWire.h> // http://librarymanager/All#OneWire";
    Blockly.Generator.Arduino.libraries_["library_oneDallasTemperature"] =
      "#include <DallasTemperature.h> // http://librarymanager/All#DallasTemperature";
    Blockly.Generator.Arduino.definitions_["define_OneWire"] =
      "#define ONE_WIRE_BUS " +
      dropdown_pin +
      "\nOneWire oneWire(ONE_WIRE_BUS);\nDallasTemperature sensors(&oneWire);";
    Blockly.Generator.Arduino.setupCode_["sensebox_oneWireSetup"] =
      "sensors.begin();";
    Blockly.Generator.Arduino.codeFunctions_["sensebox_requestTemp"] =
      "float getWaterTemp(int index){\nsensors.requestTemperatures();\nreturn sensors.getTempCByIndex(index);\n}";
    var code = "getWaterTemp(" + dropdown_index + ")";
    return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
  };

/**
 * Windspeed
 * remove for now



Blockly.Generator.Arduino.forBlock["sensebox_windspeed"] = function() {
  var dropdown_pin = this.getFieldValue('PIN');
  Blockly.Generator.Arduino.codeFunctions_['windspeed'] = `    
float getWindspeed(){
  float voltageWind = analogRead(`+ dropdown_pin + `) * (3.3 / 1024.0);
  float windspeed = 0.0;
  if (voltageWind >= 0.018){
    float poly1 = pow(voltageWind, 3);
    poly1 = 17.0359801998299 * poly1;
    float poly2 = pow(voltageWind, 2);
    poly2 = 47.9908168343362 * poly2;
    float poly3 = 122.899677524413 * voltageWind;
    float poly4 = 0.657504127272728;
    windspeed = poly1 - poly2 + poly3 - poly4;
    windspeed = windspeed * 0.2777777777777778; //conversion in m/s
  }
    return windspeed;
}`
  var code = 'getWindspeed()';
  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};
 */

/**
 * DF Robot Soundsensor
 */

/**
 *
 *
 */

Blockly.Generator.Arduino.forBlock["sensebox_soundsensor_dfrobot"] =
  function () {
    var dropdown_port = this.getFieldValue("Port");
    var dropdown_pin = 1;
    switch (dropdown_port) {
      case "IO3_2":
        dropdown_pin = 3;
        break;
      case "IO3_4":
        dropdown_pin = 3;
        break;
      case "IO5_4":
        dropdown_pin = 5;
        break;
      case "IO5_6":
        dropdown_pin = 5;
        break;
      case "IO7_6":
        dropdown_pin = 7;
        break;
      default: // "IO1_2"
        dropdown_pin = 1;
    }

    var board = selectedBoard().title;
    if (board === "MCU" || board === "Mini") {
      Blockly.Generator.Arduino.codeFunctions_["soundsensor"] = `    
    int getSoundValue(int sensorPin) {
    float v = analogRead(sensorPin) * (3.3 / 1024.0);
    float decibel;
    if (v <= 0.6) decibel = 0.0;
    if (v >= 2.6) decibel = 130.0;
    else decibel = v * 50.0;
    return int(decibel);
  }`;
    } else {
      Blockly.Generator.Arduino.setupCode_["soundsensorbegin"] =
        `analogReadResolution(13);`;
      Blockly.Generator.Arduino.codeFunctions_["soundsensor"] = `    
    int getSoundValue(int sensorPin) {
      float v = analogReadMilliVolts(sensorPin) / 1000.0;
      float decibel;
      if (v <= 0.6) decibel = 0.0;
      if (v >= 2.6) decibel = 130.0;
      else decibel = v * 50.0;
      return int(decibel);
    }`;
    }

    var code = "getSoundValue(" + dropdown_pin + ")";

    return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
  };

/**
 * rg15 rainsensor
 */

Blockly.Generator.Arduino.forBlock["sensebox_rg15_rainsensor"] = function () {
  var port = this.getFieldValue("SERIAL");
  var value = this.getFieldValue("VALUE");
  Blockly.Generator.Arduino.libraries_["library_rg15"] = "#include <RG15.h>";
  Blockly.Generator.Arduino.definitions_["def_rg15_rainsensor_" + port] =
    "RG15 rg15_" + port + "(" + port + ");";
  Blockly.Generator.Arduino.setupCode_["setup_rg15_rainsensor_" + port] = `
    rg15_${port}.begin();
    rg15_${port}.resetAccumulation();`;
  Blockly.Generator.Arduino.loopCodeOnce_["loop_rg15_rainsensor_" + port] =
    "rg15_" + port + ".poll();";

  var code = "rg15_" + port + "." + value + "()";
  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};

/**
 * Infineon DPS310 Pressure Sensor
 *
 */

Blockly.Generator.Arduino.forBlock["sensebox_sensor_dps310"] = function () {
  var dropdown_name = this.getFieldValue("NAME");
  var code = "";
  var referencePressure = this.getFieldValue("referencePressure");
  Blockly.Generator.Arduino.libraries_["adafruit_dps310"] =
    `#include <Adafruit_DPS310.h> // http://librarymanager/All#Adafruit_DPS310`;
  Blockly.Generator.Arduino.definitions_["define_dps"] = "Adafruit_DPS310 dps;";
  Blockly.Generator.Arduino.setupCode_["dps_begin"] = "dps.begin_I2C(0x76);";
  Blockly.Generator.Arduino.setupCode_["dps_configuration"] = `
  dps.configurePressure(DPS310_64HZ, DPS310_64SAMPLES);
  dps.configureTemperature(DPS310_64HZ, DPS310_64SAMPLES);
  `;
  Blockly.Generator.Arduino.definitions_["dps_events"] =
    "sensors_event_t temp_event, pressure_event;";
  Blockly.Generator.Arduino.loopCodeOnce_["dps_getEvents"] =
    "dps.getEvents(&temp_event, &pressure_event);";
  switch (dropdown_name) {
    case "Temperature":
      code = "temp_event.temperature";
      break;
    case "Pressure":
      code = "pressure_event.pressure";
      break;
    case "Altitude":
      code = "dps.readAltitude(" + referencePressure + ")";
      break;
    default:
      code = "";
  }
  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};

/**
 * Sensirion SPS30 Fine Particlar Matter
 *
 */

Blockly.Generator.Arduino.forBlock["sensebox_sensor_sps30"] = function () {
  var dropdown_name = this.getFieldValue("value");
  Blockly.Generator.Arduino.libraries_["sps30"] =
    `#include <sps30.h> // http://librarymanager/All#`;
  Blockly.Generator.Arduino.variables_["sps30_measurement"] =
    "struct sps30_measurement m;";
  Blockly.Generator.Arduino.variables_["sps30_auto_clean_days"] =
    "uint32_t auto_clean_days = 4;";
  Blockly.Generator.Arduino.variables_["sps30_interval_intervalsps"] =
    "const long intervalsps = 1000;";
  Blockly.Generator.Arduino.variables_["sps30_time_startsps"] =
    "unsigned long time_startsps = 0;";
  Blockly.Generator.Arduino.variables_["sps30_time_actualsps"] =
    "unsigned long time_actualsps = 0;";
  Blockly.Generator.Arduino.codeFunctions_["sps30_getData"] = `
void getSPS30Data(){

uint16_t data_ready;
int16_t ret;
      
do {
    ret = sps30_read_data_ready(&data_ready);
    if (ret < 0) { 
    } else if (!data_ready)  {}
    else
        break;
        delay(100); /* retry in 100ms */
    } while (1);
    ret = sps30_read_measurement(&m); 
}
  `;

  Blockly.Generator.Arduino.setupCode_["sps30_begin"] = "sensirion_i2c_init();";
  Blockly.Generator.Arduino.setupCode_["sps30_setFanCleaningInterval"] =
    "sps30_set_fan_auto_cleaning_interval_days(auto_clean_days);";
  Blockly.Generator.Arduino.setupCode_["sps30_startMeasurement"] =
    "sps30_start_measurement();";
  Blockly.Generator.Arduino.loopCodeOnce_["getSPS30Data();"] = `
time_startsps = millis();
if (time_startsps > time_actualsps + intervalsps) {
  time_actualsps = millis();
  getSPS30Data();
}`;
  var code = `m.mc_${dropdown_name}`;
  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};

/**
 * senseBox MCU-S2 onboard Light Sensor
 *
 */

Blockly.Generator.Arduino.forBlock["sensebox_esp32s2_light"] = function () {
  var code = "analogRead(PD_SENSE)";
  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};

/**
 * senseBox MCU-S2 onboard accelerometer
 *
 **/

Blockly.Generator.Arduino.forBlock["sensebox_esp32s2_accelerometer"] =
  function () {
    var code = "";
    var dropdown = this.getFieldValue("value");
    const wire = selectedBoard().title === "MCU-Eye" ? "Wire" : "Wire1";
    Blockly.Generator.Arduino.libraries_["esp32s2_mpu6050"] =
      `#include <Adafruit_MPU6050.h>`;
    Blockly.Generator.Arduino.libraries_["esp32s2_icm42670"] =
      `#include "ICM42670P.h"`;
    Blockly.Generator.Arduino.libraries_["esp32s2_icm20948"] =
      `#include <Adafruit_ICM20948.h>`;
    Blockly.Generator.Arduino.libraries_["Adafruit_Sensor"] =
      `#include <Adafruit_Sensor.h>`;
    Blockly.Generator.Arduino.libraries_["library_wire"] = `#include <Wire.h>`;
    Blockly.Generator.Arduino.definitions_["define_Adafruit_mpu6050"] =
      "Adafruit_MPU6050 mpu;";
    Blockly.Generator.Arduino.definitions_["define_ICM42670P"] =
      `ICM42670 icm = ICM42670(${wire}, 0);`;
    Blockly.Generator.Arduino.definitions_["define_ICM20948"] =
      "Adafruit_ICM20948 icm2;";
    Blockly.Generator.Arduino.definitions_["define_acceleration_switch"] =
      "int sensorActive = 0; // 0: none, 1: MPU6050, 2: ICM42670P, 3: ICM20948";
    if (wire === "Wire") {
      Blockly.Generator.Arduino.preSetupCode_["Wire.begin"] = "Wire.begin();";
    } else {
      Blockly.Generator.Arduino.setupCode_["Wire1.begin()"] = "Wire1.begin();";
    }
    Blockly.Generator.Arduino.setupCode_["begin_acceleration"] =
      `if (mpu.begin(0x68, &${wire})) // Try MPU6050 first\n` +
      "  {\n" +
      "    mpu.setAccelerometerRange(MPU6050_RANGE_8_G);\n" +
      "    mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);\n" +
      "    sensorActive = 1;\n" +
      "  }\n" +
      "  else if (icm.begin() == 0) // If MPU6050 fails, try ICM42670P\n" +
      "  {\n" +
      "    icm.startAccel(21, 8); // Accel ODR = 100 Hz, Range = 8G\n" +
      "    sensorActive = 2;\n" +
      "  }\n" +
      `  else if (icm2.begin_I2C(0x68, &${wire}))\n` +
      "  {\n" +
      "    icm2.setAccelRange(ICM20948_ACCEL_RANGE_8_G);\n" +
      "    icm2.setAccelRateDivisor(10.25); // 100 Hz sample rate\n" +
      "    sensorActive = 3;\n" +
      "  }";
    Blockly.Generator.Arduino.codeFunctions_["sensebox_requestAcceleration"] =
      "float getAcceleration(String sensorValueType) {\n" +
      "if (sensorActive == 1) {\n" +
      "sensors_event_t a, g, temp;\n" +
      "mpu.getEvent(&a, &g, &temp);\n" +
      'if (sensorValueType == "accelerationX") {\n' +
      "return a.acceleration.x;\n" +
      '} else if (sensorValueType == "accelerationY") {\n' +
      "return a.acceleration.y;\n" +
      '} else if (sensorValueType == "accelerationZ") {\n' +
      "return a.acceleration.z;\n" +
      '} else if (sensorValueType == "temperature") {\n' +
      "return temp.temperature;\n" +
      "} else {\n" +
      "return 0.0;\n" +
      "}\n" +
      "} else if (sensorActive == 2) {\n" +
      "inv_imu_sensor_event_t imu_event;\n" +
      "icm.getDataFromRegisters(imu_event);\n" +
      'if (sensorValueType == "accelerationX") {\n' +
      "return (imu_event.accel[0]*9.81)/4096.0;\n" +
      '} else if (sensorValueType == "accelerationY") {\n' +
      "return (imu_event.accel[1]*9.81)/4096.0;\n" +
      '} else if (sensorValueType == "accelerationZ") {\n' +
      "return (imu_event.accel[2]*9.81)/4096.0;\n" +
      '} else if (sensorValueType == "temperature") {\n' +
      "return (imu_event.temperature/132.48)+25.0;\n" +
      "} else {\n" +
      "return 0.0;\n" +
      "}\n" +
      "} else if (sensorActive == 3) {\n" +
      "sensors_event_t a, g, m, temp;\n" +
      "icm2.getEvent(&a, &g, &m, &temp);\n" +
      'if (sensorValueType == "accelerationX") {\n' +
      "return a.acceleration.x;\n" +
      '} else if (sensorValueType == "accelerationY") {\n' +
      "return a.acceleration.y;\n" +
      '} else if (sensorValueType == "accelerationZ") {\n' +
      "return a.acceleration.z;\n" +
      '} else if (sensorValueType == "temperature") {\n' +
      "return temp.temperature;\n" +
      "} else {\n" +
      "return 0.0;\n" +
      "}\n" +
      "} else {\n" +
      "return 0.0;\n" +
      "}\n" +
      "}\n";
    if (dropdown === "spell") {
      addSpellRecognition();
      return ["getSpellImage()", Blockly.Generator.Arduino.ORDER_ATOMIC];
    }
    var code = 'getAcceleration("' + dropdown + '")';
    return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
  };

/**
 * Spell (gesture drawing) recognition for the senseBox MCU-Eye (ICM-20948).
 * Based on the TensorFlow magic wand example (spell_collection.ino):
 * a background task samples the IMU at 100 Hz, detects strokes from the
 * integrated gyroscope orientation and renders the last completed stroke
 * into a 32x32 grayscale image (SpellImage*, same fields as camera_fb_t),
 * so it can be drawn with the display image block.
 * Requires the definitions/setup of sensebox_esp32s2_accelerometer (icm2).
 */
const addSpellRecognition = () => {
  Blockly.Generator.Arduino.definitions_["define_spell_recognition"] = `
// ===== Spell recognition (magic wand) =====
// Grayscale image with the same fields as camera_fb_t (buf, len, width, height).
// Own type, so spell images work without the camera library (esp_camera.h).
struct SpellImage {
  uint8_t* buf;
  size_t len;
  size_t width;
  size_t height;
};

namespace spell {
constexpr int kImageSize = 32;
constexpr int kImageBytes = kImageSize * kImageSize;
constexpr int kStride = 2;
constexpr int kMaxPoints = 160;
constexpr int kMaxStrokeLength = kMaxPoints * kStride;
constexpr int kMovingSampleCount = 50;
constexpr int kDataLength = 600 * 3;
constexpr float kSampleRate = 100.0f;

enum { eWaiting = 0, eDrawing = 1, eDone = 2 };

float acceleration_data[kDataLength] = {};
int acceleration_data_index = 0;
float gyroscope_data[kDataLength] = {};
float orientation_data[kDataLength] = {};
int gyroscope_data_index = 0;

float current_velocity[3] = {0.0f, 0.0f, 0.0f};
float current_gravity[3] = {0.0f, 0.0f, 0.0f};
float current_gyroscope_drift[3] = {0.0f, 0.0f, 0.0f};

int32_t stroke_state = eWaiting;
int32_t stroke_length = 0;
int32_t point_count = 0;
int8_t points[kMaxPoints * 2] = {};

uint8_t image[kImageBytes] = {};        // last completed spell (task side)
uint8_t image_copy[kImageBytes] = {};   // copy handed to the user program
SpellImage frame;
SemaphoreHandle_t image_mutex = nullptr;

bool readImu() {
  sensors_event_t a, g, m, t;
  if (!icm2.getEvent(&a, &g, &m, &t)) {
    return false;
  }
  // ICM-20948 returns rad/s and m/s^2; the algorithm expects deg/s and g
  constexpr float kRadToDeg = 180.0f / M_PI;
  constexpr float kMsToG = 1.0f / 9.80665f;
  const int gi = gyroscope_data_index % kDataLength;
  gyroscope_data_index += 3;
  gyroscope_data[gi] = g.gyro.x * kRadToDeg;
  gyroscope_data[gi + 1] = g.gyro.y * kRadToDeg;
  gyroscope_data[gi + 2] = g.gyro.z * kRadToDeg;
  const int ai = acceleration_data_index % kDataLength;
  acceleration_data_index += 3;
  acceleration_data[ai] = a.acceleration.x * kMsToG;
  acceleration_data[ai + 1] = a.acceleration.y * kMsToG;
  acceleration_data[ai + 2] = a.acceleration.z * kMsToG;
  return true;
}

float vectorMagnitude(const float* v) {
  return sqrtf((v[0] * v[0]) + (v[1] * v[1]) + (v[2] * v[2]));
}

void estimateGravityDirection(float* gravity) {
  int n = 100;
  if (n >= acceleration_data_index) n = acceleration_data_index;
  if (n <= 0) return;
  const int start = (acceleration_data_index + (kDataLength - (3 * (n + 1)))) % kDataLength;
  float x = 0.0f, y = 0.0f, z = 0.0f;
  for (int i = 0; i < n; ++i) {
    const float* e = &acceleration_data[(start + (i * 3)) % kDataLength];
    x += e[0];
    y += e[1];
    z += e[2];
  }
  gravity[0] = x / n;
  gravity[1] = y / n;
  gravity[2] = z / n;
}

void updateVelocity(int new_samples, const float* gravity) {
  const int start = (acceleration_data_index + (kDataLength - (3 * (new_samples + 1)))) % kDataLength;
  constexpr float friction_fudge = 0.98f;
  for (int i = 0; i < new_samples; ++i) {
    const float* e = &acceleration_data[(start + (i * 3)) % kDataLength];
    for (int k = 0; k < 3; ++k) {
      current_velocity[k] += e[k] - gravity[k];
      current_velocity[k] *= friction_fudge;
    }
  }
}

void estimateGyroscopeDrift(float* drift) {
  if (vectorMagnitude(current_velocity) > 0.1f) return;
  int n = 20;
  if (n >= gyroscope_data_index) n = gyroscope_data_index;
  if (n <= 0) return;
  const int start = (gyroscope_data_index + (kDataLength - (3 * (n + 1)))) % kDataLength;
  float x = 0.0f, y = 0.0f, z = 0.0f;
  for (int i = 0; i < n; ++i) {
    const float* e = &gyroscope_data[(start + (i * 3)) % kDataLength];
    x += e[0];
    y += e[1];
    z += e[2];
  }
  drift[0] = x / n;
  drift[1] = y / n;
  drift[2] = z / n;
}

// dt: time in seconds since the previous sample. The display shares the I2C
// bus with the IMU, so samples can be delayed; integrating with the real
// elapsed time keeps the drawn spell at the correct size.
void updateOrientation(int new_samples, const float* drift, float dt) {
  const int start = (gyroscope_data_index + (kDataLength - (3 * new_samples))) % kDataLength;
  const float recip_sample_rate = dt;
  for (int i = 0; i < new_samples; ++i) {
    const int index = (start + (i * 3)) % kDataLength;
    const float* e = &gyroscope_data[index];
    float* current = &orientation_data[index];
    const float* previous = &orientation_data[(index + (kDataLength - 3)) % kDataLength];
    for (int k = 0; k < 3; ++k) {
      current[k] = previous[k] + ((e[k] - drift[k]) * recip_sample_rate);
    }
  }
}

bool isMoving(int samples_before) {
  constexpr float moving_threshold = 9.0f;
  if ((gyroscope_data_index - samples_before) < kMovingSampleCount) return false;
  const int start = (gyroscope_data_index + (kDataLength - (3 * (kMovingSampleCount + samples_before)))) % kDataLength;
  float total = 0.0f;
  for (int i = 0; i < kMovingSampleCount; ++i) {
    const int index = (start + (i * 3)) % kDataLength;
    const float* current = &orientation_data[index];
    const float* previous = &orientation_data[(index + (kDataLength - 3)) % kDataLength];
    const float dx = current[0] - previous[0];
    const float dy = current[1] - previous[1];
    const float dz = current[2] - previous[2];
    total += (dx * dx) + (dy * dy) + (dz * dz);
  }
  return total > moving_threshold;
}

int8_t clampToInt8(float value) {
  const int32_t v = static_cast<int32_t>(roundf(value * 128.0f));
  if (v > 127) return 127;
  if (v < -128) return -128;
  return static_cast<int8_t>(v);
}

// Converts the orientation history of the current stroke into 2D points
void computeStrokePoints(int current_head) {
  const int start = (gyroscope_data_index + (kDataLength - (3 * (stroke_length + current_head)))) % kDataLength;
  float x_total = 0.0f, z_total = 0.0f;
  for (int j = 0; j < stroke_length; ++j) {
    const float* e = &orientation_data[(start + (j * 3)) % kDataLength];
    x_total += e[0];
    z_total += e[2];
  }
  const float x_mean = x_total / stroke_length;
  const float z_mean = z_total / stroke_length;
  constexpr float range = 45.0f;

  // Orientation of the MCU-Eye: project onto the plane given by gravity (x/z)
  const float gx = current_gravity[0];
  const float gz = current_gravity[2];
  float gmag = sqrtf((gx * gx) + (gz * gz));
  if (gmag < 0.0001f) gmag = 0.0001f;
  const float ngx = gx / gmag;
  const float ngz = gz / gmag;
  const float xaxisz = -ngz;
  const float xaxisx = -ngx;
  const float yaxisz = -ngx;
  const float yaxisx = ngz;

  point_count = stroke_length / kStride;
  for (int j = 0; j < point_count; ++j) {
    const float* e = &orientation_data[(start + ((j * kStride) * 3)) % kDataLength];
    const float nx = (e[0] - x_mean) / range;
    const float nz = (e[2] - z_mean) / range;
    points[j * 2] = clampToInt8((xaxisz * nz) + (xaxisx * nx));
    points[j * 2 + 1] = clampToInt8((yaxisz * nz) + (yaxisx * nx));
  }
}

enum StrokeUpdate { eNoChange = 0, eLive = 1, eCompleted = 2, eDiscarded = 3 };

// Updates the stroke state. Returns eLive while drawing (points updated),
// eCompleted when a stroke has just been finished and eDiscarded when a
// started stroke was too short.
StrokeUpdate updateStroke(int new_samples) {
  constexpr int minimum_stroke_length = kMovingSampleCount + 10;
  // After a finished stroke, wait until the movement window has rolled past
  // the gesture, so the state does not oscillate between drawing and done.
  static int done_cooldown = 0;
  StrokeUpdate result = eNoChange;
  for (int i = 0; i < new_samples; ++i) {
    if (done_cooldown > 0) --done_cooldown;
    const int current_head = new_samples - (i + 1);
    const bool moving = isMoving(current_head);
    const int32_t old_state = stroke_state;
    if ((old_state == eWaiting) || (old_state == eDone)) {
      if (moving && (done_cooldown == 0)) {
        stroke_length = kMovingSampleCount;
        stroke_state = eDrawing;
      }
    } else if (old_state == eDrawing) {
      if (!moving) {
        if (stroke_length > minimum_stroke_length) {
          stroke_state = eDone;
          done_cooldown = kMovingSampleCount;
        } else {
          stroke_length = 0;
          stroke_state = eWaiting;
          result = eDiscarded;
        }
      }
    }
    if (stroke_state == eWaiting) continue;
    stroke_length += 1;
    if (stroke_length > kMaxStrokeLength) stroke_length = kMaxStrokeLength;
    if ((old_state != eDone) && (stroke_state == eDone)) {
      computeStrokePoints(current_head);
      result = eCompleted;
    } else if ((i == new_samples - 1) && (stroke_state == eDrawing)) {
      // recompute the stroke so far, to show it while drawing
      computeStrokePoints(current_head);
      result = eLive;
    }
  }
  return result;
}

void drawLine(uint8_t* img, int x0, int y0, int x1, int y1) {
  const int dx = abs(x1 - x0);
  const int dy = abs(y1 - y0);
  const int sx = (x0 < x1) ? 1 : -1;
  const int sy = (y0 < y1) ? 1 : -1;
  int err = dx - dy;
  while (true) {
    if (x0 >= 0 && x0 < kImageSize && y0 >= 0 && y0 < kImageSize) {
      img[y0 * kImageSize + x0] = 255;
      if (x0 + 1 < kImageSize) img[y0 * kImageSize + (x0 + 1)] = 255;
      if (y0 + 1 < kImageSize) img[(y0 + 1) * kImageSize + x0] = 255;
    }
    if (x0 == x1 && y0 == y1) break;
    const int e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
  }
}

// Renders the stroke points (white on black) like the Teachable Machine
void renderStroke(uint8_t* img) {
  memset(img, 0, kImageBytes);
  const int half = kImageSize / 2;
  int prev_x = 0, prev_y = 0;
  for (int i = 0; i < point_count; ++i) {
    const int x = static_cast<int>(half + (points[i * 2] / 128.0f) * half);
    const int y = static_cast<int>(half - (points[i * 2 + 1] / 128.0f) * half);
    if (i > 0) drawLine(img, prev_x, prev_y, x, y);
    if (i == point_count - 1) {
      // endpoint marker
      for (int dy = -2; dy <= 2; ++dy) {
        for (int dx = -2; dx <= 2; ++dx) {
          const int px = x + dx;
          const int py = y + dy;
          if ((dx * dx + dy * dy <= 4) && px >= 0 && px < kImageSize && py >= 0 && py < kImageSize) {
            img[py * kImageSize + px] = 255;
          }
        }
      }
    }
    prev_x = x;
    prev_y = y;
  }
}

void publishImage(const uint8_t* img) {
  xSemaphoreTake(image_mutex, portMAX_DELAY);
  memcpy(image, img, kImageBytes);
  xSemaphoreGive(image_mutex);
}

void task(void* parameter) {
  static uint8_t rendered[kImageBytes];
  static uint8_t last_completed[kImageBytes] = {};  // last finished spell
  int live_counter = 0;
  unsigned long last_sample_us = 0;
  TickType_t last_wake = xTaskGetTickCount();
  for (;;) {
    if (readImu()) {
      const unsigned long now_us = micros();
      float dt = 1.0f / kSampleRate;
      if (last_sample_us != 0) {
        dt = (now_us - last_sample_us) / 1000000.0f;
        if (dt > 0.1f) dt = 0.1f;  // ignore very long pauses
      }
      last_sample_us = now_us;
      estimateGyroscopeDrift(current_gyroscope_drift);
      updateOrientation(1, current_gyroscope_drift, dt);
      const StrokeUpdate update = updateStroke(1);
      if (update == eCompleted) {
        renderStroke(last_completed);
        publishImage(last_completed);
        live_counter = 0;
      } else if (update == eLive) {
        // show the spell while it is being drawn (updated every 50 ms)
        if (++live_counter >= 5) {
          live_counter = 0;
          renderStroke(rendered);
          publishImage(rendered);
        }
      } else if (update == eDiscarded) {
        // stroke was too short: show the last finished spell again
        publishImage(last_completed);
        live_counter = 0;
      }
      estimateGravityDirection(current_gravity);
      updateVelocity(1, current_gravity);
    }
    vTaskDelayUntil(&last_wake, pdMS_TO_TICKS(10));  // ~100 Hz
  }
}
}  // namespace spell

// Returns the spell currently being drawn, or the most recently
// finished spell, as 32x32 grayscale image
SpellImage* getSpellImage() {
  if (spell::image_mutex) {
    xSemaphoreTake(spell::image_mutex, portMAX_DELAY);
    memcpy(spell::image_copy, spell::image, spell::kImageBytes);
    xSemaphoreGive(spell::image_mutex);
  }
  spell::frame.buf = spell::image_copy;
  spell::frame.len = spell::kImageBytes;
  spell::frame.width = spell::kImageSize;
  spell::frame.height = spell::kImageSize;
  return &spell::frame;
}`;
  Blockly.Generator.Arduino.setupCode_["begin_spell_recognition"] =
    "if (sensorActive == 3) {\n" +
    "    spell::image_mutex = xSemaphoreCreateMutex();\n" +
    '    xTaskCreate(spell::task, "spell", 4096, NULL, 1, NULL);\n' +
    "  } else {\n" +
    '    Serial.println("Spell recognition needs the ICM-20948 (senseBox MCU-Eye)");\n' +
    "  }";
};

/**
 * Block for Truebner STM50 on MCUS2
 */

Blockly.Generator.Arduino.forBlock["sensebox_sensor_truebner_smt50_esp32"] =
  function () {
    var dropdown_port = this.getFieldValue("Port");
    var dropdown_value = this.getFieldValue("value");
    var dropdown_pin = 1;
    var code = "";
    Blockly.Generator.Arduino.setupCode_["analogReadResolution"] =
      "analogReadResolution(13);";

    if (dropdown_value === "temp") {
      switch (dropdown_port) {
        case "IO3_2":
          dropdown_pin = 3;
          break;
        case "IO3_4":
          dropdown_pin = 3;
          break;
        case "IO5_4":
          dropdown_pin = 5;
          break;
        case "IO5_6":
          dropdown_pin = 5;
          break;
        case "IO7_6":
          dropdown_pin = 7;
          break;
        default: // "IO1_2"
          dropdown_pin = 1;
      }
      Blockly.Generator.Arduino.codeFunctions_["sensebox_smt50_temp_esp32"] =
        "float getSMT50Temperature(int analogPin){\n float voltage = analogReadMilliVolts(analogPin)/1000.0;\n return (voltage - 0.5) * 100;\n }";
      code = "getSMT50Temperature(" + dropdown_pin + ")";
      return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
    } else if (dropdown_value === "soil") {
      switch (dropdown_port) {
        case "IO3_2":
          dropdown_pin = 2;
          break;
        case "IO3_4":
          dropdown_pin = 4;
          break;
        case "IO5_4":
          dropdown_pin = 4;
          break;
        case "IO5_6":
          dropdown_pin = 6;
          break;
        case "IO7_6":
          dropdown_pin = 6;
          break;
        default: // "IO1_2"
          dropdown_pin = 2;
      }

      Blockly.Generator.Arduino.codeFunctions_["sensebox_smt50_soil_esp32"] =
        "float getSMT50Moisture(int analogPin){\n float voltage = analogReadMilliVolts(analogPin)/1000.0;\n   if (voltage >= 3) voltage = 3.0;\n  return (voltage * 50.0) / 3.0;\n}";

      code = "getSMT50Moisture(" + dropdown_pin + ")";
      return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
    }
  };

Blockly.Generator.Arduino.forBlock["sensebox_sensor_icm20948"] = function () {
  var code = "";
  var dropdown = this.getFieldValue("VALUE");
  var range = this.getFieldValue("RANGE");
  Blockly.Generator.Arduino.libraries_["icm20X_lib"] =
    `#include <Adafruit_ICM20X.h>`;
  Blockly.Generator.Arduino.libraries_["icm20948_lib"] =
    `#include <Adafruit_ICM20948.h>`;
  Blockly.Generator.Arduino.libraries_["Adafruit_Sensor"] =
    `#include <Adafruit_Sensor.h>`;
  Blockly.Generator.Arduino.libraries_["library_wire"] = `#include <Wire.h>`;
  Blockly.Generator.Arduino.definitions_["define_sensor_events"] =
    "sensors_event_t accel, gyro, mag, temp;";
  Blockly.Generator.Arduino.definitions_["define_Adafruit_icm20948"] =
    "Adafruit_ICM20948 icm;";
  Blockly.Generator.Arduino.definitions_["measurement_delay"] =
    "uint16_t measurement_delay_us = 65535; // Delay between measurements for testing";
  Blockly.Generator.Arduino.setupCode_["icm.begin()"] =
    "icm.begin_I2C(0x68, &Wire1);";
  switch (range) {
    case "2G":
      Blockly.Generator.Arduino.setupCode_["icm.setAccelerometerRange()"] =
        "icm.setAccelRange(ICM20948_ACCEL_RANGE_2_G);";
      break;
    case "4G":
      Blockly.Generator.Arduino.setupCode_["icm.setAccelerometerRange()"] =
        "icm.setAccelRange(ICM20948_ACCEL_RANGE_4_G);";
      break;
    case "8g":
      Blockly.Generator.Arduino.setupCode_["icm.setAccelerometerRange()"] =
        "icm.setAccelRange(ICM20948_ACCEL_RANGE_8_G);";
      break;
    case "16G":
      Blockly.Generator.Arduino.setupCode_["icm.setAccelerometerRange()"] =
        "icm.setAccelRange(ICM20948_ACCEL_RANGE_16_G);";
      break;
    default:
      Blockly.Generator.Arduino.setupCode_["icm.setAccelerometerRange()"] =
        "icm.setAccelRange(ICM20948_ACCEL_RANGE_2_G);";
  }

  Blockly.Generator.Arduino.loopCodeOnce_["icm.getEvent"] =
    "  icm.getEvent(&accel, &gyro, &temp, &mag);";

  switch (dropdown) {
    case "accelerationX":
      code = "accel.acceleration.x";
      break;
    case "accelerationY":
      code = "accel.acceleration.y";
      break;
    case "accelerationZ":
      code = "accel.acceleration.z";
      break;
    default:
      code = "";
  }

  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};

Blockly.Generator.Arduino.forBlock["sensebox_sensor_max17048"] = function () {
  var code = "";
  var dropdown = this.getFieldValue("value");
  Blockly.Generator.Arduino.libraries_["adafruit_max1704x"] =
    `#include "Adafruit_MAX1704X.h" // http://librarymanager/All#Adafruit_MAX1704X`;
  Blockly.Generator.Arduino.definitions_["define_max17048"] =
    "Adafruit_MAX17048 maxlipo;";
  Blockly.Generator.Arduino.setupCode_["max17048.begin()"] = "maxlipo.begin();";
  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};

Blockly.Generator.Arduino.forBlock["sensebox_eye_camera"] = function () {
  var code = "";

  Blockly.Generator.Arduino.libraries_["esp_camera"] =
    // esp_camera.h (sensor.h) and Adafruit_Sensor.h both define sensor_t.
    // Rename the camera one, so the camera can be used together with
    // Adafruit sensor libraries (e.g. the accelerometer block).
    "#define sensor_t esp_camera_sensor_t\n" +
    `#include "esp_camera.h"\n` +
    "#undef sensor_t";
  Blockly.Generator.Arduino.setupCode_["camera_config"] =
    "camera_config_t config;\n" +
    "config.ledc_channel = LEDC_CHANNEL_0;\n" +
    "config.ledc_timer = LEDC_TIMER_0;\n" +
    "config.pin_d0 = Y2_GPIO_NUM;\n" +
    "config.pin_d1 = Y3_GPIO_NUM;\n" +
    "config.pin_d2 = Y4_GPIO_NUM;\n" +
    "config.pin_d3 = Y5_GPIO_NUM;\n" +
    "config.pin_d4 = Y6_GPIO_NUM;\n" +
    "config.pin_d5 = Y7_GPIO_NUM;\n" +
    "config.pin_d6 = Y8_GPIO_NUM;\n" +
    "config.pin_d7 = Y9_GPIO_NUM;\n" +
    "config.pin_xclk = XCLK_GPIO_NUM;\n" +
    "config.pin_pclk = PCLK_GPIO_NUM;\n" +
    "config.pin_vsync = VSYNC_GPIO_NUM;\n" +
    "config.pin_href = HREF_GPIO_NUM;\n" +
    "config.pin_sccb_sda = SIOD_GPIO_NUM;\n" +
    "config.pin_sccb_scl = SIOC_GPIO_NUM;\n" +
    "config.pin_pwdn = PWDN_GPIO_NUM;\n" +
    "config.pin_reset = RESET_GPIO_NUM;\n" +
    "config.xclk_freq_hz = 20000000;\n" +
    "config.pixel_format = PIXFORMAT_GRAYSCALE;\n" +
    "config.frame_size = FRAMESIZE_96X96; // Small grayscale image\n" +
    "config.jpeg_quality = 12;\n" +
    "config.fb_count = 1;\n" +
    "config.fb_location = CAMERA_FB_IN_DRAM;\n" +
    "config.grab_mode = CAMERA_GRAB_WHEN_EMPTY;";
  Blockly.Generator.Arduino.setupCode_["camera_init"] =
    "esp_err_t err = esp_camera_init(&config);";

  // Add helper function for scoped camera access
  Blockly.Generator.Arduino.codeFunctions_["camera_scoped_helper"] = `
// Helper class for automatic framebuffer management
class ScopedCamera {
private:
  camera_fb_t *fb;
public:
  ScopedCamera() : fb(esp_camera_fb_get()) {}
  ~ScopedCamera() { 
    if (fb) esp_camera_fb_return(fb); 
  }
  camera_fb_t* get() { return fb; }
  operator bool() const { return fb != nullptr; }
};`;

  // Use ScopedCamera for automatic cleanup
  code = "ScopedCamera().get()";

  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};
