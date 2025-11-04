import * as Blockly from "blockly/core";

Blockly.Generator.Arduino.forBlock["sensebox_lora_initialize_otaa"] = function (
  block,
  generator,
) {
  var deivceID = this.getFieldValue("DEVICEID");
  var appID = this.getFieldValue("APPID");
  var appKey = this.getFieldValue("APPKEY");
  var interval = this.getFieldValue("INTERVAL");
  Blockly.Generator.Arduino.libraries_["library_spi"] = "#include <SPI.h>";
  Blockly.Generator.Arduino.libraries_["library_lmic"] =
    "#include <lmic.h> // http://librarymanager/All#IBM_LMIC_framework";
  Blockly.Generator.Arduino.libraries_["library_hal"] = "#include <hal/hal.h>";
  Blockly.Generator.Arduino.definitions_["define_LoRaVariablesOTAA"] = `
    static const u1_t PROGMEM APPEUI[8]= {${appID}};
    void os_getArtEui (u1_t* buf) { memcpy_P(buf, APPEUI , 8);}
  
    static const u1_t PROGMEM DEVEUI[8]= {${deivceID}};
    void os_getDevEui (u1_t* buf) { memcpy_P(buf, DEVEUI , 8);}
  
    // This key should be in big endian format (or, since it is not really a
    // number but a block of memory, endianness does not really apply). In
    // practice, a key taken from ttnctl can be copied as-is.
    // The key shown here is the semtech default key.
    static const u1_t PROGMEM APPKEY[16] = {${appKey}};
    void os_getDevKey (u1_t* buf) {  memcpy_P(buf, APPKEY , 16);}
  
    static osjob_t sendjob;
  
    // Schedule TX every this many seconds (might become longer due to duty
    // cycle limitations).
    const unsigned TX_INTERVAL = ${interval * 60};
  
    // Pin mapping
    const lmic_pinmap lmic_pins = {
        .nss = PIN_XB1_CS,
        .rxtx = LMIC_UNUSED_PIN,
        .rst = LMIC_UNUSED_PIN,
        .dio = {PIN_XB1_INT, PIN_XB1_INT, LMIC_UNUSED_PIN},
    };`;

  Blockly.Generator.Arduino.codeFunctions_["functions_initLora"] = `
    void initLora() {
      delay(2000);
      // LMIC init
      os_init();
      // Reset the MAC state. Session and pending data transfers will be discarded.
      LMIC_reset();
    
      // Start job (sending automatically starts OTAA too)
      do_send(&sendjob);
    }`;

  Blockly.Generator.Arduino.codeFunctions_["functions_onEvent"] = `
    void onEvent (ev_t ev) {
      Serial.print(os_getTime());
      Serial.print(": ");
      switch(ev) {
          case EV_SCAN_TIMEOUT:
              Serial.println(F("EV_SCAN_TIMEOUT"));
              break;
          case EV_BEACON_FOUND:
              Serial.println(F("EV_BEACON_FOUND"));
              break;
          case EV_BEACON_MISSED:
              Serial.println(F("EV_BEACON_MISSED"));
              break;
          case EV_BEACON_TRACKED:
              Serial.println(F("EV_BEACON_TRACKED"));
              break;
          case EV_JOINING:
              Serial.println(F("EV_JOINING"));
              break;
          case EV_JOINED:
              Serial.println(F("EV_JOINED"));
  
              // Disable link check validation (automatically enabled
              // during join, but not supported by TTN at this time).
              LMIC_setLinkCheckMode(0);
              break;
          case EV_RFU1:
              Serial.println(F("EV_RFU1"));
              break;
          case EV_JOIN_FAILED:
              Serial.println(F("EV_JOIN_FAILED"));
              break;
          case EV_REJOIN_FAILED:
              Serial.println(F("EV_REJOIN_FAILED"));
              break;
              break;
          case EV_TXCOMPLETE:
              Serial.println(F("EV_TXCOMPLETE (includes waiting for RX windows)"));
              if (LMIC.txrxFlags & TXRX_ACK)
                Serial.println(F("Received ack"));
              if (LMIC.dataLen) {
                Serial.println(F("Received "));
                Serial.println(LMIC.dataLen);
                Serial.println(F(" bytes of payload"));
              }
              // Schedule next transmission
              os_setTimedCallback(&sendjob, os_getTime()+sec2osticks(TX_INTERVAL), do_send);
              break;
          case EV_LOST_TSYNC:
              Serial.println(F("EV_LOST_TSYNC"));
              break;
          case EV_RESET:
              Serial.println(F("EV_RESET"));
              break;
          case EV_RXCOMPLETE:
              // data received in ping slot
              Serial.println(F("EV_RXCOMPLETE"));
              break;
          case EV_LINK_DEAD:
              Serial.println(F("EV_LINK_DEAD"));
              break;
          case EV_LINK_ALIVE:
              Serial.println(F("EV_LINK_ALIVE"));
              break;
           default:
              Serial.println(F("Unknown event"));
              break;
      }
  }`;
  Blockly.Generator.Arduino.loraSetupCode_["initLora"] = "initLora();\n";
  Blockly.Generator.Arduino.setupCode_["serial.begin"] =
    "Serial.begin(9600);\ndelay(1000);\n";
  var code = "";
  return code;
};

Blockly.Generator.Arduino.forBlock["sensebox_lora_message_send"] = function (
  block,
  generator,
) {
  Blockly.Generator.Arduino.libraries_["library_lora_message"] =
    "#include <LoraMessage.h>";
  var lora_sensor_values = Blockly.Generator.Arduino.statementToCode(
    block,
    "DO",
  );
  Blockly.Generator.Arduino.functionNames_["functions_do_send"] = `
  void do_send(osjob_t* j){
      // Check if there is not a current TX/RX job running
      if (LMIC.opmode & OP_TXRXPEND) {
          Serial.println(F("OP_TXRXPEND, not sending"));
      } else {
        LoraMessage message;
        ${lora_sensor_values}
  
        // Prepare upstream data transmission at the next possible time.
        LMIC_setTxData2(1, message.getBytes(), message.getLength(), 0);
        Serial.println(F("Packet queued"));
      }
      // Next TX is scheduled after TX_COMPLETE event.
  }`;
  Blockly.Generator.Arduino.loopCodeOnce_["os_runloop"] = "os_runloop_once();";
  return "";
};

/**
 * Block send Data to TTN
 */
Blockly.Generator.Arduino.forBlock["sensebox_send_lora_sensor_value"] =
  function (block, generator) {
    const reading =
      Blockly.Generator.Arduino.valueToCode(
        this,
        "Value",
        Blockly.Generator.Arduino.ORDER_ATOMIC,
      ) || '"Keine Eingabe"';
    var messageBytes = this.getFieldValue("MESSAGE_BYTES");
    var code = "";
    switch (Number(messageBytes)) {
      case 1:
        code = `message.addUint8(${reading});\n`;
        break;
      case 2:
        code = `message.addUint16(${reading});\n`;
        break;
      case 3:
        code = `message.addUint8(${reading});
        message.addUint16(${reading} >> 8);\n`;
        break;
      default:
        code = `message.addUint16(${reading});\n`;
    }
    return code;
  };

Blockly.Generator.Arduino.forBlock["sensebox_lora_cayenne_send"] = function (
  block,
  generator,
) {
  Blockly.Generator.Arduino.libraries_["library_cayene"] =
    "#include <CayenneLPP.h> // http://librarymanager/All#CayenneLPP";
  Blockly.Generator.Arduino.variables_["variable_cayenne"] =
    "CayenneLPP lpp(51);";
  var lora_sensor_values = Blockly.Generator.Arduino.statementToCode(
    block,
    "DO",
  );
  Blockly.Generator.Arduino.functionNames_["functions_do_send"] = `
  void do_send(osjob_t* j){
      // Check if there is not a current TX/RX job running
      if (LMIC.opmode & OP_TXRXPEND) {
          Serial.println(F("OP_TXRXPEND, not sending"));
      } else {
          lpp.reset();
          ${lora_sensor_values}
  
          // Prepare upstream data transmission at the next possible time.
          LMIC_setTxData2(1, lpp.getBuffer(), lpp.getSize(), 0);
          Serial.println(F("Packet queued"));
      }
      // Next TX is scheduled after TX_COMPLETE event.
  }`;
  Blockly.Generator.Arduino.loopCodeOnce_["os_runloop"] = "os_runloop_once();";
  return "";
};

Blockly.Generator.Arduino.forBlock["sensebox_lora_ttn_mapper"] = function (
  block,
  generator,
) {
  var latitude = Blockly.Generator.Arduino.valueToCode(
    this,
    "Latitude",
    Blockly.Generator.Arduino.ORDER_ATOMIC,
  );
  var longitude = Blockly.Generator.Arduino.valueToCode(
    this,
    "Longitude",
    Blockly.Generator.Arduino.ORDER_ATOMIC,
  );
  var altitude = Blockly.Generator.Arduino.valueToCode(
    this,
    "Altitude",
    Blockly.Generator.Arduino.ORDER_ATOMIC,
  );
  var pDOP = Blockly.Generator.Arduino.valueToCode(
    this,
    "pDOP",
    Blockly.Generator.Arduino.ORDER_ATOMIC,
  );
  var fixType = Blockly.Generator.Arduino.valueToCode(
    this,
    "Fix Type",
    Blockly.Generator.Arduino.ORDER_ATOMIC,
  );
  var fixTypeLimit = this.getFieldValue("dropdown");
  Blockly.Generator.Arduino.functionNames_["functions_do_send"] = `
  void do_send(osjob_t* j){
      // Check if there is not a current TX/RX job running
      if (LMIC.opmode & OP_TXRXPEND) {
          Serial.println(F("OP_TXRXPEND, not sending"));
      } else {
          
        int fixType = ${fixType};
        if (fixType >= ${fixTypeLimit}) { // we have a 3D fix
          int32_t latitude = ${latitude};       // in degrees * 10^-7
          int32_t longitude = ${longitude};     // in degrees * 10^-7
          int32_t altitude = ${altitude} / 100;      // in dm above mean sea level
          uint16_t pDOP = ${pDOP};                 //  positional dillution of precision
    
          uint8_t data[12];
    
          data[0] = latitude;
          data[1] = latitude >> 8;
          data[2] = latitude >> 16;
          data[3] = latitude >> 24;
    
          data[4] = longitude;
          data[5] = longitude >> 8;
          data[6] = longitude >> 16;
          data[7] = longitude >> 24;
    
          data[8] = altitude;
          data[9] = altitude >> 8;
    
          data[10] = pDOP;
          data[11] = pDOP >> 8;
    
    
          // Prepare upstream data transmission at the next possible time.
          LMIC_setTxData2(1, data, sizeof(data), 0);
          Serial.println(F("Packet queued"));
        } else {
          // wait for better fix type
          os_setTimedCallback(&sendjob, os_getTime() + sec2osticks(TX_INTERVAL), do_send);
        }
      }
      // Next TX is scheduled after TX_COMPLETE event.
  }`;
  Blockly.Generator.Arduino.loopCodeOnce_["os_runloop"] = "os_runloop_once();";
  return "";
};

Blockly.Generator.Arduino.forBlock["sensebox_lora_initialize_abp"] = function (
  block,
  generator,
) {
  var nwskey = this.getFieldValue("NWSKEY");
  var appskey = this.getFieldValue("APPSKEY");
  var devaddr = this.getFieldValue("DEVADDR");
  var interval = this.getFieldValue("INTERVAL");
  Blockly.Generator.Arduino.libraries_["library_spi"] = "#include <SPI.h>";
  Blockly.Generator.Arduino.libraries_["library_lmic"] = "#include <lmic.h>";
  Blockly.Generator.Arduino.libraries_["library_hal"] = "#include <hal/hal.h>";
  Blockly.Generator.Arduino.definitions_["define_LoRaVariablesABP"] = `
    // LoRaWAN NwkSKey, network session key
    // This is the default Semtech key, which is used by the early prototype TTN
    // network.
    static const PROGMEM u1_t NWKSKEY[16] = { ${nwskey} };
    
    // LoRaWAN AppSKey, application session key
    // This is the default Semtech key, which is used by the early prototype TTN
    // network.
    static const u1_t PROGMEM APPSKEY[16] = { ${appskey} };
    
    // LoRaWAN end-device address (DevAddr)
    static const u4_t DEVADDR = 0x${devaddr};
    
    // These callbacks are only used in over-the-air activation, so they are
    // left empty here (we cannot leave them out completely unless
    // DISABLE_JOIN is set in config.h, otherwise the linker will complain).
    void os_getArtEui (u1_t* buf) { }
    void os_getDevEui (u1_t* buf) { }
    void os_getDevKey (u1_t* buf) { }
    
    static osjob_t sendjob;
    
    // Schedule TX every this many seconds (might become longer due to duty
    // cycle limitations).
    const unsigned TX_INTERVAL = ${interval * 60};
    
    // Pin mapping
    const lmic_pinmap lmic_pins = {
        .nss = PIN_XB1_CS,
        .rxtx = LMIC_UNUSED_PIN,
        .rst = LMIC_UNUSED_PIN,
        .dio = {PIN_XB1_INT, PIN_XB1_INT, LMIC_UNUSED_PIN},
    };`;

  Blockly.Generator.Arduino.codeFunctions_["functions_initLora"] = `
    void initLora() {
      delay(2000);
      // LMIC init
      os_init();
      // Reset the MAC state. Session and pending data transfers will be discarded.
      LMIC_reset();
  
      // Set static session parameters. Instead of dynamically establishing a session
      // by joining the network, precomputed session parameters are be provided.
      #ifdef PROGMEM
      // On AVR, these values are stored in flash and only copied to RAM
      // once. Copy them to a temporary buffer here, LMIC_setSession will
      // copy them into a buffer of its own again.
      uint8_t appskey[sizeof(APPSKEY)];
      uint8_t nwkskey[sizeof(NWKSKEY)];
      memcpy_P(appskey, APPSKEY, sizeof(APPSKEY));
      memcpy_P(nwkskey, NWKSKEY, sizeof(NWKSKEY));
      LMIC_setSession (0x1, DEVADDR, nwkskey, appskey);
      #else
      // If not running an AVR with PROGMEM, just use the arrays directly
      LMIC_setSession (0x1, DEVADDR, NWKSKEY, APPSKEY);
      #endif
  
      #if defined(CFG_eu868)
      // Set up the channels used by the Things Network, which corresponds
      // to the defaults of most gateways. Without this, only three base
      // channels from the LoRaWAN specification are used, which certainly
      // works, so it is good for debugging, but can overload those
      // frequencies, so be sure to configure the full frequency range of
      // your network here (unless your network autoconfigures them).
      // Setting up channels should happen after LMIC_setSession, as that
      // configures the minimal channel set.
      // NA-US channels 0-71 are configured automatically
      LMIC_setupChannel(0, 868100000, DR_RANGE_MAP(DR_SF12, DR_SF7),  BAND_CENTI);      // g-band
      LMIC_setupChannel(1, 868300000, DR_RANGE_MAP(DR_SF12, DR_SF7B), BAND_CENTI);      // g-band
      LMIC_setupChannel(2, 868500000, DR_RANGE_MAP(DR_SF12, DR_SF7),  BAND_CENTI);      // g-band
      LMIC_setupChannel(3, 867100000, DR_RANGE_MAP(DR_SF12, DR_SF7),  BAND_CENTI);      // g-band
      LMIC_setupChannel(4, 867300000, DR_RANGE_MAP(DR_SF12, DR_SF7),  BAND_CENTI);      // g-band
      LMIC_setupChannel(5, 867500000, DR_RANGE_MAP(DR_SF12, DR_SF7),  BAND_CENTI);      // g-band
      LMIC_setupChannel(6, 867700000, DR_RANGE_MAP(DR_SF12, DR_SF7),  BAND_CENTI);      // g-band
      LMIC_setupChannel(7, 867900000, DR_RANGE_MAP(DR_SF12, DR_SF7),  BAND_CENTI);      // g-band
      LMIC_setupChannel(8, 868800000, DR_RANGE_MAP(DR_FSK,  DR_FSK),  BAND_MILLI);      // g2-band
      // TTN defines an additional channel at 869.525Mhz using SF9 for class B
      // devices' ping slots. LMIC does not have an easy way to define set this
      // frequency and support for class B is spotty and untested, so this
      // frequency is not configured here.
      #elif defined(CFG_us915)
      // NA-US channels 0-71 are configured automatically
      // but only one group of 8 should (a subband) should be active
      // TTN recommends the second sub band, 1 in a zero based count.
      // https://github.com/TheThingsNetwork/gateway-conf/blob/master/US-global_conf.json
      LMIC_selectSubBand(1);
      #endif
  
      // Disable link check validation
      LMIC_setLinkCheckMode(0);
  
      // TTN uses SF9 for its RX2 window.
      LMIC.dn2Dr = DR_SF9;
  
      // Set data rate and transmit power for uplink (note: txpow seems to be ignored by the library)
      LMIC_setDrTxpow(DR_SF7,14);
  
      // Start job
      do_send(&sendjob);
    }`;

  Blockly.Generator.Arduino.codeFunctions_["functions_onEvent"] = `
    void onEvent (ev_t ev) {
      Serial.print(os_getTime());
      Serial.print(": ");
      switch(ev) {
          case EV_SCAN_TIMEOUT:
              Serial.println(F("EV_SCAN_TIMEOUT"));
              break;
          case EV_BEACON_FOUND:
              Serial.println(F("EV_BEACON_FOUND"));
              break;
          case EV_BEACON_MISSED:
              Serial.println(F("EV_BEACON_MISSED"));
              break;
          case EV_BEACON_TRACKED:
              Serial.println(F("EV_BEACON_TRACKED"));
              break;
          case EV_JOINING:
              Serial.println(F("EV_JOINING"));
              break;
          case EV_JOINED:
              Serial.println(F("EV_JOINED"));
              break;
          case EV_RFU1:
              Serial.println(F("EV_RFU1"));
              break;
          case EV_JOIN_FAILED:
              Serial.println(F("EV_JOIN_FAILED"));
              break;
          case EV_REJOIN_FAILED:
              Serial.println(F("EV_REJOIN_FAILED"));
              break;
          case EV_TXCOMPLETE:
              Serial.println(F("EV_TXCOMPLETE (includes waiting for RX windows)"));
              if (LMIC.txrxFlags & TXRX_ACK)
                Serial.println(F("Received ack"));
              if (LMIC.dataLen) {
                Serial.println(F("Received "));
                Serial.println(LMIC.dataLen);
                Serial.println(F(" bytes of payload"));
              }
              // Schedule next transmission
              os_setTimedCallback(&sendjob, os_getTime()+sec2osticks(TX_INTERVAL), do_send);
              break;
          case EV_LOST_TSYNC:
              Serial.println(F("EV_LOST_TSYNC"));
              break;
          case EV_RESET:
              Serial.println(F("EV_RESET"));
              break;
          case EV_RXCOMPLETE:
              // data received in ping slot
              Serial.println(F("EV_RXCOMPLETE"));
              break;
          case EV_LINK_DEAD:
              Serial.println(F("EV_LINK_DEAD"));
              break;
          case EV_LINK_ALIVE:
              Serial.println(F("EV_LINK_ALIVE"));
              break;
           default:
              Serial.println(F("Unknown event"));
              break;
      }
  }`;
  Blockly.Generator.Arduino.loraSetupCode_["initLora"] = "initLora();\n";
  Blockly.Generator.Arduino.setupCode_["serial.begin"] =
    "Serial.begin(9600);\ndelay(1000);\n";
  return "";
};

Blockly.Generator.Arduino.forBlock["sensebox_lora_cayenne_temperature"] =
  function (block, generator) {
    var temperature =
      Blockly.Generator.Arduino.valueToCode(
        this,
        "Value",
        Blockly.Generator.Arduino.ORDER_ATOMIC,
      ) || 0;
    var channel = this.getFieldValue("CHANNEL");
    var code = `lpp.addTemperature(${channel}, ${temperature});\n`;
    return code;
  };

Blockly.Generator.Arduino.forBlock["sensebox_lora_cayenne_humidity"] =
  function (block, generator) {
    var humidity =
      Blockly.Generator.Arduino.valueToCode(
        this,
        "Value",
        Blockly.Generator.Arduino.ORDER_ATOMIC,
      ) || 0;
    var channel = this.getFieldValue("CHANNEL");
    var code = `lpp.addRelativeHumidity(${channel}, ${humidity});\n`;
    return code;
  };

Blockly.Generator.Arduino.forBlock["sensebox_lora_cayenne_pressure"] =
  function (block, generator) {
    var pressure =
      Blockly.Generator.Arduino.valueToCode(
        this,
        "Value",
        Blockly.Generator.Arduino.ORDER_ATOMIC,
      ) || 0;
    var channel = this.getFieldValue("CHANNEL");
    var code = `lpp.addBarometricPressure(${channel}, ${pressure});\n`;
    return code;
  };

Blockly.Generator.Arduino.forBlock["sensebox_lora_cayenne_luminosity"] =
  function (block, generator) {
    var luminosity =
      Blockly.Generator.Arduino.valueToCode(
        this,
        "Value",
        Blockly.Generator.Arduino.ORDER_ATOMIC,
      ) || 0;
    var channel = this.getFieldValue("CHANNEL");
    var code = `lpp.addLuminosity(${channel}, ${luminosity});\n`;
    return code;
  };

Blockly.Generator.Arduino.forBlock["sensebox_lora_cayenne_sensor"] = function (
  block,
  generator,
) {
  var sensorValue =
    Blockly.Generator.Arduino.valueToCode(
      this,
      "Value",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
    ) || 0;
  var channel = this.getFieldValue("CHANNEL");
  var code = `lpp.addAnalogInput(${channel}, ${sensorValue});\n`;
  return code;
};

Blockly.Generator.Arduino.sensebox_lora_cayenne_accelerometer = function (
  block,
) {
  var x =
    Blockly.Generator.Arduino.valueToCode(
      this,
      "X",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
    ) || 0;
  var y =
    Blockly.Generator.Arduino.valueToCode(
      this,
      "Y",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
    ) || 0;
  var z =
    Blockly.Generator.Arduino.valueToCode(
      this,
      "Z",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
    ) || 0;
  var channel = this.getFieldValue("CHANNEL");
  var code = `lpp.addAccelerometer(${channel}, ${x}, ${y}, ${z});\n`;
  return code;
};

Blockly.Generator.Arduino.forBlock["sensebox_lora_cayenne_gps"] = function (
  block,
  generator,
) {
  var lat =
    Blockly.Generator.Arduino.valueToCode(
      this,
      "LAT",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
    ) || 0;
  var lng =
    Blockly.Generator.Arduino.valueToCode(
      this,
      "LNG",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
    ) || 0;
  var alt =
    Blockly.Generator.Arduino.valueToCode(
      this,
      "ALT",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
    ) || 0;
  var channel = this.getFieldValue("CHANNEL");
  var code = `lpp.addGPS(${channel}, ${lat}, ${lng}, ${alt});\n`;
  return code;
};

Blockly.Generator.Arduino.forBlock["sensebox_lora_cayenne_concentration"] =
  function (block) {
    var value =
      Blockly.Generator.Arduino.valueToCode(
        this,
        "Value",
        Blockly.Generator.Arduino.ORDER_ATOMIC,
      ) || 0;
    var channel = this.getFieldValue("CHANNEL");
    var code = `lpp.addConcentration(${channel}, ${value});\n`;
    return code;
  };
