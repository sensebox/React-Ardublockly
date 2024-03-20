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
  if(!mac_address.startsWith("{")) {
    mac_address = mac_address.replaceAll(":",", 0x");
    mac_address = "{ 0x" + mac_address + " }";
  }
  Blockly.Arduino.variables_["mac_address"] = `uint8_t mac_address[] = ${mac_address};`;
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
  Blockly.Arduino.definitions_["define_macadress"] = "String mac_address;";
  Blockly.Arduino.setupCode_["sensebox_get_mac"] = " mac_address = WiFi.macAddress();";
  var code = "mac_address";
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.sensebox_esp_now_receive = function (Block) {
  var id = Block.getFieldValue("VAR")
  const variable = Blockly.Variables.getVariable(
    Blockly.getMainWorkspace(),
    id
  );
  Blockly.Arduino.variables_[variable.name] = variable.type + " " + variable.name + ";\n";
  let branch = Blockly['Arduino'].statementToCode(Block, 'DO');
  branch = Blockly['Arduino'].addLoopTrap(branch, Block.id);
  Blockly.Arduino.codeFunctions_["on_data_receive"] = `
  void OnDataRecv(const uint8_t * mac, const uint8_t *incomingData, int len) {
    ` + variable.name + ` = (char*)incomingData;
  ` + branch +`
  }
  `
  let code = "esp_now_register_recv_cb(OnDataRecv);";
  return code;
};

Blockly.Arduino.sensebox_esp_now_send = function () {
  var value =
    Blockly.Arduino.valueToCode(this, "value", Blockly.Arduino.ORDER_ATOMIC) ||
    `" "`;
  // TODO test if all variable types work
  var code = `esp_err_t result = esp_now_send(mac_address, (const uint8_t*)` + value + `, sizeof(` + value + `));`;
  return code;
};


