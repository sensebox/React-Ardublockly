import Blockly from 'blockly';
/**
 * Webserver Blocks by Lucas Steinmann
 * 
 */

Blockly.Arduino.sensebox_initialize_http_server = function (block) {
    var box_id = this.getFieldValue('Port');
    Blockly.Arduino.libraries_['library_senseBoxMCU'] = '#include "SenseBoxMCU.h"';
    Blockly.Arduino.codeFunctions_['define_wifi_server'] = 'WiFiServer server(' + box_id + ');';
    Blockly.Arduino.setupCode_['sensebox_wifi_server_beging'] = 'server.begin();';
    return '';
};

Blockly.Arduino.sensebox_http_on_client_connect = function (block) {
    var onConnect = Blockly.Arduino.statementToCode(block, 'ON_CONNECT');
    var code = '';
    code += 'WiFiClient client = server.available();\n';
    code += 'if (client && client.available()) {\n';
    code += '  String request_string = listenClient(client);\n';
    code += '  Request request;\n';
    code += '  if (parseRequestSafe(request_string, request)) {\n';
    code += onConnect;
    code += '  }\n';
    code += '  delay(1);\n';
    code += '  client.stop();\n';
    code += '  delay(1);\n';
    code += '}\n';
    return code;
};

Blockly.Arduino.sensebox_http_method = function (block) {
    var code = "request.method";
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};


Blockly.Arduino.sensebox_http_uri = function (block) {
    var code = "request.uri";
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.sensebox_http_protocol_version = function (block) {
    var code = "request.protocol_version";
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.sensebox_http_user_agent = function (block) {
    var code = "request.user_agent";
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.sensebox_generate_html_doc = function (block) {
    var header = Blockly.Arduino.valueToCode(block, 'HEADER', Blockly.Arduino.ORDER_NONE) || '""';
    var body = Blockly.Arduino.valueToCode(block, 'BODY', Blockly.Arduino.ORDER_NONE) || '""';
    var code = 'buildHTML(' + header + ', ' + body + ')';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.sensebox_generate_http_succesful_response = function (block) {
    var content = Blockly.Arduino.valueToCode(block, 'CONTENT', Blockly.Arduino.ORDER_NONE) || '""';
    var code = 'client.println(buildSuccessfulResponse(request, ' + content + '));\n';
    return code;
};

Blockly.Arduino.sensebox_generate_http_not_found_response = function (block) {
    var code = 'client.println(buildNotFoundResponse(request));\n';
    return code;
};


Blockly.Arduino.sensebox_ip_address = function (block) {
    var code = "b->getIpAddress()";
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.sensebox_general_html_tag = function (block) {
    var tag = this.getFieldValue('TAG');
    var code = 'buildTag("' + tag + '",';
    var n = 0;
    var branch = Blockly.Arduino.valueToCode(block, 'DO' + n, Blockly.Arduino.ORDER_NONE);
    if (branch.length > 0) {
        code += '\n ' + branch;
    } else {
        code += '""';
    }
    for (n = 1; n <= block.additionalChildCount_; n++) {
        branch = Blockly.Arduino.valueToCode(block, 'DO' + n, Blockly.Arduino.ORDER_NONE);
        code += ' +' + branch;
    }
    return [code + ')', Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.sensebox_web_readHTML = function (block) {
    var filename = this.getFieldValue('FILENAME');
    Blockly.Arduino.libraries_['library_spi'] = '#include <SPI.h>';
    Blockly.Arduino.libraries_['library_sd'] = '#include <SD.h>';
    Blockly.Arduino.codeFunctions_['define_sd' + filename] = 'File webFile;';
    Blockly.Arduino.setupCode_['sensebox_sd'] = 'SD.begin(28);';
    var func = [
        'String generateHTML(){',
        ' webFile = SD.open("' + filename + '", FILE_READ);',
        ' String finalString ="";',
        ' while (webFile.available())',
        '   {',
        '   finalString+=(char)webFile.read();',
        '   }',
        ' return finalString;',
        '}'];
    var functionName = Blockly.Arduino.addFunction(
        'generateHTML', func.join('\n'));
    var code = functionName + '()';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};