import * as Blockly from "blockly";

Blockly.Generator.Arduino.forBlock["sensebox_esp_now"] = function () {
  Blockly.Generator.Arduino.libraries_["library_ESP_Now"] =
    "#include <esp_now.h>";
  Blockly.Generator.Arduino.libraries_["library_WiFi"] = "#include <WiFi.h>";
  Blockly.Generator.Arduino.setupCode_["esp_now_begin"] = `
  WiFi.mode(WIFI_STA);
  if (esp_now_init() != ESP_OK){
    return;
  }`;
  var code = "";
  return code;
};

Blockly.Generator.Arduino.forBlock["sensebox_esp_now_sender"] = function () {
  var mac_address = this.getFieldValue("mac-address");
  if (!mac_address.startsWith("{")) {
    mac_address = mac_address.replaceAll(":", ", 0x");
    mac_address = "{ 0x" + mac_address + " }";
  }
  Blockly.Generator.Arduino.variables_["peer_info"] =
    `esp_now_peer_info_t peerInfo;`;
  Blockly.Generator.Arduino.setupCode_["esp_now_sender"] = `
  peerInfo.channel = 0;
  peerInfo.encrypt = false;`;
  var code = `
  memcpy(peerInfo.peer_addr, new uint8_t[6] ${mac_address}, 6);
  if (esp_now_add_peer(&peerInfo) != ESP_OK){
      return;
  }`;
  return code;
};

Blockly.Generator.Arduino.forBlock["sensebox_get_mac"] = function () {
  Blockly.Generator.Arduino.definitions_["define_macadress"] =
    "String mac_address;";
  Blockly.Generator.Arduino.setupCode_["sensebox_get_mac"] =
    " mac_address = WiFi.macAddress();";
  var code = "mac_address";
  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};

Blockly.Generator.Arduino.forBlock["sensebox_esp_now_receive"] = function (
  block,
  generator,
) {
  var idMessage = block.getFieldValue("VAR");
  const varMessage = Blockly.Variables.getVariable(
    Blockly.getMainWorkspace(),
    idMessage,
  );
  var idAddress = block.getFieldValue("MAC");
  const varAddress = Blockly.Variables.getVariable(
    Blockly.getMainWorkspace(),
    idAddress,
  );
  Blockly.Generator.Arduino.variables_[varMessage.name + varMessage.type] =
    varMessage.type + " " + varMessage.name + ";\n";
  Blockly.Generator.Arduino.variables_[varAddress.name + varAddress.type] =
    varAddress.type + " " + varAddress.name + ";\n";
  let branch = Blockly.Generator.Arduino.statementToCode(block, "DO");
  branch = Blockly.Generator.Arduino.addLoopTrap(branch, block.id);
  Blockly.Generator.Arduino.codeFunctions_["on_data_receive"] = `
  void OnDataRecv(const uint8_t * mac, const uint8_t *incomingData, int len) {
    ${varMessage.name} = (char*)incomingData;
    ${varAddress.name} = String(mac[0],HEX) + ":" + String(mac[1],HEX) + ":" + String(mac[2],HEX) + ":" + String(mac[3],HEX) + ":" + String(mac[4],HEX) + ":" + String(mac[5],HEX);
    mac_address.toUpperCase();
  ${branch}
  }
  `;
  let code = "esp_now_register_recv_cb(OnDataRecv);";
  return code;
};

Blockly.Generator.Arduino.forBlock["sensebox_esp_now_send"] = function () {
  var value =
    Blockly.Generator.Arduino.valueToCode(
      this,
      "value",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
    ) || `" "`;

  var mac_address = this.getFieldValue("mac-address");
  if (!mac_address.startsWith("{")) {
    mac_address = mac_address.replaceAll(":", ", 0x");
    mac_address = "{ 0x" + mac_address + " }";
  }
  var code = `
  esp_now_send(new uint8_t[6] ${mac_address}, (const uint8_t*)String(${value}).c_str(), sizeof(String(${value}).c_str()));
  delay(5);`;
  return code;
};
