export const BLE = {
  /**
   * Phyphox Init
   */
  sensebox_phyphox_init: "Initialise Phyphox device with name:",
  sensebox_phyphox_createExperiment: "Create experiment",
  sensebox_phyphox_experimentName: "Name of experiment",
  sensebox_phyphox_experimentTitle: "Title",
  sensebox_phyphox_experimentCategory: "Category",
  sensebox_phyphox_experimentDescription: "Description",
  sensebox_phyphox_experiment_description:
    "Short description of the experiment",
  sensebox_phyphox_writeValues: "Send values",
  sensebox_phyphox_createView: "With graphs:",
  sensebox_phyphox_createGraph: "Create Graph",
  sensebox_phyphox_graphLabel: "",
  sensebox_phyphox_unitx: "Unit x-axis",
  sensebox_phyphox_unity: "Unit y-axis",
  sensebox_phyphox_labelx: "Label x-axis",
  sensebox_phyphox_labely: "Label y-axis",
  sensebox_phyphox_channel0: "x-axis value",
  sensebox_phyphox_channel1: "y-axis value",
  sensebox_phyphox_style_dots: "Dots",
  sensebox_phyphox_style_line: "Line",
  sensebox_phyphox_timestamp: "Timestamp",
  sensebox_phyphox_channel: "Channel",
  sensebox_phyphox_sendchannel: "send to channel:",
  sensebox_phyphox_graphStyle: "style",

  sensebox_phyphox_init_tooltip:
    "Initialise the Bluetooth Bee. Plug it into the **XBEE1** slot. Give the Phyphox meter a unique name so you can find it in the app",
  sensebox_phyphox_helpurl:
    "https://sensebox.de/projects/de/2021-12-21-verbindung%20mit%20der%20phyphox%20app",
  sensebox_phyphox_experiment_tooltip:
    "Create an experiment and give it a unique name and a short description. Add up to 5 different graphs in the view. ",
  sensebox_phyphox_graph_tooltip:
    "Creates a new graph for the experiment. Specify the unit and label for the axes and choose the style of visualisation of the measured values. Add to the interfaces for the values of the X- and Y-axis the channel on which the measured values will be sent later. If you want to create a timestamp via the Phyphox app, connect the block *Timestamp*",
  sensebox_phyphox_timestamp_tooltip:
    "Use this block to have a timestamp created via the Phyphox app",
  sensebox_phyphox_sendchannel_tooltip:
    "Sends a reading to the selected channel",
  sensebox_phyphox_experiment_send_tooltip:
    "Sends the measured values to the Phyphox App",

  /**
   * senseBox:bike BLE
   */
  sensebox_bike_ble_init: "Start senseBox:bike Bluetooth",
  sensebox_bike_ble_devicename: "Device name",
  sensebox_bike_ble_init_tooltip:
    "Starts Bluetooth so the senseBox:bike app can connect to your senseBox MCU-S2. The app lists the device by its name and the ID of your MCU, e.g. *senseBox:bike [1A2B3C]*. Place this block in *Setup()*.",
  sensebox_bike_ble_send: "Send to senseBox:bike app:",
  sensebox_bike_ble_send_tooltip:
    "Sends readings of your own sensors to the senseBox:bike app as the selected phenomenon. Some phenomena consist of several values (e.g. fine dust: PM1, PM2.5, PM4 and PM10) that are always sent together. Requires the block *Start senseBox:bike Bluetooth*.",
  sensebox_bike_ble_missing_init:
    "Add the block *Start senseBox:bike Bluetooth* to Setup() so the values are sent.",
  sensebox_bike_ble_helpurl:
    "https://github.com/sensebox/senseBox-bike-Arduino",
  sensebox_bike_ble_temperature: "Temperature",
  sensebox_bike_ble_humidity: "Rel. humidity",
  sensebox_bike_ble_finedust: "Fine dust",
  sensebox_bike_ble_acceleration: "Acceleration",
  sensebox_bike_ble_distance: "Distance left",
  sensebox_bike_ble_distance_right: "Distance right",
  sensebox_bike_ble_overtaking: "Overtaking",
  sensebox_bike_ble_surface: "Surface classification",
  sensebox_bike_ble_anomaly: "Surface anomaly",
  sensebox_bike_ble_battery: "Battery level",
  sensebox_bike_ble_value_temperature: "Temperature in °C",
  sensebox_bike_ble_value_humidity: "Rel. humidity in %",
  sensebox_bike_ble_value_pm1: "PM1 in µg/m³",
  sensebox_bike_ble_value_pm25: "PM2.5 in µg/m³",
  sensebox_bike_ble_value_pm4: "PM4 in µg/m³",
  sensebox_bike_ble_value_pm10: "PM10 in µg/m³",
  sensebox_bike_ble_value_x: "X",
  sensebox_bike_ble_value_y: "Y",
  sensebox_bike_ble_value_z: "Z",
  sensebox_bike_ble_value_distance: "Distance in cm",
  sensebox_bike_ble_value_overtaking_car: "Probability car",
  sensebox_bike_ble_value_overtaking_bike: "Probability bike",
  sensebox_bike_ble_value_asphalt: "Asphalt",
  sensebox_bike_ble_value_compacted: "Compacted",
  sensebox_bike_ble_value_paving: "Paving",
  sensebox_bike_ble_value_sett: "Sett",
  sensebox_bike_ble_value_standing: "Standing",
  sensebox_bike_ble_value_anomaly: "Anomaly",
  sensebox_bike_ble_value_battery: "Battery level in %",
};
