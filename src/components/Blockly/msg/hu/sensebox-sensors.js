export const SENSORS = {
  /**
   * Érzékelők
   * ---------------------------------------------------
   *
   */

  /**
   * BMP280
   */
  senseBox_pressure_sensor: "Airpressure/Temperature Sensor (BMP280)",
  senseBox_pressure: "Légnyomás hPa-ban",
  senseBox_pressure_dimension: "Airpressure in hPa",
  senseBox_pressure_tooltip:
    "Csatlakoztassa az érzékelőt az 5 **I2C port** egyikéhez. Az érzékelő megadja a légnyomás mért értékét hPa-ban. A tengerszint feletti helyes magasság kiszámításához az érzékelőnek szüksége van egy aktuális referenciaértékre.",
  senseBox_pressure_referencePressure: "Nyomás a tengerszinten",
  senseBox_pressure_referencePressure_dim: "hPa",
  senseBox_pressure_helpurl: "",

  /**
   * DPS310
   */
  senseBox_sensor_dps310: "Légnyomás/hőmérséklet érzékelő (DPS310)",
  senseBox_sensor_dps310_tooltip:
    "Csatlakoztassa az érzékelőt az 5 **I2C port** egyikéhez. Az érzékelő megadja a légnyomás mért értékét hPa-ban. A tengerszint feletti helyes magasság kiszámításához az érzékelőnek szüksége van egy aktuális referenciaértékre.",

  /**
   * Mikro
   */
  senseBox_sound: "Mikrofon",
  senseBox_sound_tip:
    "Csatlakoztassa az érzékelőt a 3 **analóg/digitális** port egyikéhez a kenyérvágón keresztül. Visszaadja a mikrofon leolvasását voltban",
  senseBox_sound_helpurl:
    "https://en.docs.sensebox.de/hardware/sensoren-mikro/",

  /**
   * Hőmérséklet- és páratartalom-érzékelő (HDC1080)
   */
  senseBox_temp: "Hőmérséklet °C-ban",
  senseBox_temp_hum: "Hőmérséklet/páratartalom érzékelő (HDC1080)",
  senseBox_temp_hum_tooltip:
    "Ez a blokk a hőmérséklet- és páratartalom-érzékelő leolvasott értékeit adja vissza. Csatlakoztassa az érzékelőt az 5 I2C port egyikéhez. A mért értéket 2 tizedesjegy pontossággal adja ki.",
  senseBox_temp_hum_helpurl:
    "https://en.docs.sensebox.de/hardware/sensoren-temperatur-luftfeuchte/",
  senseBox_hum: "páratartalom %-ban",
  senseBox_hum_tip: "Méri a páratartalmat %-ban",

  /**
   * Ultraschalldistanzsensor
   */

  senseBox_ultrasonic: "Ultrahangos távolságérzékelő a kikötőben",
  senseBox_ultrasonic_trigger: "Trigger",
  senseBox_ultrasonic_echo: "Echo",
  senseBox_ultrasonic_maxDistance: "Max distance",
  senseBox_ultrasonic_port_A: "A",
  senseBox_ultrasonic_port_B: "B",
  senseBox_ultrasonic_port_C: "C",
  senseBox_ultrasonic_tooltip: `Méri a távolságot ultrahanggal cm-ben. Csatlakoztassa az érzékelőt a három digitális/analóg port egyikéhez:
- Trigger: Zöld kábel
- Echo: Sárga kábel
Ha a maximális távolságot elérte, akkor **O** értéket kap vissza`,
  senseBox_ultrasonic_helpurl:
    "https://en.docs.sensebox.de/hardware/sensoren-distanz/",

  /**
   * UV és fényérzékelő
   */
  senseBox_uv: "UV-fény µW/cm²-ben",
  senseBox_uv_light: "Látható fény + UV",
  senseBox_value: "Value:",
  senseBox_uv_light_tooltip:
    "Az érzékelő az UV-fényt vagy a fényerőt méri. A fényerősség **integrál** luxban kifejezve kerül kimenetre. Az UV-intenzitás **decimális** értékben, µW/cm²-ben.",
  senseBox_light: "Megvilágítottság Luxban",
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
  senseBox_bmx055_accelerometer_direction_z: "Z-tengely",
  senseBox_bmx055_accelerometer_direction_total: "Total",
  senseBox_bmx055_gyroscope: "Gyroscope",

  senseBox_bmx055_compass_tip: "Lage Sensor",
  senseBox_bmx055_gyroscope_tip: "Lage Sensor",
  senseBox_bmx055_x: "X-irány",
  senseBox_bmx055_y: "Y-irány",
  senseBox_bmx055_accelerometer_tooltip: "Ez a blokk a közvetlenül a senseBox MCU-ra forrasztott gyorsulásmérő mérési értékét adja meg. A legördülő menüben kiválaszthatja az irányt és a mérési tartományt.",
  senseBox_bmx055_helpurl: "",

  /**
   *
   * GPS
   */
  senseBox_gps_getValues: "GPS Modul",
  senseBox_gps_lat: "latitude",
  senseBox_gps_lng: "longitude",
  senseBox_gps_alt: "magasság m-ben",
  senseBox_gps_speed: "sebesség km/h-ban",
  senseBox_gps_date: "dátum",
  senseBox_gps_time: "time",
  senseBox_gps_timeStamp: "(RFC 3339)",
  senseBox_gps_tooltip: `
  A GPS-modul beolvasása és a helymeghatározási információk megadása. A hosszúsági és szélességi fokot 6 tizedesjegyű tizedes számként adja ki 
  **Connection: I2C**

  **Figyelem:** A GPS modulnak viszonylag hosszú időre van szüksége (kb. 5-10 perc), amíg megtalálja a helyzetét!
`,
  senseBox_gps_helpurl: "https://en.docs.sensebox.de/hardware/sensoren-gps/",

  /**
   * Szélsebesség
   */
  senseBox_windspeed: "Windspeedsensor",
  senseBox_windspeed_tooltip: "",

  /*
   * Soundsensor
   */
  senseBox_soundsensor_dfrobot: "Soundsensor (DF Robot)",
  senseBox_soundsensor_dfrobot_tooltip:
    "Csatlakoztassa az érzékelőt a 3 **digitális/analóg port** egyikéhez. Az érzékelő dB-ben adja meg a leolvasott értéket egy tizedesjegy pontossággal.",
  senseBox_soundsensor_dfrobot_helpurl:
    "https://en.docs.sensebox.de/hardware/sensoren-lautstaerke/",

  /*
   * BME680
   */

  senseBox_bme680: "Környezeti érzékelő (BME680)",
  senseBox_bme_iaq: "Beltéri levegőminőség (IAQ)",
  senseBox_bme_iaq_accuracy: "Kalibrációs érték",
  senseBox_bme_pressure: "Levegőnyomás Pa-ban",
  senseBox_bme_co2: "CO2-egyenérték",
  senseBox_bme_breatheVocEquivalent: "Belégzett VOC-egyenérték",
  senseBox_bme_tooltip: `Kapcsolja a környezeti érzékelőt az 5 **I2C port** egyikéhez. **Figyelem:** Az érzékelőnek némi időre van szüksége a kalibráláshoz.
A kalibrálás állapota leolvasható a kalibrációs értékből. Ez vagy 0, 1, 2 vagy 3, és a következőket mondja ki:

- IAQ pontosság : 0 azt jelenti, hogy az érzékelő stabilizálódott (kb. 25 percig tart), vagy hogy időkiesés történt,
- IAQ pontosság : 1 azt jelenti, hogy az érték pontatlan,
- IAQ pontosság : 2 azt jelenti, hogy az érzékelőt kalibrálják,
- IAQ pontosság : 3 azt jelenti, hogy az érzékelőt sikeresen kalibrálták.

A hőmérséklet, a páratartalom és a légnyomás mért értékei közvetlenül felhasználhatók,`,
  senseBox_bme680_helpurl:
    "https://en.docs.sensebox.de/hardware/sensoren-umweltsensor/",

  /**
   * Truebner SMT50
   */
  senseBox_smt50: "Talajnedvesség és hőmérséklet (SMT50)",
  senseBox_smt50_helpurl:
    "https://docs.sensebox.de/hardware/sensoren-truebner/",
  senseBox_smt50_tooltip:
    "Schließe den Bodenfeuchtigkeit- und Temperatursensor an einen der 3 digital/analog Ports an und wähle den Port im Block aus. Der Sensor gibt die Bodentemperatur in °C und die Bodenfeuchtigkeit in % aus.",

  /**
   * SCD30 CO2-érzékelő
   */
  senseBox_scd30: "CO2-érzékelő (Sensirion SCD30)",
  senseBox_scd_tooltip:
    "Csatlakoztassa az érzékelőt az 5 **I2C port** egyikéhez. Az érzékelő a CO2-koncentráció ppm-ben kifejezett értékét fogja megadni. A közvetlenül az érzékelőn végzett mérés miatt a hőmérséklet leolvasása néhány fokkal eltérhet a valós értéktől.",
  senseBox_scd_co2: "CO2 ppm-ben",
  senseBox_scd_helpurl: "https://en.docs.sensebox.de/hardware/sensoren-co2/",
  /**
   * Feinstaubsenzor (SDS011)
   */
  senseBox_sds011: "Fine Particular Sensor",
  senseBox_sds011_dimension: "in µg/m³ at",
  senseBox_sds011_pm25: "PM2.5",
  senseBox_sds011_pm10: "PM10",
  senseBox_sds011_tooltip:
    "Ez a blokk a finompor-érzékelő leolvasását adja meg. Csatlakoztassa a finom porérzékelőt a 2 **Serial/UART** port egyikéhez. Válasszon a PM2.5 és a PM10 között a legördülő menüben. A mért érték **komma szám** formájában jelenik meg µg/m3-ban",
  senseBox_sds011_serial1: "Serial1",
  senseBox_sds011_serial2: "Serial2",
  senseBox_sds011_helpurl:
    "https://en.docs.sensebox.de/hardware/sensoren-feinstaub/",

  /**
   * Gomb
   */
  senseBox_button: "Button",
  senseBox_button_isPressed: "is Pressed",
  senseBox_button_switch: "as Switch",
  senseBox_button_wasPressed: "was Pressed",
  senseBox_button_longPress: "Pressed for",
  senseBox_button_tooltip: `Ez a blokk a csatlakoztatott gomb állapotát mutatja. A legördülő menüben különböző módokat választhat a gombhoz. Vagy a fedélzeti gombot, vagy a 6 digitális pin valamelyikére csatlakoztatott gombot lehet vezérelni. különböző módokat:
- "Meg van nyomva": Ezzel az üzemmóddal ellenőrizheti, hogy a blokk jelenleg nyomva van-e. Vagy a TRUE vagy a FALSE értéket kapja.
- "volt megnyomva": Ezzel az üzemmóddal lekérdezheti, hogy a blokkot megnyomták-e. Csak akkor kapod a TRUE értéket, ha a gombot megnyomták és elengedték.
- "mint kapcsoló": Ha ezt a blokkot használod, akkor a gombot úgy használhatod, mint egy villanykapcsolót. Az állapot addig marad meg, amíg a gombot újra meg nem nyomja.
`,
  senseBox_button_helpurl: "",

  /**
   *
   */
  senseBox_watertemperature: "Water Temperature",


    /**
   * Feinstaubsensor Sensirion SPS30
   */

     senseBox_sps30: "Porszemcsés anyag érzékelő (Sensirion SPS30)",
     senseBox_sps30_dimension: "in µg/m³",
     senseBox_sps30_1p0: "PM1.0",
     senseBox_sps30_2p5: "PM2.5",
     senseBox_sps30_4p0: "PM4.0",
     senseBox_sps30_10p0: "PM10",
     senseBox_sps30_tooltip:
     "Ez a blokk a Sensirion SPS30 finom porszenzor mért értékét adja meg. Csatlakoztassa a finompor-érzékelőt az 5 **I2C** csatlakozó egyikéhez. Válasszon a PM1.0, PM2.5, PM4.0 és PM10 között a legördülő menüben. A mért érték **decimális** értékként jelenik meg µg/m3-ban",
     senseBox_sps30_helpurl:
       "https://docs.sensebox.de/hardware/sensoren-feinstaub/",
   
  

};
