import Blockly from 'blockly';

/**
 * HDC1080 Temperature and Humidity Sensor
 * 
 */

Blockly.Arduino.sensebox_sensor_temp_hum = function () {
  var dropdown_name = this.getFieldValue('NAME');
  Blockly.Arduino.libraries_['library_senseBoxMCU'] = '#include "SenseBoxMCU.h"';
  Blockly.Arduino.definitions_['define_hdc'] = 'HDC1080 hdc;';
  Blockly.Arduino.setupCode_['sensebox_sensor_temp_hum'] = 'hdc.begin();';
  var code = 'hdc.get' + dropdown_name + '()';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

/**
 * VEML 6070 and TSL4513 UV-Light/Illuminance Sensor
 * 
 */

Blockly.Arduino.sensebox_sensor_uv_light = function () {
  var dropdown_name = this.getFieldValue('NAME');
  let code = '';
  Blockly.Arduino.libraries_['library_senseBoxMCU'] = '#include "SenseBoxMCU.h"';
  if (dropdown_name === 'UvIntensity') {
    Blockly.Arduino.definitions_['define_veml'] = 'VEML6070 veml;'
    Blockly.Arduino.setupCode_['sensebox_sensor_uv_light'] = 'veml.begin();'
    code = 'veml.get' + dropdown_name + '()';
  }
  // if (dropdown_name === 'Illuminance') {
  //   Blockly.Arduino.definitions_['define_tsl'] = 'TSL45315 tsl;'
  //   Blockly.Arduino.setupCode_['sensebox_sensor_illuminance'] = 'tsl.begin();'
  //   code = 'tsl.get' + dropdown_name + '()';
  // }
  if (dropdown_name === 'Illuminance') {
    Blockly.Arduino.definitions_['define_lightsensor'] = 'Lightsensor lightsensor;'
    Blockly.Arduino.setupCode_['sensebox_sensor_illuminance'] = 'lightsensor.begin();'
    code = 'lightsensor.get' + dropdown_name + '()';
  }

  return [code, Blockly.Arduino.ORDER_ATOMIC];
};




/**
 * BMX055 Accelerometer
 * 
 */

Blockly.Arduino.sensebox_sensor_bmx055_accelerometer = function () {
  var dropdown_value = this.getFieldValue('VALUE');
  var range = this.getFieldValue('RANGE');
  Blockly.Arduino.libraries_['library_senseBoxMCU'] = '#include "SenseBoxMCU.h"';
  Blockly.Arduino.definitions_['define_bmx'] = 'BMX055 bmx;';
  Blockly.Arduino.setupCode_['sensebox_sensor_bmx055'] = 'bmx.beginAcc(' + range + ');';
  var code = 'bmx.getAcceleration' + dropdown_value + '()';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

/**
 * SDS011 Fine Particlar Matter
 * 
 */

Blockly.Arduino.sensebox_sensor_sds011 = function () {
  var dropdown_name = this.getFieldValue('NAME');
  var serial_name = this.getFieldValue('SERIAL');
  Blockly.Arduino.libraries_['library_senseBoxMCU'] = '#include "SenseBoxMCU.h"';
  Blockly.Arduino.codeFunctions_['define_sds011'] = 'SDS011 my_sds(' + serial_name + ');';
  Blockly.Arduino.variables_['variables_sds011'] = 'float p10,p25;\n';
  Blockly.Arduino.setupCode_['sensebox_sensor_sds011'] = serial_name + '.begin(9600);';
  var code = 'my_sds.get' + dropdown_name + '()';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

/**
 * BMP280 Pressure Sensor
 * 
 */

Blockly.Arduino.sensebox_sensor_pressure = function () {
  var dropdown_name = this.getFieldValue('NAME');
  var code = '';
  var referencePressure = this.getFieldValue('referencePressure');
  Blockly.Arduino.libraries_['library_senseBoxMCU'] = '#include "SenseBoxMCU.h"';
  Blockly.Arduino.definitions_['define_pressure'] = 'BMP280 bmp_sensor;';
  Blockly.Arduino.setupCode_['sensebox_bmp_sensor'] = 'bmp_sensor.begin();';
  if (dropdown_name === 'Pressure' || dropdown_name === 'Temperature') {
    code = 'bmp_sensor.get' + dropdown_name + '()';
  }
  else if (dropdown_name === 'Altitude') {
    code = 'bmp_sensor.getAltitude(' + referencePressure + ')';
  }
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};


/**
 * BME680 Environmental Sensor
 * 
 */


Blockly.Arduino.sensebox_sensor_bme680_bsec = function () {
  var dropdown_name = this.getFieldValue('dropdown');
  let code = '';
  Blockly.Arduino.libraries_['library_bsec'] = '#include "bsec.h"';
  Blockly.Arduino.definitions_['bsec_iaqSensor'] = 'Bsec iaqSensor;'
  Blockly.Arduino.variables_['bmeTemperatur'] = 'float bmeTemperatur;';
  Blockly.Arduino.variables_['bmeHumidity'] = 'float bmeHumidity;';
  Blockly.Arduino.variables_['bmePressure'] = 'double bmePressure;';
  Blockly.Arduino.variables_['bmeIAQ'] = 'float bmeIAQ;';
  Blockly.Arduino.variables_['bmeIAQAccuracy'] = 'float bmeIAQAccuracy;';
  Blockly.Arduino.variables_['bmeCO2'] = 'int bmeCO2;';
  Blockly.Arduino.variables_['bmeBreathVocEquivalent'] = 'float bmeBreathVocEquivalent;'

  Blockly.Arduino.functionNames_['checkIaqSensorStatus'] = `
    void checkIaqSensorStatus(void)
  {
    if (iaqSensor.status != BSEC_OK) {
      if (iaqSensor.status < BSEC_OK) {
        for (;;)
          errLeds(); /* Halt in case of failure */
      } 
    }
  
    if (iaqSensor.bme680Status != BME680_OK) {
      if (iaqSensor.bme680Status < BME680_OK) {
        for (;;)
          errLeds(); /* Halt in case of failure */
      } 
    }
  }
  `;
  Blockly.Arduino.functionNames_['errLeds'] = `
  void errLeds(void)
  {
    pinMode(LED_BUILTIN, OUTPUT);
    digitalWrite(LED_BUILTIN, HIGH);
    delay(100);
    digitalWrite(LED_BUILTIN, LOW);
    delay(100);
  }`;
  //Setup Code
  Blockly.Arduino.setupCode_['Wire.begin'] = 'Wire.begin();';
  Blockly.Arduino.setupCode_['iaqSensor.begin'] = 'iaqSensor.begin(BME680_I2C_ADDR_PRIMARY, Wire);';
  Blockly.Arduino.setupCode_['checkIaqSensorStatus'] = 'checkIaqSensorStatus();';
  Blockly.Arduino.setupCode_['bsec_sensorlist'] = `
    bsec_virtual_sensor_t sensorList[10] = {
      BSEC_OUTPUT_RAW_TEMPERATURE,
      BSEC_OUTPUT_RAW_PRESSURE,
      BSEC_OUTPUT_RAW_HUMIDITY,
      BSEC_OUTPUT_RAW_GAS,
      BSEC_OUTPUT_IAQ,
      BSEC_OUTPUT_STATIC_IAQ,
      BSEC_OUTPUT_CO2_EQUIVALENT,
      BSEC_OUTPUT_BREATH_VOC_EQUIVALENT,
      BSEC_OUTPUT_SENSOR_HEAT_COMPENSATED_TEMPERATURE,
      BSEC_OUTPUT_SENSOR_HEAT_COMPENSATED_HUMIDITY,
    };
    `;
  Blockly.Arduino.setupCode_['iaqSensorUpdateSubscription'] = 'iaqSensor.updateSubscription(sensorList, 10, BSEC_SAMPLE_RATE_LP);\ncheckIaqSensorStatus();';
  //Loop Code
  Blockly.Arduino.loopCodeOnce_['iaqloop'] = `
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
    case 'temperature':
      code = 'bmeTemperatur';
      break;
    case 'humidity':
      code = 'bmeHumidity';
      break;
    case 'pressure':
      code = 'bmePressure'
      break;
    case 'IAQ':
      code = 'bmeIAQ';
      break;
    case 'IAQAccuracy':
      code = 'bmeIAQAccuracy';
      break;
    case 'CO2':
      code = 'bmeCO2';
      break;
    case 'breathVocEquivalent':
      code = 'bmeBreathVocEquivalent';
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
  var dropdown_pin_RX = this.getFieldValue('ultrasonic_trigger');
  var dropdown_pin_TX = this.getFieldValue('ultrasonic_echo');
  var port = this.getFieldValue('port');
  Blockly.Arduino.libraries_['library_senseBoxMCU'] = '#include "SenseBoxMCU.h"';
  Blockly.Arduino.definitions_['var_ultrasonic' + port] = 'Ultrasonic Ultrasonic' + port + '(' + dropdown_pin_RX + ',' + dropdown_pin_TX + ');';
  var code;
  code = 'Ultrasonic' + port + '.getDistance()';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

/**
 * Microphone
 * 
 */

Blockly.Arduino.sensebox_sensor_sound = function () {
  var dropdown_pin = this.getFieldValue('PIN');
  Blockly.Arduino.libraries_['library_senseBoxMCU'] = '#include "SenseBoxMCU.h"';
  Blockly.Arduino.definitions_['define_microphone'] = 'Microphone microphone(' + dropdown_pin + ');'
  var code = 'microphone.getValue()';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};


/**
 * Button
 * 
 */


Blockly.Arduino.sensebox_button = function () {
  var dropdown_pin = this.getFieldValue('PIN');
  var dropown_function = this.getFieldValue('FUNCTION');
  Blockly.Arduino.libraries_['library_senseBoxMCU'] = '#include "SenseBoxMCU.h"';
  Blockly.Arduino.definitions_['define_button' + dropdown_pin + ''] = 'Button button_' + dropdown_pin + '(' + dropdown_pin + ');';
  Blockly.Arduino.setupCode_['setup_button' + dropdown_pin + ''] = 'button_' + dropdown_pin + '.begin();';
  var code = '';
  if (dropown_function === 'isPressed') {
    code = 'button_' + dropdown_pin + '.isPressed()';
  }
  else if (dropown_function === 'Switch') {
    code = 'button_' + dropdown_pin + '.getSwitch()';
  }
  else if (dropown_function === 'wasPressed') {
    code = 'button_' + dropdown_pin + '.wasPressed()';
  }
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

/**
 * SCD30 CO2 Sensor
 * 
 */

Blockly.Arduino.sensebox_scd30 = function () {
  var dropdown = this.getFieldValue('dropdown');
  Blockly.Arduino.libraries_['scd30_library'] = '#include "SparkFun_SCD30_Arduino_Library.h"'
  Blockly.Arduino.libraries_['library_senseBoxMCU'] = '#include "SenseBoxMCU.h"';
  Blockly.Arduino.definitions_['SCD30'] = 'SCD30 airSensor;';
  Blockly.Arduino.setupCode_['init_scd30'] = ` Wire.begin();
  if (airSensor.begin() == false)
  {
    while (1)
      ;
  }`;
  var code = '';
  switch (dropdown) {
    case 'temperature':
      code = 'airSensor.getTemperature()';
      break;
    case 'humidity':
      code = 'airSensor.getHumiditiy()';
      break;
    case 'CO2':
      code = 'airSensor.getCO2()';
      break;
    default:
      code = ''
  }
  return [code, Blockly.Arduino.ORDER_ATOMIC];

}


/**
 * GPS Module
 * 
 */

Blockly.Arduino.sensebox_gps = function () {
  var dropdown = this.getFieldValue('dropdown');
  Blockly.Arduino.libraries_['gps_library'] = '#include <SparkFun_u-blox_GNSS_Arduino_Library.h>'
  Blockly.Arduino.libraries_['library_wire'] = '#include <Wire.h>';
  Blockly.Arduino.libraries_['library_senseBoxMCU'] = '#include "SenseBoxMCU.h"';
  Blockly.Arduino.definitions_['GPS'] = 'SFE_UBLOX_GNSS myGNSS;';
  Blockly.Arduino.setupCode_['init_gps'] = ` Wire.begin();

  if (myGNSS.begin() == false) //Connect to the Ublox module using Wire port
  {
    Serial.println(F("Ublox GPS not detected at default I2C address. Please check wiring. Freezing."));
    while (1);
  }

  myGNSS.setI2COutput(COM_TYPE_UBX); //Set the I2C port to output UBX only (turn off NMEA noise)
  myGNSS.saveConfiguration(); //Save the current settings to flash and BBR`;
  var code = '';
  switch (dropdown) {
    case 'latitude':
      code = 'myGNSS.getLatitude()';
      break;
    case 'longitude':
      code = 'myGNSS.getLongitude()';
      break;
    case 'altitude':
      code = 'myGNSS.getAltitudeMSL()';
      break;
    case 'pDOP':
      code = 'myGNSS.getPDOP()';
      break;
    case 'fixType':
      code = 'myGNSS.getFixType()';
      break;
    default:
      code = ''
  }
  return [code, Blockly.Arduino.ORDER_ATOMIC];

}

/**
 * Block for Truebner STM50
 */


Blockly.Arduino.sensebox_sensor_truebner_smt50 = function () {
  var dropdown_port = this.getFieldValue('Port')
  var dropdown_value = this.getFieldValue('value');
  var dropdown_pin = 1;
  var code = '';
  if (dropdown_value === 'temp') {
    if (dropdown_port === 'A') {
      dropdown_pin = 1;
    }
    if (dropdown_port === 'B') {
      dropdown_pin = 3;
    }
    if (dropdown_port === 'C') {
      dropdown_pin = 5;
    }
    Blockly.Arduino.codeFunctions_['sensebox_smt50_temp'] = 'float getSMT50Temperature(int analogPin){\n  int sensorValue = analogRead(analogPin);\n  float voltage = sensorValue * (3.3 / 1024.0);\n   return (voltage - 0.5) * 100;\n}';
    code = 'getSMT50Temperature(' + dropdown_pin + ')';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
  }
  else if (dropdown_value === 'soil') {
    if (dropdown_port === 'A') {
      dropdown_pin = 2;
    }
    if (dropdown_port === 'B') {
      dropdown_pin = 4;
    }
    if (dropdown_port === 'C') {
      dropdown_pin = 6;
    }
    Blockly.Arduino.codeFunctions_['sensebox_smt50_soil'] = 'float getSMT50Moisture(int analogPin){\n   int sensorValue = analogRead(analogPin);\n    float voltage = sensorValue * (3.3 / 1024.0);\n   return (voltage * 50) / 3;\n}';
    code = 'getSMT50Moisture(' + dropdown_pin + ')';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
  }

};

/**
 * DS18B20 Watertemperature
 * 
 */

Blockly.Arduino.sensebox_sensor_watertemperature = function () {

  var dropdown_port = this.getFieldValue('Port');
  var dropdown_pin = 1;
  if (dropdown_port === 'A') {
    dropdown_pin = 1;
  }
  if (dropdown_port === 'B') {
    dropdown_pin = 3;
  }
  if (dropdown_port === 'C') {
    dropdown_pin = 5;
  }
  Blockly.Arduino.libraries_['library_oneWire'] = '#include "OneWire.h"';
  Blockly.Arduino.libraries_['library_oneDallasTemperature'] = '#include "DallasTemperature.h"';
  Blockly.Arduino.definitions_['define_OneWire'] = '#define ONE_WIRE_BUS ' + dropdown_pin + '\nOneWire oneWire(ONE_WIRE_BUS);\nDallasTemperature sensors(&oneWire);';
  Blockly.Arduino.setupCode_['sensebox_oneWireSetup'] = 'sensors.begin();';
  Blockly.Arduino.codeFunctions_['sensebox_requestTemp'] = 'float getWaterTemp(){\nsensors.requestTemperatures();\nsensors.getTempCByIndex(0);\n}';
  var code = 'getWaterTemp()';
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
  var dropdown_port = this.getFieldValue('Port');
  var dropdown_pin = 1;
  if (dropdown_port === 'A') {
    dropdown_pin = 1;
  }
  if (dropdown_port === 'B') {
    dropdown_pin = 3;
  }
  if (dropdown_port === 'C') {
    dropdown_pin = 5;
  }
  Blockly.Arduino.codeFunctions_['soundsensor'] = `    
float getSoundValue(){
  float v = analogRead(`+ dropdown_pin + `) * (3.3 / 1024.0);
  float decibel = v * 50;
  return decibel;
}`
  var code = 'getSoundValue()';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};