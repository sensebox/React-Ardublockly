export const BLE = {
  /**
   * Phyphox Blöcke
   */
  sensebox_phyphox_init: "Initialisiere Phyphox Gerät mit Namen:",
  sensebox_phyphox_createExperiment: "Erstelle Experiment",
  sensebox_phyphox_experimentName: "Name des Experiments",
  sensebox_phyphox_experimentTitle: "Titel",
  sensebox_phyphox_experimentCategory: "Kategorie",
  sensebox_phyphox_experimentDescription: "Beschreibung",
  sensebox_phyphox_experiment_description: "Kurze Beschreibung des Experiments",
  sensebox_phyphox_writeValues: "Sende Werte",
  sensebox_phyphox_createView: "Mit Graphen:",
  sensebox_phyphox_createGraph: "Erstelle Graph",
  sensebox_phyphox_graphLabel: "",
  sensebox_phyphox_unitx: "Einheit x-Achse",
  sensebox_phyphox_unity: "Einheit y-Achse",
  sensebox_phyphox_labelx: "Beschriftung x-Achse",
  sensebox_phyphox_labely: "Beschriftung y-Achse",
  sensebox_phyphox_channel0: "Wert x-Achse",
  sensebox_phyphox_channel1: "Wert y-Achse",
  sensebox_phyphox_style_dots: "Punkte",
  sensebox_phyphox_style_line: "Linie",
  sensebox_phyphox_timestamp: "Zeitstempel",
  sensebox_phyphox_channel: "Kanal",
  sensebox_phyphox_sendchannel: "sende an Kanal:",
  sensebox_phyphox_graphStyle: "Stil",

  sensebox_phyphox_init_tooltip:
    "Initialisere das Bluetooth Bee. Stecke diese auf dem Steckplatz **XBEE1**. Gib dem Phyphox Messgerät einen eindeutigen Namen, damit du dieses in der App wiederfindest",
  sensebox_phyphox_experiment_tooltip:
    "Erstelle ein Experiment und vergib einen eindeutigen Namen und eine kurze Beschreibung. Füge bis zu 5 verschiedene Graphen in der Ansicht hinzu. ",
  sensebox_phyphox_graph_tooltip:
    "Erstellt einen neuen Graph für das Experiment. Gibt die Einheit und Beschriftung für die Achsen an und wähle den Stil der Visualisuerng der Messwerte. Füge an die Schnittstellen für die Werte der X- und Y-Achse den Kanal an auf dem die Messwerte später gesendet werden. Möchtest du einen Zeitstempel über die Phyphox App erstellen lassen verbinde den Block *Zeitstempel*",
  sensebox_phyphox_timestamp_tooltip:
    "Verwende diesen Block, um einen Zeitstempel über die Phyphox App erstellen zu lassen",
  sensebox_phyphox_sendchannel_tooltip:
    "Sendet einen Messwert an den ausgewählten Kanal",
  sensebox_phyphox_experiment_send_tooltip:
    "Sendet die Messwerte an die Phyphox App",

  /**
   * senseBox:bike BLE
   */
  sensebox_bike_ble_init: "Starte senseBox:bike Bluetooth",
  sensebox_bike_ble_devicename: "Gerätename",
  sensebox_bike_ble_init_tooltip:
    "Startet Bluetooth, damit sich die senseBox:bike App mit deiner senseBox MCU-S2 verbinden kann. Die App zeigt das Gerät unter dem Gerätenamen und der ID deiner MCU an, z. B. *senseBox:bike [1A2B3C]*. Füge diesen Block in *Setup()* ein.",
  sensebox_bike_ble_send: "Sende an senseBox:bike App:",
  sensebox_bike_ble_send_tooltip:
    "Sendet Messwerte deiner eigenen Sensoren als ausgewähltes Phänomen an die senseBox:bike App. Einige Phänomene bestehen aus mehreren Werten (z. B. Feinstaub: PM1, PM2.5, PM4 und PM10), die immer gemeinsam gesendet werden. Benötigt den Block *Starte senseBox:bike Bluetooth*.",
  sensebox_bike_ble_missing_init:
    "Füge den Block *Starte senseBox:bike Bluetooth* in Setup() ein, damit die Werte gesendet werden.",
  sensebox_bike_ble_helpurl:
    "https://github.com/sensebox/senseBox-bike-Arduino",
  sensebox_bike_ble_temperature: "Temperatur",
  sensebox_bike_ble_humidity: "rel. Luftfeuchtigkeit",
  sensebox_bike_ble_finedust: "Feinstaub",
  sensebox_bike_ble_acceleration: "Beschleunigung",
  sensebox_bike_ble_distance: "Abstand links",
  sensebox_bike_ble_distance_right: "Abstand rechts",
  sensebox_bike_ble_overtaking: "Überholvorgang",
  sensebox_bike_ble_surface: "Oberflächenklassifikation",
  sensebox_bike_ble_anomaly: "Oberflächenanomalie",
  sensebox_bike_ble_battery: "Akkustand",
  sensebox_bike_ble_value_temperature: "Temperatur in °C",
  sensebox_bike_ble_value_humidity: "rel. Luftfeuchtigkeit in %",
  sensebox_bike_ble_value_pm1: "PM1 in µg/m³",
  sensebox_bike_ble_value_pm25: "PM2.5 in µg/m³",
  sensebox_bike_ble_value_pm4: "PM4 in µg/m³",
  sensebox_bike_ble_value_pm10: "PM10 in µg/m³",
  sensebox_bike_ble_value_x: "X",
  sensebox_bike_ble_value_y: "Y",
  sensebox_bike_ble_value_z: "Z",
  sensebox_bike_ble_value_distance: "Abstand in cm",
  sensebox_bike_ble_value_overtaking_car: "Wahrscheinlichkeit Auto",
  sensebox_bike_ble_value_overtaking_bike: "Wahrscheinlichkeit Fahrrad",
  sensebox_bike_ble_value_asphalt: "Asphalt",
  sensebox_bike_ble_value_compacted: "verdichtet",
  sensebox_bike_ble_value_paving: "Pflaster",
  sensebox_bike_ble_value_sett: "Kopfsteinpflaster",
  sensebox_bike_ble_value_standing: "stehend",
  sensebox_bike_ble_value_anomaly: "Anomalie",
  sensebox_bike_ble_value_battery: "Akkustand in %",
};
