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
};
