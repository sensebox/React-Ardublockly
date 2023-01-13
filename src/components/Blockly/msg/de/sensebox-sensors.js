export const SENSORS = {
  /**
   * Sensors
   * ---------------------------------------------------
   *
   */

  /**
   * BMP280
   */
  senseBox_pressure_sensor: "Luftdruck-/Temperatursensor (BMP280)",
  senseBox_pressure: "Luftdruck in hPa",
  senseBox_pressure_dimension: "Luftdruck in hPa",
  senseBox_pressure_tooltip:
    "Schließe den Sensor an einen der 5 **I2C-Anschlüsse** an. Der Sensor gibt dir den Messwert für den Luftdruck in hPa. Um die korrekte Höhe über NN zu berechnen benötigt der Sensor einen aktuellen Referenzwert.",
  senseBox_pressure_referencePressure: "Luftdruck auf NN",
  senseBox_pressure_referencePressure_dim: "hPa",
  senseBox_pressure_helpurl:
    "https://docs.sensebox.de/hardware/sensoren-luftdruck-temperatur/",

  /**
   * DPS310
   */
  senseBox_sensor_dps310: "Luftdruck-/Temperatursensor (DPS310)",
  senseBox_sensor_dps310_tooltip:
    "Schließe den Sensor an einen der 5 **I2C-Anschlüsse** an. Der Sensor gibt dir den Messwert für den Luftdruck in hPa. Um die korrekte Höhe über NN zu berechnen benötigt der Sensor einen aktuellen Referenzwert.",
  senseBox_sensor_dps310_helpurl: "",

  /**
   * Mikro
   */
  senseBox_sound: "Mikrofon",
  senseBox_sound_tip:
    "Schließe den Sensor über das Breadbord an einen der 3 **analog/digital** Ports an. Gibt den Messwert des Mikrofons in Volt zurück",
  senseBox_sound_helpurl: "https://docs.sensebox.de/hardware/sensoren-mikro/",

  /**
   * Temperature and Humidity Sensor (HDC1080)
   */
  senseBox_temp: "Temperatur in °C",
  senseBox_temp_hum: "Temperatur-/Luftfeuchtigkeitssensor (HDC1080)",
  senseBox_temp_hum_tooltip:
    "Dieser Block gibt dir die Messwerte des Temperatur- und Luftfeuchtigkeitssensor zurück. Schließe den Sensor an einen der 5 I2C Anschlüsse an. Messwert wird mit 2 Nachkommastellen ausgegeben.",
  senseBox_temp_hum_helpurl:
    "https://docs.sensebox.de/hardware/sensoren-temperatur-luftfeuchte/",

  /**
   * Ultraschalldistanzsensor
   */

  senseBox_ultrasonic: "Ultraschall-Abstandssensor an Port",
  senseBox_ultrasonic_trigger: "Trigger",
  senseBox_ultrasonic_echo: "Echo",
  senseBox_ultrasonic_maxDistance: "Maximale Distanz",
  senseBox_ultrasonic_port_A: "A",
  senseBox_ultrasonic_port_B: "B",
  senseBox_ultrasonic_port_C: "C",
  senseBox_ultrasonic_tooltip: `Misst die Distanz mithilfe von Ultraschall in cm. Schließe den Sensor an einen der drei Digital/Analog Ports an:

- Trigger: Grünes Kabel
- Echo: gelbes Kabel
Wenn die maximale Distanz überschritten wird, wird ein Wert von **O** ausgegeben`,
  senseBox_ultrasonic_helpurl:
    "https://docs.sensebox.de/hardware/sensoren-distanz/",
  /**
   * UV and Lightsensor
   */
  senseBox_value: "Messwert:",
  senseBox_uv_light: "Helligkeit-/UV-Sensor",
  senseBox_uv_light_tooltip:
    "Sensor misst UV-Licht oder die Helligkeit. Die Helligkeit wird als **Ganzezahl** in Lux ausgegeben. Die UV-Intensität als **Kommazahl** in µW/cm².",
  senseBox_uv: "UV-Intensität in µW/cm²",
  senseBox_light: "Beleuchtungsstärke in Lux",
  senseBox_uv_light_helpurl:
    "https://docs.sensebox.de/hardware/sensoren-helligkeit-uv/",

  /**
   * BMX055
   */

  senseBox_bmx055_compass: "Lage Sensor",
  senseBox_bmx055_accelerometer: "Beschleunigungssensor",
  senseBox_bmx055_accelerometer_range: "Messbereich",
  senseBox_bmx055_accelerometer_range_2g: "2g",
  senseBox_bmx055_accelerometer_range_4g: "4g",
  senseBox_bmx055_accelerometer_range_8g: "8g",
  senseBox_bmx055_accelerometer_range_16g: "16g",
  senseBox_bmx055_accelerometer_direction: "Richtung",
  senseBox_bmx055_accelerometer_direction_x: "X-Achse",
  senseBox_bmx055_accelerometer_direction_y: "Y-Achse",
  senseBox_bmx055_accelerometer_direction_z: "Z-Achse",
  senseBox_bmx055_accelerometer_direction_total: "Gesamt",
  senseBox_bmx055_gyroscope: "Lage Sensor",
  senseBox_bmx055_accelerometer_tip: "Lage Sensor",
  senseBox_bmx055_compass_tip: "Lage Sensor",
  senseBox_bmx055_gyroscope_tip: "Lage Sensor",
  senseBox_bmx055_x: "X-Richtung",
  senseBox_bmx055_y: "Y-Richtung",
  senseBox_bmx055_accelerometer_tooltip: `Dieser Block gibt dir den Messwert des Beschleunigungssensors der direkt auf der senseBox MCU aufgelötet ist. Im Dropdown Menü kannst du die Richtung und den Messbereich auswählen.`,
  senseBox_bmx055_helpurl: "",

  /**
   *
   * GPS
   */
  senseBox_gps_getValues: "GPS Modul",
  senseBox_gps_lat: "Breitengrad",
  senseBox_gps_lng: "Längengrad",
  senseBox_gps_alt: "Höhe über NN in m",
  senseBox_gps_speed: "Geschwindigkeit in km/h",
  senseBox_gps_date: "Datum",
  senseBox_gps_time: "Uhrzeit",
  senseBox_gps_timeStamp: "Zeitstempel (RFC 3339)",
  senseBox_gps_tooltip: `Liest das GPS Modul aus und gibt dir die Standortinformationen. Längen- und Breitengrad werden als Kommazahl mit 6 Nachkommastellen ausgegeben. 
**Anschluss: I2C**

**Beachte:** Das GPS Modul benöigt beim ersten Verwenden relativ lange (ca. 5-10 Minuten) bis es deinen Standort gefunden hat!
`,
  senseBox_gps_helpurl: "https://docs.sensebox.de/hardware/sensoren-gps/",

  /**
   * Windspeed
   */
  senseBox_windspeed: "Windgeschwindigkeitssensor",
  senseBox_windspeed_tooltip: "",

  /*
   * Soundsensor
   */
  senseBox_soundsensor_dfrobot: "Soundsensor (DF Robot)",
  senseBox_soundsensor_dfrobot_tooltip:
    "Schließe den Sensor an einen der 3 **digital/analog Ports** an. Der Sensor gibt dir den Messwert in dB mit einer Nachkommastelle",
  senseBox_soundsensor_dfrobot_helpurl:
    "https://docs.sensebox.de/hardware/sensoren-lautstaerke/",
  /*
   * BME680
   */

  senseBox_bme680: "Umweltsensor (BME680)",
  senseBox_bme_iaq: "Innenraumluftqualität (IAQ)",
  senseBox_bme_iaq_accuracy: "Kalibrierungswert",
  senseBox_bme_co2: "CO2 Äquivalent",
  senseBox_bme_pressure: "Luftdruck in Pa",
  senseBox_bme_breatheVocEquivalent: "Atemluft VOC Äquivalent",
  senseBox_bme_tooltip: `Schließe den Umweltsensor an einen der 5 **I2C-Anschlüsse** an. **Beachte:** Der Sensor benöigt eine gewisse Zeit zum kalibrieren. 
Den Status der Kalibrierung kann über den Kalibrierungswert abgelesen werden. Er ist entweder 0, 1, 2 oder 3 und sagt folgendes aus:

- IAQ Accuracy : 0 heißt Sensor wird stabilisiert (dauert ca. 25 Minuten) oder dass es eine Zeitüberschreitung gab,
- IAQ Accuracy : 1 heißt Wert ist ungenau,
- IAQ Accuracy : 2 heißt Sensor wird kalibriert,
- IAQ Accuracy : 3 heißt Sensor erfolgreich kalibriert.

Die Messwerte für Temperatur, Luftfeuchtigkeit und Luftdruck können direkt verwendet werden.`,
  senseBox_bme680_helpurl:
    "https://docs.sensebox.de/hardware/sensoren-umweltsensor/",

  /**
   * Truebner SMT50
   */
  senseBox_smt50: "Bodenfeuchte/-temperatur (SMT50)",
  senseBox_smt50_helpurl:
    "https://docs.sensebox.de/hardware/sensoren-truebner/",
  senseBox_smt50_tooltip:
    "Schließe den Bodenfeuchtigkeit- und Temperatursensor an einen der 3 digital/analog Ports an und wähle den Port im Block aus. Der Sensor gibt die Bodentemperatur in °C und die Bodenfeuchtigkeit in % aus.",

  /**
   * SCD30 CO2 Sensor
   */
  senseBox_scd30: "CO2 Sensor (Sensirion SCD30)",
  senseBox_scd_tooltip:
    "Schließe den Sensor an einen der 5 **I2C-Anschlüsse** an. Der Sensor gibt dir den Messwert für die CO2-Konzentration in ppm. Der Temperaturmesswert kann aufgrund der Messung direkt am Sensor um einige Grad vom realen Wert abweichen.",
  senseBox_scd_co2: "CO2 in ppm",
  senseBox_scd_helpurl: "https://docs.sensebox.de/hardware/sensoren-co2/",

  /**
   * Feinstaubsensor (SDS011)
   */

  senseBox_sds011: "Feinstaubsensor SDS011",
  senseBox_sds011_dimension: "in µg/m³ an",
  senseBox_sds011_pm25: "PM2.5",
  senseBox_sds011_pm10: "PM10",
  senseBox_sds011_tooltip:
    "Dieser Block gibt dir den Messwert des Feinstaubsensor. Schließe den Feinstaubsensor an einen der 2 **Serial/UART** Anschlüssen an. Im Dropdown Menü zwischen PM2.5 und PM10 auswählen. Der Messwert wird dir als **Kommazahl** in µg/m3",
  senseBox_sds011_serial1: "Serial1",
  senseBox_sds011_serial2: "Serial2",
  senseBox_sds011_helpurl:
    "https://docs.sensebox.de/hardware/sensoren-feinstaub/",

  /**
   * Button
   */
  senseBox_button: "Button",
  senseBox_button_isPressed: "ist gedrückt",
  senseBox_button_switch: "als Schalter",
  senseBox_button_wasPressed: "wurde gedrückt",
  senseBox_button_longPress: "Gedrückt für",

  senseBox_button_tooltip: `Dieser Block gibt dir den Status des angeschlossenen Buttons. Im Dropdown Menü können verschiedene Modi für den Button ausgewählt werden. Angesteuert können entweder der on Board Button oder ein Button, der an einen der 6 digitalen Pins angeschlossen ist. verschiedene Modi:
- "ist gedrückt": Mit diesem Modus kannst du abfragen ob der Block gerade gedrückt wird. Du erhältst entweder den Wert TRUE oder FALSE.
- "wurde gedrückt": Mit diesem Modus kannst du abfragen ob der Block gedrückt wurde. Erst wenn der Knopf gedrückt und wieder losgelassen wurde erhältst du TRUE zurück
- "als Schalter": Wenn du diesen Block verwendest kannst du den Knopf wie ein Lichtschalter verwenden. Der Status wird gespeichert bis der Button erneut gedrückt wird`,
  senseBox_button_helpurl: "",



  /**
   * Feinstaubsensor Sensirion SPS30
   */

   senseBox_sps30: "Feinstaubsensor Sensirion SPS30",
   senseBox_sps30_dimension: "in µg/m³",
   senseBox_sps30_1p0: "PM1.0",
   senseBox_sps30_2p5: "PM2.5",
   senseBox_sps30_4p0: "PM4.0",
   senseBox_sps30_10p0: "PM10",
   senseBox_sps30_tooltip:"Dieser Block gibt dir den Messwert des Sensirion SPS30 Feinstaubsensor. Schließe den Feinstaubsensor an einen der 5 **I2C** Anschlüssen an. Im Dropdown Menü zwischen PM1.0, PM2.5, PM4.0 und PM10 auswählen. Der Messwert wird dir als **Kommazahl** in µg/m3",
    senseBox_sps30_helpurl:
     "https://docs.sensebox.de/hardware/sensoren-feinstaub/",
 


    };