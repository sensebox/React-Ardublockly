/**
 * Define boards and pins
 *
 */
const sensebox_mcu = {
    description: 'senseBox Microcontroller Unit based on Microchip SAMD21G18A',
    compilerFlag: 'arduino:samd',
    digitalPins: [['D1', '1'], ['D2', '2'], ['D3', '3'], ['D4', '4'], ['D5', '5'], ['D6', '6']],
    digitalPinsLED: [['BUILTIN_1', '7'], ['BUILTIN_2', '8'], ['D1', '1'], ['D2', '2'], ['D3', '3'], ['D4', '4'], ['D5', '5'], ['D6', '6']],
    digitalPinsButton: [['on Board', '0'], ['D1', '1'], ['D2', '2'], ['D3', '3'], ['D4', '4'], ['D5', '5'], ['D6', '6']],
    pwmPins: [['D1', '1'], ['D2', '2'], ['D3', '3'], ['D4', '4'], ['D5', '5'], ['D6', '6']],
    serial: [['serial', 'SerialUSB'], ['serial_1', 'Serial1'], ['serial_2', 'Serial2']],
    serialPins: {
        SerialUSB: [['RX', ''], ['TX', '']],
        Serial1: [['RX', '11'], ['TX', '10']],
        Serial2: [['RX', '13'], ['TX', '12']]
    },
    serialSpeed: [['300', '300'], ['600', '600'], ['1200', '1200'],
    ['2400', '2400'], ['4800', '4800'], ['9600', '9600'],
    ['14400', '14400'], ['19200', '19200'], ['28800', '28800'],
    ['31250', '31250'], ['38400', '38400'], ['57600', '57600'],
    ['115200', '115200']],
    spi: [['SPI', 'SPI']],
    spiPins: { SPI: [['MOSI', '19'], ['MISO', '21'], ['SCK', '20']] },
    spiClockDivide: [['2 (8MHz)', 'SPI_CLOCK_DIV2'],
    ['4 (4MHz)', 'SPI_CLOCK_DIV4'],
    ['8 (2MHz)', 'SPI_CLOCK_DIV8'],
    ['16 (1MHz)', 'SPI_CLOCK_DIV16'],
    ['32 (500KHz)', 'SPI_CLOCK_DIV32'],
    ['64 (250KHz)', 'SPI_CLOCK_DIV64'],
    ['128 (125KHz)', 'SPI_CLOCK_DIV128']],
    i2c: [['I2C', 'Wire']],
    i2cPins: { Wire: [['SDA', '17'], ['SCL', '16']] },
    i2cSpeed: [['100kHz', '100000L'], ['400kHz', '400000L']],
    builtinLed: [['BUILTIN_1', '7'], ['BUILTIN_2', '8']],
    interrupt: [['interrupt1', '1'], ['interrupt2', '2'], ['interrupt3', '3'], ['interrupt4', '4'], ['interrupt5', '5'], ['interrupt6', '6']],
    analogPins: [['A1', 'A1'], ['A2', 'A2'], ['A3', 'A3'], ['A4', 'A4'], ['A5', 'A5'], ['A6', 'A6']],
    serial_baud_rate: 9600,
    parseKey: '_*_'
};

export const selectedBoard = () => {
    return sensebox_mcu;
};
