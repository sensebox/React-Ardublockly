export const SENSORS = {
  /**
   * Sensors
   * ---------------------------------------------------
   *
   */

  /**
   * BMP280
   */
  senseBox_pressure_sensor: "Airpressure/Temperature Sensor (BMP280)",
  senseBox_pressure: "Airpressure in hPa",
  senseBox_pressure_dimension: "Airpressure in hPa",
  senseBox_pressure_tooltip:
    "Connect the sensor to one of the 5 **I2C ports**. The sensor gives you the measured value for the air pressure in hPa. To calculate the correct altitude above sea level the sensor needs a current reference value.",
  senseBox_pressure_referencePressure: "Pressure at Sea Level",
  senseBox_pressure_referencePressure_dim: "hPa",
  senseBox_pressure_helpurl: "",

  /**
   * DPS310
   */
  senseBox_sensor_dps310: "Airpressure/Temperature Sensor (DPS310)",
  senseBox_sensor_dps310_tooltip:
    "Connect the sensor to one of the 5 **I2C ports**. The sensor gives you the measured value for the air pressure in hPa. To calculate the correct altitude above sea level the sensor needs a current reference value.",

  /**
   * Mikro
   */
  senseBox_sound: "Microphone",
  senseBox_sound_tip:
    "Connect the sensor to one of the 3 **analog/digital** ports via the breadbord. Returns the reading of the microphone in volt",
  senseBox_sound_helpurl:
    "https://en.docs.sensebox.de/hardware/sensoren-mikro/",

  /**
   * Temperature and Humidity Sensor (HDC1080)
   */
  senseBox_temp: "Temperature in °C",
  senseBox_temp_hum: "Temperature/Humidity Sensor (HDC1080)",
  senseBox_temp_hum_tooltip:
    "This block returns the temperature and humidity sensor readings. Connect the sensor to one of the 5 I2C ports. Measured value is output with 2 decimal places.",
  senseBox_temp_hum_helpurl:
    "https://en.docs.sensebox.de/hardware/sensoren-temperatur-luftfeuchte/",
  senseBox_hum: "humidity in %",
  senseBox_hum_tip: "Measures humidity in %",

  /**
   * Ultraschalldistanzsensor
   */

  senseBox_ultrasonic: "Ultrasonic distance sensor at Port",
  senseBox_ultrasonic_trigger: "Trigger",
  senseBox_ultrasonic_echo: "Echo",
  senseBox_ultrasonic_maxDistance: "Max distance",
  senseBox_ultrasonic_port_A: "A",
  senseBox_ultrasonic_port_B: "B",
  senseBox_ultrasonic_port_C: "C",
  senseBox_ultrasonic_tooltip: `Measures the distance using ultrasound in cm. Connect the sensor to one of the three digital/analog ports:
- Trigger: Green Cable
- Echo: Yellow Cable
If the max distance is reached the a value of **O** will be returned`,
  senseBox_ultrasonic_helpurl:
    "https://en.docs.sensebox.de/hardware/sensoren-distanz/",

  /**
   * UV and Lightsensor
   */
  senseBox_uv: "UV-Light in µW/cm²",
  senseBox_uv_light: "Light Visible + UV",
  senseBox_value: "Value:",
  senseBox_uv_light_tooltip:
    "Sensor measures UV light or brightness. Brightness is output as **integer** in lux. UV intensity as **decimal** in µW/cm².",
  senseBox_light: "Illuminance in Lux",
  senseBox_uv_light_helpurl:
    "https://en.docs.sensebox.de/hardware/sensoren-helligkeit-uv/",

  /**
   * BMX055
   */

  senseBox_bmx055_compass: "Lage Sensor",
  senseBox_bmx055_accelerometer: "Accelerometer",
  senseBox_bmx055_accelerometer_range: "Range",
  senseBox_bmx055_accelerometer_range_2g: "2g",
  senseBox_bmx055_accelerometer_range_4g: "4g",
  senseBox_bmx055_accelerometer_range_8g: "8g",
  senseBox_bmx055_accelerometer_range_16g: "16g",
  senseBox_bmx055_accelerometer_direction: "Direction",
  senseBox_bmx055_accelerometer_direction_x: "X-Axis",
  senseBox_bmx055_accelerometer_direction_y: "Y-Axis",
  senseBox_bmx055_accelerometer_direction_z: "Z-Axis",
  senseBox_bmx055_accelerometer_direction_total: "Total",
  senseBox_bmx055_gyroscope: "Gyroscope",

  senseBox_bmx055_compass_tip: "Lage Sensor",
  senseBox_bmx055_gyroscope_tip: "Lage Sensor",
  senseBox_bmx055_x: "X-Direction",
  senseBox_bmx055_y: "Y-Direction",
  senseBox_bmx055_accelerometer_tooltip: `This block gives you the measurement value of the accelerometer which is soldered directly on the senseBox MCU. In the dropdown menu you can select the direction and the measuring range.`,
  senseBox_bmx055_helpurl: "",

  /**
   *
   * GPS
   */
  senseBox_gps_getValues: "GPS Modul",
  senseBox_gps_lat: "latitude",
  senseBox_gps_lng: "longitude",
  senseBox_gps_alt: "altitude in m",
  senseBox_gps_speed: "speed in km/h",
  senseBox_gps_date: "date",
  senseBox_gps_time: "time",
  senseBox_gps_timeStamp: "Timestamp (RFC 3339)",
  senseBox_gps_tooltip: `Reads the GPS module and gives you the location information. Longitude and latitude are output as a decimal number with 6 decimal places. 
**Connection: I2C**

**Note:** The GPS module needs a relatively long time (about 5-10 minutes) until it has found your location!
`,
  senseBox_gps_helpurl: "https://en.docs.sensebox.de/hardware/sensoren-gps/",

  /**
   * Windspeed
   */
  senseBox_windspeed: "Windspeedsensor",
  senseBox_windspeed_tooltip: "",

  /*
   * Soundsensor
   */
  senseBox_soundsensor_dfrobot: "Soundsensor (DF Robot)",
  senseBox_soundsensor_dfrobot_tooltip:
    "Connect the sensor to one of the 3 **digital/analog ports**. The sensor will give you the reading in dB with one decimal.",
  senseBox_soundsensor_dfrobot_helpurl:
    "https://en.docs.sensebox.de/hardware/sensoren-lautstaerke/",

  /*
   * BME680
   */

  senseBox_bme680: "Environmental sensor (BME680)",
  senseBox_bme_iaq: "Indoor Air Quality (IAQ)",
  senseBox_bme_iaq_accuracy: "Calibration Value",
  senseBox_bme_pressure: "Airpressure in Pa",
  senseBox_bme_co2: "CO2 Equivalent",
  senseBox_bme_breatheVocEquivalent: "Breathe VOC Equivalent",
  senseBox_bme_tooltip: `Connect the environmental sensor to one of the 5 **I2C ports**. **Note:** The sensor needs some time to calibrate. 
The status of the calibration can be read from the calibration value. It is either 0, 1, 2 or 3 and says the following:

- IAQ Accuracy : 0 means sensor is stabilized (takes about 25 minutes) or that there was a timeout,
- IAQ Accuracy : 1 means value is inaccurate,
- IAQ Accuracy : 2 means sensor is being calibrated,
- IAQ Accuracy : 3 means sensor calibrated successfully.

The measured values for temperature, humidity and air pressure can be used directly,`,
  senseBox_bme680_helpurl:
    "https://en.docs.sensebox.de/hardware/sensoren-umweltsensor/",

  /**
   * Truebner SMT50
   */
  senseBox_smt50: "Soil Moisture and Temperature (SMT50)",
  senseBox_smt50_helpurl:
    "https://docs.sensebox.de/hardware/sensoren-truebner/",
  senseBox_smt50_tooltip:
    "Schließe den Bodenfeuchtigkeit- und Temperatursensor an einen der 3 digital/analog Ports an und wähle den Port im Block aus. Der Sensor gibt die Bodentemperatur in °C und die Bodenfeuchtigkeit in % aus.",

  /**
   * SCD30 CO2 Sensor
   */
  senseBox_scd30: "CO2 Sensor (Sensirion SCD30)",
  senseBox_scd_tooltip:
    "Connect the sensor to one of the 5 **I2C ports**. The sensor will give you the reading for the CO2 concentration in ppm. The temperature reading may differ from the real value by a few degrees due to the measurement directly at the sensor.",
  senseBox_scd_co2: "CO2 in ppm",
  senseBox_scd_helpurl: "https://en.docs.sensebox.de/hardware/sensoren-co2/",
  /**
   * Feinstaubsensor (SDS011)
   */
  senseBox_sds011: "Fine Particular Sensor",
  senseBox_sds011_dimension: "in µg/m³ at",
  senseBox_sds011_pm25: "PM2.5",
  senseBox_sds011_pm10: "PM10",
  senseBox_sds011_tooltip:
    "This block gives you the reading of the fine dust sensor. Connect the fine dust sensor to one of the 2 **Serial/UART** ports. Select between PM2.5 and PM10 in the dropdown menu. The measured value will be displayed as **comma number** in µg/m3",
  senseBox_sds011_serial1: "Serial1",
  senseBox_sds011_serial2: "Serial2",
  senseBox_sds011_helpurl:
    "https://en.docs.sensebox.de/hardware/sensoren-feinstaub/",

  /**
   * Button
   */
  senseBox_button: "Button",
  senseBox_button_isPressed: "is Pressed",
  senseBox_button_switch: "as Switch",
  senseBox_button_wasPressed: "was Pressed",
  senseBox_button_longPress: "Pressed for",
  senseBox_button_tooltip: `This block gives you the status of the connected button. In the dropdown menu you can select different modes for the button. Either the on board button or a button connected to one of the 6 digital pins can be controlled. different modes:
- "is pressed": With this mode you can check if the block is currently pressed. You get either the value TRUE or FALSE.
- "was pressed": With this mode you can query if the block was pressed. Only if the button was pressed and released you will get TRUE.
- "as switch": If you use this block you can use the button like a light switch. The status is saved until the button is pressed again.
`,
  senseBox_button_helpurl: "",

  /**
   *
   */
  senseBox_watertemperature: "Water Temperature",


    /**
   * Feinstaubsensor Sensirion SPS30
   */

     senseBox_sps30: "Particulate Matter Sensor (Sensirion SPS30)",
     senseBox_sps30_dimension: "in µg/m³",
     senseBox_sps30_1p0: "PM1.0",
     senseBox_sps30_2p5: "PM2.5",
     senseBox_sps30_4p0: "PM4.0",
     senseBox_sps30_10p0: "PM10",
     senseBox_sps30_tooltip:
     "This block gives you the measured value of the Sensirion SPS30 fine dust sensor. Connect the fine dust sensor to one of the 5 **I2C** connectors. Select between PM1.0, PM2.5, PM4.0 and PM10 in the dropdown menu. The measured value will be displayed as **decimal** in µg/m3",
     senseBox_sps30_helpurl:
       "https://docs.sensebox.de/hardware/sensoren-feinstaub/",
   
  

};
