import Blockly from "blockly";

/**
 * HDC1080 Temperature and Humidity Sensor
 *
 */

Blockly.Arduino.sensebox_sensor_temp_hum = function () {
  var dropdown_name = this.getFieldValue("NAME");

  Blockly.Arduino.libraries_["library_adafruithdc1000"] =
    "#include <Adafruit_HDC1000.h> // http://librarymanager/All#Adafruit_HDC1000_Library";
  Blockly.Arduino.definitions_["define_hdc"] =
    "Adafruit_HDC1000 hdc = Adafruit_HDC1000();";
  Blockly.Arduino.setupCode_["sensebox_sensor_temp_hum"] = "hdc.begin();";
  var code = `hdc.read${dropdown_name}()`;
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

/**
 * VEML 6070 and TSL4513 UV-Light/Illuminance Sensor
 *
 */

Blockly.Arduino.sensebox_sensor_uv_light = function () {
  var dropdown_name = this.getFieldValue("NAME");
  let code = "";
  if (dropdown_name === "UvIntensity") {
    Blockly.Arduino.libraries_["library_veml6070"] = "#include <VEML6070.h>";
    Blockly.Arduino.definitions_["define_veml"] = "VEML6070 veml;";
    Blockly.Arduino.setupCode_["sensebox_sensor_uv_light"] = "veml.begin();";
    code = "veml.getUV()";
  }
  if (dropdown_name === "Illuminance") {
    Blockly.Arduino.libraries_["library_ltr329"] = `#include <LTR329.h>`;
    Blockly.Arduino.libraries_["library_wire"] = "#include <Wire.h>";
    Blockly.Arduino.codeFunctions_["read_reg"] = `
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
    Blockly.Arduino.codeFunctions_["write_reg"] = `
void write_reg(byte address, uint8_t reg, uint8_t val)
  {
    Wire.beginTransmission(address);
    Wire.write(reg);
    Wire.write(val);
    Wire.endTransmission();
  }`;

    Blockly.Arduino.codeFunctions_["Lightsensor_begin"] = `
void Lightsensor_begin()
  {
    Wire.begin();
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

    Blockly.Arduino.codeFunctions_["Lightsensor_getIlluminance"] = `
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
    Blockly.Arduino.definitions_["define_lightsensor"] = `
bool lightsensortype = 0; //0 for tsl - 1 for ltr
//settings for LTR sensor
LTR329 LTR;
unsigned char gain = 1;
unsigned char integrationTime = 0;
unsigned char measurementRate = 3;
`;
    Blockly.Arduino.setupCode_["sensebox_sensor_illuminance"] =
      "Lightsensor_begin();";
    code = "Lightsensor_getIlluminance()";
  }

  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

/**
 * BMX055 Accelerometer
 *
 */

Blockly.Arduino.sensebox_sensor_bmx055_accelerometer = function () {
  var dropdown_value = this.getFieldValue("VALUE");
  var range = this.getFieldValue("RANGE");
  Blockly.Arduino.libraries_["library_bmx055"] = `#include <BMX055.h>`;
  Blockly.Arduino.definitions_["define_bmx"] = "BMX055 bmx;";
  Blockly.Arduino.setupCode_["sensebox_sensor_bmx055"] =
    "bmx.beginAcc(" + range + ");";
  var code = "bmx.getAcceleration" + dropdown_value + "()";
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

/**
 * SDS011 Fine Particlar Matter
 *
 */

Blockly.Arduino.sensebox_sensor_sds011 = function () {
  var dropdown_name = this.getFieldValue("NAME");
  var serial_name = this.getFieldValue("SERIAL");
  Blockly.Arduino.libraries_[
    "SdsDustSensor"
  ] = `#include <SdsDustSensor.h> // http://librarymanager/All#Nova_Fitness_Sds_dust_sensors_library`;
  Blockly.Arduino.definitions_["define_sds011"] =
    "SdsDustSensor sds(" + serial_name + ");";
  Blockly.Arduino.functionNames_["sds011_getPmData()"] = `
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
`
  Blockly.Arduino.setupCode_["sds011_begin"] = "sds.begin();";
  Blockly.Arduino.setupCode_["sds011_setQueryReportingMode"] =
    "sds.setQueryReportingMode();";
  // Blockly.Arduino.loopCodeOnce_[
  //   "sds011_getData"
  // ] = `PmResult pm = sds.queryPm();`;
  var code = `getPmData(${dropdown_name})`;
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

/**
 * BMP280 Pressure Sensor
 *
 */

Blockly.Arduino.sensebox_sensor_pressure = function () {
  var dropdown_name = this.getFieldValue("NAME");
  var code = "";
  var referencePressure = this.getFieldValue("referencePressure");
  Blockly.Arduino.libraries_[
    "adafruit_bmp280"
  ] = `#include <Adafruit_BMP280.h> // http://librarymanager/All#Adafruit_BMP280_Library`;
  Blockly.Arduino.definitions_["define_pressure"] = "Adafruit_BMP280 bmp;";
  Blockly.Arduino.setupCode_["sensebox_bmp_sensor"] = "bmp.begin(0x76);";
  Blockly.Arduino.setupCode_["bmp_setSampling"] = `
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
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

/**
 * BME680 Environmental Sensor
 *
 */

Blockly.Arduino.sensebox_sensor_bme680_bsec = function () {
  var dropdown_name = this.getFieldValue("dropdown");
  let code = "";
  Blockly.Arduino.libraries_["library_bsec"] =
    "#include <bsec.h> // http://librarymanager/All#BSEC_Software_Library";
  Blockly.Arduino.definitions_["bsec_iaqSensor"] = "Bsec iaqSensor;";
  Blockly.Arduino.variables_["bmeTemperatur"] = "float bmeTemperatur;";
  Blockly.Arduino.variables_["bmeHumidity"] = "float bmeHumidity;";
  Blockly.Arduino.variables_["bmePressure"] = "double bmePressure;";
  Blockly.Arduino.variables_["bmeIAQ"] = "float bmeIAQ;";
  Blockly.Arduino.variables_["bmeIAQAccuracy"] = "float bmeIAQAccuracy;";
  Blockly.Arduino.variables_["bmeCO2"] = "int bmeCO2;";
  Blockly.Arduino.variables_["bmeBreathVocEquivalent"] =
    "float bmeBreathVocEquivalent;";

  Blockly.Arduino.functionNames_["checkIaqSensorStatus"] = `
    void checkIaqSensorStatus(void)
  {
    if (iaqSensor.bsecStatus != BSEC_OK) {
      if (iaqSensor.bsecStatus < BSEC_OK) {
        for (;;)
          errLeds(); /* Halt in case of failure */
      } 
    }
  
    if (iaqSensor.bme68xStatus != BME68X_OK) {
      if (iaqSensor.bme68xStatus < BME68X_OK) {
        for (;;)
          errLeds(); /* Halt in case of failure */
      } 
    }
  }
  `;
  Blockly.Arduino.functionNames_["errLeds"] = `
  void errLeds(void)
  {
    pinMode(LED_BUILTIN, OUTPUT);
    digitalWrite(LED_BUILTIN, HIGH);
    delay(100);
    digitalWrite(LED_BUILTIN, LOW);
    delay(100);
  }`;
  //Setup Code
  Blockly.Arduino.setupCode_["Wire.begin"] = "Wire.begin();";
  Blockly.Arduino.setupCode_["iaqSensor.begin"] =
    "iaqSensor.begin(BME68X_I2C_ADDR_LOW, Wire);";
  Blockly.Arduino.setupCode_["checkIaqSensorStatus"] =
    "checkIaqSensorStatus();";
  Blockly.Arduino.setupCode_["bsec_sensorlist"] = `
bsec_virtual_sensor_t sensorList[13] = {
    BSEC_OUTPUT_IAQ,
    BSEC_OUTPUT_STATIC_IAQ,
    BSEC_OUTPUT_CO2_EQUIVALENT,
    BSEC_OUTPUT_BREATH_VOC_EQUIVALENT,
    BSEC_OUTPUT_RAW_TEMPERATURE,
    BSEC_OUTPUT_RAW_PRESSURE,
    BSEC_OUTPUT_RAW_HUMIDITY,
    BSEC_OUTPUT_RAW_GAS,
    BSEC_OUTPUT_STABILIZATION_STATUS,
    BSEC_OUTPUT_RUN_IN_STATUS,
    BSEC_OUTPUT_SENSOR_HEAT_COMPENSATED_TEMPERATURE,
    BSEC_OUTPUT_SENSOR_HEAT_COMPENSATED_HUMIDITY,
    BSEC_OUTPUT_GAS_PERCENTAGE
};

    `;
  Blockly.Arduino.setupCode_["iaqSensorUpdateSubscription"] =
    "iaqSensor.updateSubscription(sensorList, 13, BSEC_SAMPLE_RATE_LP);\ncheckIaqSensorStatus();";
  //Loop Code
  Blockly.Arduino.loopCodeOnce_["iaqloop"] = `
    if (iaqSensor.run()) {
      bmeTemperatur = iaqSensor.temperature;
      bmeHumidity = iaqSensor.humidity;
      bmePressure = iaqSensor.pressure;
      bmeIAQ = iaqSensor.iaq;
      bmeIAQAccuracy = iaqSensor.iaqAccuracy;
      bmeCO2 = iaqSensor.co2Equivalent;
      bmeBreathVocEquivalent = iaqSensor.breathVocEquivalent;
    } else {
      checkIaqSensorStatus();
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
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

/**
 * Ultrasonic Distance Sensor
 *
 */

Blockly.Arduino.sensebox_sensor_ultrasonic_ranger = function () {
  var dropdown_pin_RX = this.getFieldValue("ultrasonic_trigger");
  var dropdown_pin_TX = this.getFieldValue("ultrasonic_echo");
  var port = this.getFieldValue("port");
  var maxDistance = this.getFieldValue("maxDistance");
  Blockly.Arduino.libraries_[
    "library_newPing"
  ] = `#include <NewPing.h> // http://librarymanager/All#NewPing`;
  Blockly.Arduino.variables_["define_newPingVariables" + port] = `
#define TRIGGER_PIN_${port} ${dropdown_pin_RX}
#define ECHO_PIN_${port} ${dropdown_pin_TX}
#define MAX_DISTANCE_${port} ${maxDistance}
  `;
  Blockly.Arduino.definitions_[
    "define_newPing" + port
  ] = `NewPing sonar${port}(TRIGGER_PIN_${port}, ECHO_PIN_${port}, MAX_DISTANCE_${port});`;
  var code;
  code = `sonar${port}.ping_cm()`;
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};


/**
 * 
 * ToF Imager
 */

Blockly.Arduino.sensebox_tof_imager = function () {
  var dropdown_name = this.getFieldValue("dropdown");
  var maxDistance = this.getFieldValue("maxDistance");
  Blockly.Arduino.libraries_["library_wire"] = "#include <Wire.h>";
  Blockly.Arduino.libraries_[`library_vl53l8cx`] = `#include <vl53l8cx_class.h> `;
  Blockly.Arduino.variables_["define:_vl53l8cx"] = `
VL53L8CX sensor_vl53l8cx_top(&Wire, -1, -1);  
`;
  Blockly.Arduino.setupCode_["setup_vl53l8cx"] = `
  Wire.begin();
  Wire.setClock(1000000); //Sensor has max I2C freq of 1MHz
  sensor_vl53l8cx_top.begin();
  sensor_vl53l8cx_top.init_sensor();
  sensor_vl53l8cx_top.vl53l8cx_set_ranging_frequency_hz(30);
  sensor_vl53l8cx_top.vl53l8cx_set_resolution(VL53L8CX_RESOLUTION_8X8);
  sensor_vl53l8cx_top.vl53l8cx_start_ranging();
  `;
  var code = "";
  switch (dropdown_name) {
    case "DistanzCM":
      Blockly.Arduino.codeFunctions_["define_tof_range"] = `
    float oldVl53l8cxMin = -1.0;
    float getVl53l8cxMin() {
      VL53L8CX_ResultsData Results;
      uint8_t NewDataReady = 0;
      uint8_t status;

      status = sensor_vl53l8cx_top.vl53l8cx_check_data_ready(&NewDataReady);

      if ((!status) && (NewDataReady != 0)) {
        sensor_vl53l8cx_top.vl53l8cx_get_ranging_data(&Results);
        float min = 10000.0;
        for(int i = 0; i < VL53L8CX_RESOLUTION_8X8*VL53L8CX_NB_TARGET_PER_ZONE; i++) {
          if((&Results)->target_status[i]!=255){
            float distance = (&Results)->distance_mm[i];
            if(min > distance) {
              min = distance;
            }
          }
        }
        oldVl53l8cxMin = (min==10000.0) ? 0.0 : min;
      }
      return oldVl53l8cxMin;
      }`;
      code += "getVl53l8cxMin()";
      break;
    case "DistanzBM":
      Blockly.Arduino.codeFunctions_["define_tof_bitmap"] = `
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
      
        status = sensor_vl53l8cx_top.vl53l8cx_check_data_ready(&NewDataReady);
      
        if ((!status) && (NewDataReady != 0)) {
          sensor_vl53l8cx_top.vl53l8cx_get_ranging_data(&Result);
          int8_t i, j, k;
          uint8_t zones_per_line;
          uint8_t number_of_zones = VL53L8CX_RESOLUTION_8X8;
      
          zones_per_line = (number_of_zones == 16) ? 4 : 8;
      
          for (j = 0; j < number_of_zones; j += zones_per_line)
          {
            for (k = (zones_per_line - 1); k >= 0; k--)
            {
              if((long)(&Result)->target_status[(VL53L8CX_NB_TARGET_PER_ZONE * (j+k))] ==255){
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
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};


/**
 * Microphone
 *
 */

Blockly.Arduino.sensebox_sensor_sound = function () {
  var dropdown_pin = this.getFieldValue("PIN");
  Blockly.Arduino.codeFunctions_["define_sound"] = `
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
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

/**
 * Button
 *
 */

Blockly.Arduino.sensebox_button = function () {
  var dropdown_pin = this.getFieldValue("PIN");
  var dropown_function = this.getFieldValue("FUNCTION");
  Blockly.Arduino.libraries_[
    "library_jcButtons"
  ] = `#include <JC_Button.h> // http://librarymanager/All#JC_Button`;

  Blockly.Arduino.definitions_["define_button" + dropdown_pin + ""] =
    "Button button_" + dropdown_pin + "(" + dropdown_pin + ");";
  Blockly.Arduino.setupCode_["setup_button" + dropdown_pin + ""] =
    "button_" + dropdown_pin + ".begin();";
  Blockly.Arduino.loopCodeOnce_["loop_button" + dropdown_pin + ""] =
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
    Blockly.Arduino.definitions_["define_button" + dropdown_pin + ""] =
    "ToggleButton button_" + dropdown_pin + "(" + dropdown_pin + ");";
  }
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

/**
 * SCD30 CO2 Sensor
 *
 */

Blockly.Arduino.sensebox_scd30 = function () {
  var dropdown = this.getFieldValue("dropdown");
  Blockly.Arduino.libraries_["scd30_library"] =
    "#include <SparkFun_SCD30_Arduino_Library.h> // http://librarymanager/All#SparkFun_SCD30_Arduino_Library";
  Blockly.Arduino.definitions_["SCD30"] = "SCD30 airSensor;";
  Blockly.Arduino.setupCode_["init_scd30"] = ` Wire.begin();
if (airSensor.begin() == false)
{
  while (1)
    ;
}`;
  Blockly.Arduino.setupCode_["scd30_staleData"] =
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
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

/**
 * GPS Module
 *
 */

Blockly.Arduino.sensebox_gps = function () {
  var dropdown = this.getFieldValue("dropdown");
  Blockly.Arduino.libraries_["gps_library"] =
    "#include <SparkFun_u-blox_GNSS_Arduino_Library.h> // http://librarymanager/All#SparkFun_u-blox_GNSS_Arduino_Library";
  Blockly.Arduino.libraries_["library_wire"] = "#include <Wire.h>";
  Blockly.Arduino.definitions_["GPS"] = "SFE_UBLOX_GNSS myGNSS;";
  Blockly.Arduino.setupCode_["init_gps"] = ` Wire.begin();

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
      Blockly.Arduino.variables_["timestampVars"] = `
char tsBuffer[21];
      `;
      Blockly.Arduino.codeFunctions_["getTimeStamp()"] = `
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
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

/**
 * Block for Truebner STM50
 */

Blockly.Arduino.sensebox_sensor_truebner_smt50 = function () {
  var dropdown_port = this.getFieldValue("Port");
  var dropdown_value = this.getFieldValue("value");
  var dropdown_pin = 1;
  var code = "";
  if (dropdown_value === "temp") {
    if (dropdown_port === "A") {
      dropdown_pin = 1;
    }
    if (dropdown_port === "B") {
      dropdown_pin = 3;
    }
    if (dropdown_port === "C") {
      dropdown_pin = 5;
    }
    Blockly.Arduino.codeFunctions_["sensebox_smt50_temp"] =
      "float getSMT50Temperature(int analogPin){\n  int sensorValue = analogRead(analogPin);\n  float voltage = sensorValue * (3.3 / 1024.0);\n   return (voltage - 0.5) * 100;\n}";
    code = "getSMT50Temperature(" + dropdown_pin + ")";
    return [code, Blockly.Arduino.ORDER_ATOMIC];
  } else if (dropdown_value === "soil") {
    if (dropdown_port === "A") {
      dropdown_pin = 2;
    }
    if (dropdown_port === "B") {
      dropdown_pin = 4;
    }
    if (dropdown_port === "C") {
      dropdown_pin = 6;
    }
    Blockly.Arduino.codeFunctions_["sensebox_smt50_soil"] =
      "float getSMT50Moisture(int analogPin){\n   int sensorValue = analogRead(analogPin);\n    float voltage = sensorValue * (3.3 / 1024.0);\n   return (voltage * 50) / 3;\n}";
    code = "getSMT50Moisture(" + dropdown_pin + ")";
    return [code, Blockly.Arduino.ORDER_ATOMIC];
  }
};

/**
 * DS18B20 Watertemperature
 *
 */

Blockly.Arduino.sensebox_sensor_watertemperature = function () {
  var dropdown_port = this.getFieldValue("Port");
  var dropdown_pin = 1;
  if (dropdown_port === "A") {
    dropdown_pin = 1;
  }
  if (dropdown_port === "B") {
    dropdown_pin = 3;
  }
  if (dropdown_port === "C") {
    dropdown_pin = 5;
  }
  Blockly.Arduino.libraries_["library_oneWire"] =
    "#include <OneWire.h> // http://librarymanager/All#OneWire";
  Blockly.Arduino.libraries_["library_oneDallasTemperature"] =
    "#include <DallasTemperature.h> // http://librarymanager/All#DallasTemperature";
  Blockly.Arduino.definitions_["define_OneWire"] =
    "#define ONE_WIRE_BUS " +
    dropdown_pin +
    "\nOneWire oneWire(ONE_WIRE_BUS);\nDallasTemperature sensors(&oneWire);";
  Blockly.Arduino.setupCode_["sensebox_oneWireSetup"] = "sensors.begin();";
  Blockly.Arduino.codeFunctions_["sensebox_requestTemp"] =
    "float getWaterTemp(){\nsensors.requestTemperatures();\nsensors.getTempCByIndex(0);\n}";
  var code = "getWaterTemp()";
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

/**
 * Windspeed
 * remove for now



Blockly.Arduino.sensebox_windspeed = function () {
  var dropdown_pin = this.getFieldValue('PIN');
  Blockly.Arduino.codeFunctions_['windspeed'] = `    
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
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};
 */

/**
 * DF Robot Soundsensor
 */

/**
 *
 *
 */

Blockly.Arduino.sensebox_soundsensor_dfrobot = function () {
  var dropdown_port = this.getFieldValue("Port");
  var dropdown_pin = 1;
  if (dropdown_port === "A") {
    dropdown_pin = 1;
  }
  if (dropdown_port === "B") {
    dropdown_pin = 3;
  }
  if (dropdown_port === "C") {
    dropdown_pin = 5;
  }
  Blockly.Arduino.codeFunctions_["soundsensor"] =
    `    
float getSoundValue(){
  float v = analogRead(` +
    dropdown_pin +
    `) * (3.3 / 1024.0);
  float decibel = v * 50;
  return decibel;
}`;
  var code = "getSoundValue()";
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

/**
 * Infineon DPS310 Pressure Sensor
 *
 */

Blockly.Arduino.sensebox_sensor_dps310 = function () {
  var dropdown_name = this.getFieldValue("NAME");
  var code = "";
  var referencePressure = this.getFieldValue("referencePressure");
  Blockly.Arduino.libraries_[
    "adafruit_dps310"
  ] = `#include <Adafruit_DPS310.h> // http://librarymanager/All#Adafruit_DPS310`;
  Blockly.Arduino.definitions_["define_dps"] = "Adafruit_DPS310 dps;";
  Blockly.Arduino.setupCode_["dps_begin"] = "dps.begin_I2C(0x76);";
  Blockly.Arduino.setupCode_["dps_configuration"] = `
  dps.configurePressure(DPS310_64HZ, DPS310_64SAMPLES);
  dps.configureTemperature(DPS310_64HZ, DPS310_64SAMPLES);
  `;
  Blockly.Arduino.loopCodeOnce_["dps_events"] =
    "sensors_event_t temp_event, pressure_event;";
  Blockly.Arduino.loopCodeOnce_["dps_getEvents"] =
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
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

/**
 * Sensirion SPS30 Fine Particlar Matter
 *
 */

Blockly.Arduino.sensebox_sensor_sps30 = function () {
  var dropdown_name = this.getFieldValue("value");
  Blockly.Arduino.libraries_[
    "sps30"
  ] = `#include <sps30.h> // http://librarymanager/All#`;
  Blockly.Arduino.variables_["sps30_measurement"] =
    "struct sps30_measurement m;";
  Blockly.Arduino.variables_["sps30_auto_clean_days"] =
    "uint32_t auto_clean_days = 4;";
  Blockly.Arduino.variables_["sps30_interval_intervalsps"] =
    "const long intervalsps = 1000;";
  Blockly.Arduino.variables_["sps30_time_startsps"] =
    "unsigned long time_startsps = 0;";
  Blockly.Arduino.variables_["sps30_time_actualsps"] =
    "unsigned long time_actualsps = 0;";
  Blockly.Arduino.codeFunctions_["sps30_getData"] = `
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

  Blockly.Arduino.setupCode_["sps30_begin"] = "sensirion_i2c_init();";
  Blockly.Arduino.setupCode_["sps30_setFanCleaningInterval"] =
    "sps30_set_fan_auto_cleaning_interval_days(auto_clean_days);";
  Blockly.Arduino.setupCode_["sps30_startMeasurement"] =
    "sps30_start_measurement();";
  Blockly.Arduino.loopCodeOnce_["getSPS30Data();"] = `
time_startsps = millis();
if (time_startsps > time_actualsps + intervalsps) {
  time_actualsps = millis();
  getSPS30Data();
}`;
  var code = `m.mc_${dropdown_name}`;
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};


/**
 * senseBox MCU-S2 onboard Light Sensor
 * 
 */

Blockly.Arduino.sensebox_esp32s2_light = function () {
  var code = "analogRead(PD_SENSE)";
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

/**
  * senseBox MCU-S2 onboard MPU6050
  * 
  **/

Blockly.Arduino.sensebox_esp32s2_mpu6050 = function () {
  var code = "";
  var dropdown = this.getFieldValue("value");
  Blockly.Arduino.libraries_["esp32s2_mpu6050"] = `#include <Adafruit_MPU6050.h>`;
  Blockly.Arduino.libraries_["Adafruit_Sensor"] = `#include <Adafruit_Sensor.h>`;
  Blockly.Arduino.libraries_["library_wire"] = `#include <Wire.h>`;
  Blockly.Arduino.definitions_["define_Adafruit_mpu6050"] = "Adafruit_MPU6050 mpu;";
  Blockly.Arduino.definitions_["define_sensor_events"] = "sensors_event_t a, g, temp;";
  Blockly.Arduino.setupCode_["Wire1.begin()"] = "Wire1.begin();"
  Blockly.Arduino.setupCode_["mpu.begin()"] = "mpu.begin(0x68, &Wire1);";
  Blockly.Arduino.setupCode_["mpu.setAccelerometerRange()"] = "mpu.setAccelerometerRange(MPU6050_RANGE_8_G);";
  Blockly.Arduino.loopCodeOnce_["mpu.getEvent"] = "mpu.getEvent(&a, &g, &temp);"
  switch (dropdown) {
    case "accelerationX":
      code = "a.acceleration.x";
      break;
    case "accelerationY":
      code = "a.acceleration.y";
      break;
    case "accelerationZ":
      code = "a.acceleration.z";
      break;
    case "gyroscopeX":
      code = "g.gyro.x";
      break;
    case "gyroscopeY":
      code = "g.gyro.y";
      break;
    case "gyroscopeZ":
      code = "g.gyro.z";
      break;
    case "temperature":
      code = "temp.temperature";
      break;
    default:
      code = "";
  }
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};
