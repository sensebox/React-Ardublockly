import * as Blockly from "blockly";
/**
 * Webserver Blocks by Lucas Steinmann
 *
 */

Blockly.Generator.Arduino.forBlock["sensebox_initialize_http_server"] =
  function (block, generator) {
    var box_id = this.getFieldValue("Port");
    Blockly.Generator.Arduino.libraries_["library_http"] =
      "#include <WebUtil.h>";

    Blockly.Generator.Arduino.codeFunctions_["define_wifi_server"] =
      "WiFiServer server(" + box_id + ");";
    Blockly.Generator.Arduino.setupCode_["sensebox_wifi_server_beging"] =
      "server.begin();";
    return "";
  };

Blockly.Generator.Arduino.forBlock["sensebox_http_on_client_connect"] =
  function (block, generator) {
    var onConnect = Blockly.Generator.Arduino.statementToCode(
      block,
      "ON_CONNECT",
    );
    var code = "";
    code += "WiFiClient client = server.available();\n";
    code += "if (client && client.available()) {\n";
    code += "  String request_string = listenClient(client);\n";
    code += "  Request request;\n";
    code += "  if (parseRequestSafe(request_string, request)) {\n";
    code += onConnect;
    code += "  }\n";
    code += "  delay(1);\n";
    code += "  client.stop();\n";
    code += "  delay(1);\n";
    code += "}\n";
    return code;
  };

Blockly.Generator.Arduino.forBlock["sensebox_http_method"] = function (
  block,
  generator,
) {
  var code = "request.method";
  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};

Blockly.Generator.Arduino.forBlock["sensebox_http_uri"] = function (
  block,
  generator,
) {
  var code = "request.uri";
  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};

Blockly.Generator.Arduino.forBlock["sensebox_http_protocol_version"] =
  function (block, generator) {
    var code = "request.protocol_version";
    return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
  };

Blockly.Generator.Arduino.forBlock["sensebox_http_user_agent"] = function (
  block,
  generator,
) {
  var code = "request.user_agent";
  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};

Blockly.Generator.Arduino.forBlock["sensebox_generate_html_doc"] = function (
  block,
  generator,
) {
  var header =
    Blockly.Generator.Arduino.valueToCode(
      block,
      "HEADER",
      Blockly.Generator.Arduino.ORDER_NONE,
    ) || '""';
  var body =
    Blockly.Generator.Arduino.valueToCode(
      block,
      "BODY",
      Blockly.Generator.Arduino.ORDER_NONE,
    ) || '""';
  var code = "buildHTML(" + header + ", " + body + ")";
  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};

Blockly.Generator.Arduino.sensebox_generate_http_succesful_response = function (
  block,
) {
  var content =
    Blockly.Generator.Arduino.valueToCode(
      block,
      "CONTENT",
      Blockly.Generator.Arduino.ORDER_NONE,
    ) || '""';
  var code =
    "client.println(buildSuccessfulResponse(request, " + content + "));\n";
  return code;
};

Blockly.Generator.Arduino.sensebox_generate_http_not_found_response = function (
  block,
) {
  var code = "client.println(buildNotFoundResponse(request));\n";
  return code;
};

Blockly.Generator.Arduino.forBlock["sensebox_ip_address"] = function (
  block,
  generator,
) {
  var code = "b->getIpAddress()";
  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};

Blockly.Generator.Arduino.forBlock["sensebox_general_html_tag"] = function (
  block,
  generator,
) {
  var tag = this.getFieldValue("TAG");
  var code = 'buildTag("' + tag + '",';
  var n = 0;
  var branch = Blockly.Generator.Arduino.valueToCode(
    block,
    "DO" + n,
    Blockly.Generator.Arduino.ORDER_NONE,
  );
  if (branch.length > 0) {
    code += "\n " + branch;
  } else {
    code += '""';
  }
  for (n = 1; n <= block.additionalChildCount_; n++) {
    branch = Blockly.Generator.Arduino.valueToCode(
      block,
      "DO" + n,
      Blockly.Generator.Arduino.ORDER_NONE,
    );
    code += " +" + branch;
  }
  return [code + ")", Blockly.Generator.Arduino.ORDER_ATOMIC];
};

Blockly.Generator.Arduino.forBlock["sensebox_web_readHTML"] = function (
  block,
  generator,
) {
  var filename = this.getFieldValue("FILENAME");
  Blockly.Generator.Arduino.libraries_["library_spi"] = "#include <SPI.h>";
  Blockly.Generator.Arduino.libraries_["library_sd"] = "#include <SD.h>";
  Blockly.Generator.Arduino.codeFunctions_["define_sd" + filename] =
    "File webFile;";
  Blockly.Generator.Arduino.setupCode_["sensebox_sd"] = "SD.begin(28);";
  Blockly.Generator.Arduino.codeFunctions_["readHTML"] =
    `String readHTML(String filename){
    webFile = SD.open(filename, FILE_READ);
    String finalString = "";
    while (webFile.available()) {
      finalString += (char)webFile.read();
    }
    return finalString;
  }`;
  var code = `readHTML("${filename}")`;
  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};
