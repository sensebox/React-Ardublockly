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
  if (dropdown_name === 'Illuminance') {
    Blockly.Arduino.definitions_['define_tsl'] = 'TSL45315 tsl;'
    Blockly.Arduino.setupCode_['sensebox_sensor_illuminance'] = 'tsl.begin();'
    code = 'tsl.get' + dropdown_name + '()';
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
  Blockly.Arduino.variables_['scd30_temp'] = 'float scd30_temp;';
  Blockly.Arduino.variables_['scd30_humi'] = 'float scd30_humi;';
  Blockly.Arduino.variables_['scd30_co2'] = 'float scd30_co2;';
  Blockly.Arduino.setupCode_['init_scd30'] = ` Wire.begin();
  if (airSensor.begin() == false)
  {
    Serial.println("Air sensor not detected. Please check wiring. Freezing...");
    while (1)
      ;
  }`;
  Blockly.Arduino.loopCodeOnce_['scd30_getData'] = `if (airSensor.dataAvailable())
  {
   scd30_co2 = airSensor.getCO2();
   scd30_temp = airSensor.getTemperature();
   scd30_humi = airSensor.getHumidity();
  }`
  var code = '';
  switch (dropdown) {
    case 'temperature':
      code = 'scd30_temp';
      break;
    case 'humidity':
      code = 'scd30_humi';
      break;
    case 'CO2':
      code = 'scd30_co2';
      break;
    default:
      code = ''
  }
  return [code, Blockly.Arduino.ORDER_ATOMIC];

}