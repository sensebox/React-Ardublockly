/**
 * Define boards and pins
 *
 */
const sensebox_mcu = {
  title: "MCU",
  description: "senseBox Microcontroller Unit based on Microchip SAMD21G18A",
  compilerFlag: "arduino:samd",
  digitalPins: [
    ["A1", "1"],
    ["A2", "2"],
    ["B3", "3"],
    ["B4", "4"],
    ["C5", "5"],
    ["C6", "6"],
  ],
  digitalPorts: [
    ["A", "IO1_2"],
    ["B", "IO3_4"],
    ["C", "IO5_6"],
  ],
  digitalPinsLED: [
    ["BUILTIN_1", "7"],
    ["BUILTIN_2", "8"],
    ["A1", "1"],
    ["A2", "2"],
    ["B3", "3"],
    ["B4", "4"],
    ["C5", "5"],
    ["C6", "6"],
  ],
  digitalPinsRGBMatrix: [
    ["A", "2"],
    ["B", "4"],
    ["C", "6"],
  ],
  digitalPinsRGB: [
    ["A", "1"],
    ["B", "3"],
    ["C", "5"],
  ],
  digitalPinsButton: [
    ["on Board", "0"],
    ["A1", "1"],
    ["A2", "2"],
    ["B3", "3"],
    ["B4", "4"],
    ["C5", "5"],
    ["C6", "6"],
  ],
  oneWire: [
    ["0", "0"],
    ["1", "1"],
    ["2", "2"],
    ["3", "3"],
    ["4", "4"],
    ["5", "5"],
  ],
  pwmPins: [
    ["A1", "1"],
    ["A2", "2"],
    ["B3", "3"],
    ["B4", "4"],
    ["C5", "5"],
    ["C6", "6"],
  ],
  serial: [
    ["SerialUSB", "SerialUSB"],
    ["Serial1", "Serial1"],
    ["Serial2", "Serial2"],
  ],
  serialSensors: [
    ["Serial1", "Serial1"],
    ["Serial2", "Serial2"],
  ],
  serialPins: {
    SerialUSB: [
      ["RX", ""],
      ["TX", ""],
    ],
    Serial1: [
      ["RX", "11"],
      ["TX", "10"],
    ],
    Serial2: [
      ["RX", "13"],
      ["TX", "12"],
    ],
  },
  serialSpeed: [
    ["300", "300"],
    ["600", "600"],
    ["1200", "1200"],
    ["2400", "2400"],
    ["4800", "4800"],
    ["9600", "9600"],
    ["14400", "14400"],
    ["19200", "19200"],
    ["28800", "28800"],
    ["31250", "31250"],
    ["38400", "38400"],
    ["57600", "57600"],
    ["115200", "115200"],
  ],
  spi: [["SPI", "SPI"]],
  spiPins: {
    SPI: [
      ["MOSI", "19"],
      ["MISO", "21"],
      ["SCK", "20"],
    ],
  },
  spiClockDivide: [
    ["2 (8MHz)", "SPI_CLOCK_DIV2"],
    ["4 (4MHz)", "SPI_CLOCK_DIV4"],
    ["8 (2MHz)", "SPI_CLOCK_DIV8"],
    ["16 (1MHz)", "SPI_CLOCK_DIV16"],
    ["32 (500KHz)", "SPI_CLOCK_DIV32"],
    ["64 (250KHz)", "SPI_CLOCK_DIV64"],
    ["128 (125KHz)", "SPI_CLOCK_DIV128"],
  ],
  i2c: [["I2C", "Wire"]],
  i2cPins: {
    Wire: [
      ["SDA", "17"],
      ["SCL", "16"],
    ],
  },
  i2cSpeed: [
    ["100kHz", "100000L"],
    ["400kHz", "400000L"],
  ],
  builtinLed: [
    ["BUILTIN_1", "7"],
    ["BUILTIN_2", "8"],
  ],
  interrupt: [
    ["interrupt1", "1"],
    ["interrupt2", "2"],
    ["interrupt3", "3"],
    ["interrupt4", "4"],
    ["interrupt5", "5"],
    ["interrupt6", "6"],
  ],
  analogPins: [
    ["A1", "A1"],
    ["A2", "A2"],
    ["B3", "A3"],
    ["B4", "A4"],
    ["C5", "A5"],
    ["C6", "A6"],
  ],
  serial_baud_rate: 9600,
  parseKey: "_*_",
};

//senseBox MCU mini
const sensebox_mini = {
  title: "Mini",
  description: "senseBox Mini",
  compilerFlag: "arduino:samd",
  digitalPins: [
    ["IO1", "1"],
    ["IO2", "2"],
  ],
  digitalPorts: [["A", "IO1_2"]],
  digitalPinsLED: [
    ["BUILTIN_1", "7"],
    ["BUILTIN_2", "8"],
    ["IO1", "1"],
    ["IO2", "2"],
  ],
  digitalPinsRGBMatrix: [["A", "2"]],
  digitalPinsRGB: [
    ["on Board", "6"],
    ["IO1-2", "1"],
  ],
  digitalPinsButton: [
    ["on Board", "0"],
    ["IO1", "1"],
    ["IO2", "2"],
  ],
  oneWire: [
    ["0", "0"],
    ["1", "1"],
    ["2", "2"],
    ["3", "3"],
    ["4", "4"],
    ["5", "5"],
  ],
  pwmPins: [
    ["IO1", "1"],
    ["IO2", "2"],
  ],
  serial: [
    ["SerialUSB", "SerialUSB"],
    ["Serial1", "Serial1"],
  ],
  serialSensors: [["Serial1", "Serial1"]],
  serialPins: {
    SerialUSB: [
      ["RX", ""],
      ["TX", ""],
    ],
    Serial1: [
      ["RX", "11"],
      ["TX", "10"],
    ],
    Serial2: [
      ["RX", "13"],
      ["TX", "12"],
    ],
  },
  serialSpeed: [
    ["300", "300"],
    ["600", "600"],
    ["1200", "1200"],
    ["2400", "2400"],
    ["4800", "4800"],
    ["9600", "9600"],
    ["14400", "14400"],
    ["19200", "19200"],
    ["28800", "28800"],
    ["31250", "31250"],
    ["38400", "38400"],
    ["57600", "57600"],
    ["115200", "115200"],
  ],
  spi: [["SPI", "SPI"]],
  spiPins: {
    SPI: [
      ["MOSI", "19"],
      ["MISO", "21"],
      ["SCK", "20"],
    ],
  },
  spiClockDivide: [
    ["2 (8MHz)", "SPI_CLOCK_DIV2"],
    ["4 (4MHz)", "SPI_CLOCK_DIV4"],
    ["8 (2MHz)", "SPI_CLOCK_DIV8"],
    ["16 (1MHz)", "SPI_CLOCK_DIV16"],
    ["32 (500KHz)", "SPI_CLOCK_DIV32"],
    ["64 (250KHz)", "SPI_CLOCK_DIV64"],
    ["128 (125KHz)", "SPI_CLOCK_DIV128"],
  ],
  i2c: [["I2C", "Wire"]],
  i2cPins: {
    Wire: [
      ["SDA", "17"],
      ["SCL", "16"],
    ],
  },
  i2cSpeed: [
    ["100kHz", "100000L"],
    ["400kHz", "400000L"],
  ],
  builtinLed: [
    ["BUILTIN_1", "7"],
    ["BUILTIN_2", "8"],
  ],
  interrupt: [
    ["interrupt1", "1"],
    ["interrupt2", "2"],
  ],
  analogPins: [
    ["A1", "A1"],
    ["A2", "A2"],
  ],
  serial_baud_rate: 9600,
  parseKey: "_*_",
};

//senseBox MCU-S2
const sensebox_esp32 = {
  title: "MCU-S2",
  description: "senseBox ESP32",
  compilerFlag: "esp32:esp32:esp32",
  digitalPins: [
    ["IO2", "2"],
    ["IO3", "3"],
    ["IO4", "4"],
    ["IO5", "5"],
    ["IO6", "6"],
    ["IO7", "7"],
  ],
  digitalPorts: [
    ["A", "IO3_2"],
    ["B", "IO5_4"],
    ["C", "IO7_6"],
  ],
  digitalPinsRGBMatrix: [
    ["A", "2"],
    ["B", "4"],
    ["C", "6"],
  ],
  digitalPinsLED: [
    ["IO2", "2"],
    ["IO3", "3"],
    ["IO4", "4"],
    ["IO5", "5"],
    ["IO6", "6"],
    ["IO7", "7"],
  ],
  digitalPinsRGB: [
    ["on Board", "1"],
    ["A", "3"],
    ["B", "5"],
    ["C", "7"],
  ],
  digitalPinsButton: [
    ["on Board", "0"],
    ["IO2", "2"],
    ["IO3", "3"],
    ["IO4", "4"],
    ["IO5", "5"],
    ["IO6", "6"],
    ["IO7", "7"],
  ],
  oneWire: [
    ["0", "0"],
    ["1", "1"],
    ["2", "2"],
    ["3", "3"],
    ["4", "4"],
    ["5", "5"],
  ],
  pwmPins: [
    ["IO1", "1"],
    ["IO2", "2"],
  ],
  serial: [
    ["Serial", "Serial"],
    ["Serial0", "Serial0"],
  ],
  serialSensors: [["Serial0", "Serial0"]],
  serialPins: {
    SerialUSB: [
      ["RX", ""],
      ["TX", ""],
    ],
    Serial0: [
      ["RX", "40"],
      ["TX", "39"],
    ],
  },
  serialSpeed: [
    ["300", "300"],
    ["600", "600"],
    ["1200", "1200"],
    ["2400", "2400"],
    ["4800", "4800"],
    ["9600", "9600"],
    ["14400", "14400"],
    ["19200", "19200"],
    ["28800", "28800"],
    ["31250", "31250"],
    ["38400", "38400"],
    ["57600", "57600"],
    ["115200", "115200"],
  ],
  spi: [["SPI", "SPI"]],
  spiPins: {
    SPI: [
      ["MOSI", "19"],
      ["MISO", "21"],
      ["SCK", "20"],
    ],
  },
  spiClockDivide: [
    ["2 (8MHz)", "SPI_CLOCK_DIV2"],
    ["4 (4MHz)", "SPI_CLOCK_DIV4"],
    ["8 (2MHz)", "SPI_CLOCK_DIV8"],
    ["16 (1MHz)", "SPI_CLOCK_DIV16"],
    ["32 (500KHz)", "SPI_CLOCK_DIV32"],
    ["64 (250KHz)", "SPI_CLOCK_DIV64"],
    ["128 (125KHz)", "SPI_CLOCK_DIV128"],
  ],
  i2c: [["I2C", "Wire"]],
  i2cPins: {
    Wire: [
      ["SDA", "39"],
      ["SCL", "40"],
    ],
  },
  i2cSpeed: [
    ["100kHz", "100000L"],
    ["400kHz", "400000L"],
  ],
  builtinLed: [
    ["BUILTIN_1", "7"],
    ["BUILTIN_2", "8"],
  ],
  interrupt: [
    ["interrupt1", "1"],
    ["interrupt2", "2"],
  ],
  analogPins: [
    ["IO2", "2"],
    ["IO3", "3"],
    ["IO4", "4"],
    ["IO5", "5"],
    ["IO6", "6"],
    ["IO7", "7"],
  ],
  serial_baud_rate: 9600,
  parseKey: "_*_",
};

var board = sensebox_esp32;

export const setBoardHelper = (selectedBoard) => {
  switch (selectedBoard) {
    case "MCU":
      board = sensebox_mcu;
      break;
    case "MCU:mini":
      board = sensebox_mini;
      break;
    case "MCU-S2":
      board = sensebox_esp32;
      break;
    default:
      board = sensebox_mcu;
  }
};

export const selectedBoard = () => {
  return board;
};
