import Blockly from "blockly";

Blockly.Arduino.sensebox_esp_now = function () {
  Blockly.Arduino.libraries_["library_ESP_Now"] = "#include <esp_now.h>";
  Blockly.Arduino.libraries_["library_WiFi"] = "#include <WiFi.h>";
  Blockly.Arduino.setupCode_["esp_now_begin"] = `
  WiFi.mode(WIFI_STA);
  if (esp_now_init() != ESP_OK){
    return;
  }`;
  var code = "";
  return code;
};

Blockly.Arduino.sensebox_esp_now_sender = function () {
  var mac_address = this.getFieldValue("mac-address");
  Blockly.Arduino.variables_["mac_address"] = `uint8_t mac_address[] = "${mac_address}";`;
  Blockly.Arduino.variables_["peer_info"] = `esp_now_peer_info_t peerInfo;`;
  Blockly.Arduino.setupCode_["esp_now_sender"] = `
  memcpy(peerInfo.peer_addr, mac_address, 6);
  peerInfo.channel = 0;
  peerInfo.encrypt = false;
  if (esp_now_add_peer(&peerInfo) != ESP_OK){
      return;
  }`;
  var code = "";
  return code;
};

Blockly.Arduino.sensebox_get_mac = function () {
  Blockly.Arduino.definitions_["define_macadress"] = "macAddress mac;";
  Blockly.Arduino.setupCode_["sensebox_get_mac"] = " mac = WiFi.macAddress();";
  var code = "mac";
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.sensebox_esp_now_receive = function (Block) {
  const variableName =
        Blockly['Arduino'].valueToCode(
            Block,
            'MSG',
            Blockly['Arduino'].ORDER_ASSIGNMENT
        ) || "";
  const allVars = Blockly.getMainWorkspace()
    .getVariableMap()
    .getAllVariables();
  const myVar = allVars.filter((v) => v.name === variableName)[0];
  if (myVar !== undefined) {
    Blockly.Arduino.variables_[variableName + myVar.type] =
    myVar.type + " " + myVar.name + ";\n";
  }
  let branch = Blockly['Arduino'].statementToCode(Block, 'DO');
  branch = Blockly['Arduino'].addLoopTrap(branch, Block.id);
  Blockly.Arduino.codeFunctions_["on_data_receive"] = `
    void OnDataRecv(const uint8_t * mac, const uint8_t *incomingData, int len) {`;
  if (myVar !== undefined) {
    Blockly.Arduino.codeFunctions_["on_data_receive"] += `
      ` + myVar.name + ` = incomingData;`;
  }
  Blockly.Arduino.codeFunctions_["on_data_receive"] += `
  `+ branch +`
  }
  `
  let code = "esp_now_register_recv_cb(OnDataRecv);";
  Blockly.Arduino.definitions_["define_macadress"] = "macAddress mac;";
  Blockly.Arduino.setupCode_["sensebox_get_mac"] = " mac = WiFi.macAddress();";
  return code;
};

Blockly.Arduino.sensebox_esp_now_send = function () {
  var value =
    Blockly.Arduino.valueToCode(this, "value", Blockly.Arduino.ORDER_ATOMIC) ||
    `" "`;
  var code = `esp_err_t result = esp_now_send(mac_address, (const uint8_t*)` + value + `, sizeof(` + value + `));`;
  return code;
};


