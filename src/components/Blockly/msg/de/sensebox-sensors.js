import Blockly from 'blockly';

/**
 * Sensors
 * ---------------------------------------------------
 * 
 */

/**
 * BMP280
 */
Blockly.Msg.senseBox_pressure_sensor = "Luftdruck-/Temperatursensor (BMP280)";
Blockly.Msg.senseBox_pressure = "Luftdruck in Pa";
Blockly.Msg.senseBox_pressure_dimension = "Luftdruck in Pa";
Blockly.Msg.senseBox_pressure_tip = "Schließe den Sensor an einen der 5 **I2C-Anschlüsse** an. Der Sensor gibt dir den Messwert für den Luftdruck in Pa. Um die korrekte Höhe über NN zu berechnen benötigt der Sensor einen aktuellen Referenzwert.";
Blockly.Msg.senseBox_pressure_referencePressure = "Luftdruck auf NN";
Blockly.Msg.senseBox_pressure_referencePressure_dim = "hPa";
Blockly.Msg.senseBox_pressure_helpurl = ""


/**
 * Mikro
 */
Blockly.Msg.senseBox_sound = "Mikrofon";
Blockly.Msg.senseBox_sound_tip = "Schließe den Sensor über das Breadbord an einen der 3 **analog/digital** Ports an. Gibt den Messwert des Mikrofons in Volt zurück";
Blockly.Msg.senseBox_sound_helpurl = "https://docs.sensebox.de/hardware/sensoren-mikro/"

/**
 * Temperature and Humidity Sensor (HDC1080)
 */
Blockly.Msg.senseBox_temp = "Temperatur in °C";
Blockly.Msg.senseBox_temp_hum = "Temperatur-/Luftfeuchtigkeitssensor (HDC1080)";
Blockly.Msg.senseBox_temp_hum_tooltip = "Dieser Block gibt dir die Messwerte des Temperatur- und Luftfeuchtigkeitssensor zurück. Schließe den Sensor an einen der 5 I2C Anschlüsse an. Messwert wird mit 2 Nachkommastellen ausgegeben.";
Blockly.Msg.senseBox_temp_hum_helpurl = "https://docs.sensebox.de/hardware/sensoren-temperatur-luftfeuchte/"

/**
 * Ultraschalldistanzsensor
 */

Blockly.Msg.senseBox_ultrasonic = "Ultraschall-Abstandssensor an Port";
Blockly.Msg.senseBox_ultrasonic_trigger = "Trigger"
Blockly.Msg.senseBox_ultrasonic_echo = "Echo"
Blockly.Msg.senseBox_ultrasonic_port_A = "A";
Blockly.Msg.senseBox_ultrasonic_port_B = "B";
Blockly.Msg.senseBox_ultrasonic_port_C = "C";
Blockly.Msg.senseBox_ultrasonic_tooltip = `Misst die Distanz mithilfe von Ultraschall in cm. Schließe den Sensor an einen der drei Digital/Analog Ports an:

- Trigger: Grünes Kabel
- Echo: gelbes Kabel`;
Blockly.Msg.senseBox_ultrasonic_helpurl = "https://docs.sensebox.de/hardware/sensoren-distanz/"

/**
 * UV and Lightsensor
 */
Blockly.Msg.senseBox_value = "Messwert:";
Blockly.Msg.senseBox_uv_light = "Helligkeit-/UV-Sensor";
Blockly.Msg.senseBox_uv_light_tooltip = "Sensor misst UV-Licht oder die Helligkeit. Die Helligkeit wird als **Ganzezahl** in Lux ausgegeben. Die UV-Intensität als **Kommazahl** in µW/cm².";
Blockly.Msg.senseBox_uv = "UV-Intensität in µW/cm²";
Blockly.Msg.senseBox_light = "Beleuchtungsstärke in Lux";
Blockly.Msg.senseBox_uv_light_helpurl = "https://docs.sensebox.de/hardware/sensoren-helligkeit-uv/"

/**
 * BMX055
 */

Blockly.Msg.senseBox_bmx055_compass = "Lage Sensor";
Blockly.Msg.senseBox_bmx055_accelerometer = "Beschleunigungssensor";
Blockly.Msg.senseBox_bmx055_accelerometer_range = "Messbereich";
Blockly.Msg.senseBox_bmx055_accelerometer_range_2g = "2g";
Blockly.Msg.senseBox_bmx055_accelerometer_range_4g = "4g";
Blockly.Msg.senseBox_bmx055_accelerometer_range_8g = "8g";
Blockly.Msg.senseBox_bmx055_accelerometer_range_16g = "16g";
Blockly.Msg.senseBox_bmx055_accelerometer_direction = "Richtung";
Blockly.Msg.senseBox_bmx055_accelerometer_direction_x = "X-Achse";
Blockly.Msg.senseBox_bmx055_accelerometer_direction_y = "Y-Achse";
Blockly.Msg.senseBox_bmx055_accelerometer_direction_z = "Z-Achse";
Blockly.Msg.senseBox_bmx055_accelerometer_direction_total = "Gesamt";
Blockly.Msg.senseBox_bmx055_gyroscope = "Lage Sensor";
Blockly.Msg.senseBox_bmx055_accelerometer_tip = "Lage Sensor";
Blockly.Msg.senseBox_bmx055_compass_tip = "Lage Sensor";
Blockly.Msg.senseBox_bmx055_gyroscope_tip = "Lage Sensor";
Blockly.Msg.senseBox_bmx055_x = "X-Richtung";
Blockly.Msg.senseBox_bmx055_y = "Y-Richtung";
Blockly.Msg.senseBox_bmx055_accelerometer_tooltip = `Dieser Block gibt dir den Messwert des Beschleunigungssensors der direkt auf der senseBox MCU aufgelötet ist. Im Dropdown Menü kannst du die Richtung und den Messbereich auswählen.`
Blockly.Msg.senseBox_bmx055_helpurl = ""


/**
 * 
 * GPS
 */
Blockly.Msg.senseBox_gps_getValues = "GPS Modul";
Blockly.Msg.senseBox_gps_lat = "Breitengrad";
Blockly.Msg.senseBox_gps_lng = "Längengrad";
Blockly.Msg.senseBox_gps_alt = "Höhe über NN in m";
Blockly.Msg.senseBox_gps_speed = "Geschwindigkeit in km/h";
Blockly.Msg.senseBox_gps_date = "Datum";
Blockly.Msg.senseBox_gps_time = "Uhrzeit";
Blockly.Msg.senseBox_gps_timeStamp = "Zeitstempel (RFC 3339)";
Blockly.Msg.senseBox_gps_tooltip = `Liest das GPS Modul aus und gibt dir die Standortinformationen. Längen- und Breitengrad werden als Kommazahl mit 6 Nachkommastellen ausgegeben. 
**Anschluss: I2C**

**Beachte:** Das GPS Modul benöigt beim ersten Verwenden relativ lange (ca. 5-10 Minuten) bis es deinen Standort gefunden hat!
`
Blockly.Msg.senseBox_gps_helpurl = "https://docs.sensebox.de/hardware/sensoren-gps/"

/**
 * Windspeed
 */
Blockly.Msg.senseBox_windspeed = "Windgeschwindigkeitssensor";
Blockly.Msg.senseBox_windspeed_tooltip = ""

/*
* Soundsensor
*/
Blockly.Msg.senseBox_soundsensor_dfrobot = "Soundsensor (DF Robot)";
Blockly.Msg.senseBox_soundsensor_dfrobot_tooltip = "Schließe den Sensor an einen der 3 **digital/analog Ports** an. Der Sensor gibt dir den Messwert in dB mit einer Nachkommastelle"
Blockly.Msg.senseBox_soundsensor_dfrobot_helpurl = "https://docs.sensebox.de/hardware/sensoren-lautstaerke/"
/*
* BME680
*/

Blockly.Msg.senseBox_bme680 = "Umweltsensor (BME680)";
Blockly.Msg.senseBox_bme_iaq = "Innenraumluftqualität (IAQ)";
Blockly.Msg.senseBox_bme_iaq_accuracy = "Kalibrierungswert";
Blockly.Msg.senseBox_bme_co2 = "CO2 Äquivalent";
Blockly.Msg.senseBox_bme_breatheVocEquivalent = "Atemluft VOC Äquivalent";
Blockly.Msg.senseBox_bme_tooltip = `Schließe den Umweltsensor an einen der 5 **I2C-Anschlüsse** an. **Beachte:** Der Sensor benöigt eine gewisse Zeit zum kalibrieren. 
Den Status der Kalibrierung kann über den Kalibrierungswert abgelesen werden. Er ist entweder 0, 1, 2 oder 3 und sagt folgendes aus:

- IAQ Accuracy = 0 heißt Sensor wird stabilisiert (dauert ca. 25 Minuten) oder dass es eine Zeitüberschreitung gab,
- IAQ Accuracy = 1 heißt Wert ist ungenau,
- IAQ Accuracy = 2 heißt Sensor wird kalibriert,
- IAQ Accuracy = 3 heißt Sensor erfolgreich kalibriert.

Die Messwerte für Temperatur, Luftfeuchtigkeit und Luftdruck können direkt verwendet werden.`;
Blockly.Msg.senseBox_bme680_helpurl = "https://docs.sensebox.de/hardware/sensoren-umweltsensor/"


/**
 * Truebner SMT50
 */
Blockly.Msg.senseBox_smt50 = "Bodenfeuchte/-temperatur (SMT50)";
Blockly.Msg.senseBox_smt50_helpurl = "https://docs.sensebox.de/hardware/sensoren-truebner/"
Blockly.Msg.senseBox_smt50_tooltip = "Schließe den Bodenfeuchtigkeit- und Temperatursensor an einen der 3 digital/analog Ports an und wähle den Port im Block aus. Der Sensor gibt die Bodentemperatur in °C und die Bodenfeuchtigkeit in % aus."

/**
 * SCD30 CO2 Sensor
 */
Blockly.Msg.senseBox_scd30 = "CO2 Sensor (Sensirion SCD30)";
Blockly.Msg.senseBox_scd_tooltip = "Schließe den Sensor an einen der 5 **I2C-Anschlüsse** an. Der Sensor gibt dir den Messwert für die CO2-Konzentration in ppm. Der Temperaturmesswert kann aufgrund der Messung direkt am Sensor um einige Grad vom realen Wert abweichen.";
Blockly.Msg.senseBox_scd_co2 = "CO2 in ppm";
Blockly.Msg.senseBox_scd_helpurl = "https://docs.sensebox.de/hardware/sensoren-co2/"

/**
 * Feinstaubsensor (SDS011) 
 */

Blockly.Msg.senseBox_sds011 = "Feinstaubsensor";
Blockly.Msg.senseBox_sds011_dimension = "in µg/m³ an";
Blockly.Msg.senseBox_sds011_pm25 = "PM2.5";
Blockly.Msg.senseBox_sds011_pm10 = "PM10";
Blockly.Msg.senseBox_sds011_tooltip = "Dieser Block gibt dir den Messwert des Feinstaubsensor. Schließe den Feinstaubsensor an einen der 2 **Serial/UART** Anschlüssen an. Im Dropdown Menü zwischen PM2.5 und PM10 auswählen. Der Messwert wird dir als **Kommazahl** in µg/m3"
Blockly.Msg.senseBox_sds011_serial1 = "Serial1";
Blockly.Msg.senseBox_sds011_serial2 = "Serial2";
Blockly.Msg.senseBox_sds011_helpurl = "https://docs.sensebox.de/hardware/sensoren-feinstaub/"


/**
 * Button
 */
Blockly.Msg.senseBox_button = "Button";
Blockly.Msg.senseBox_button_isPressed = "ist gedrückt";
Blockly.Msg.senseBox_button_switch = "als Schalter";
Blockly.Msg.senseBox_button_wasPressed = "wurde gedrückt";
Blockly.Msg.senseBox_button_tooltip = `Dieser Block gibt dir den Status des angeschlossenen Buttons. Im Dropdown Menü können verschiedene Modi für den Button ausgewählt werden. Angesteuert können entweder der on Board Button oder ein Button, der an einen der 6 digitalen Pins angeschlossen ist. verschiedene Modi:
- "ist gedrückt": Mit diesem Modus kannst du abfragen ob der Block gerade gedrückt wird. Du erhältst entweder den Wert TRUE oder FALSE.
- "wurde gedrückt": Mit diesem Modus kannst du abfragen ob der Block gedrückt wurde. Erst wenn der Knopf gedrückt und wieder losgelassen wurde erhältst du TRUE zurück
- "als Schalter": Wenn du diesen Block verwendest kannst du den Knopf wie ein Lichtschalter verwenden. Der Status wird gespeichert bis der Button erneut gedrückt wird`
Blockly.Msg.senseBox_button_helpurl = ""



