import * as Blockly from "blockly/core";

/**
 * Telegram Bot by re:edu
 */
Blockly.Generator.Arduino.forBlock["sensebox_telegram"] = function (
  block,
  generator,
) {
  let token = Block.getFieldValue("telegram_token");
  Blockly.Generator.Arduino.libraries_["library_telegram"] =
    `#include <UniversalTelegramBot.h>`;
  Blockly.Generator.Arduino.functionNames_["WiFiSSLClient"] =
    "WiFiSSLClient client;";
  Blockly.Generator.Arduino.functionNames_["telegram_objects"] =
    `#define BOTtoken "${token}"  // your Bot Token (Get from Botfather)
      
    UniversalTelegramBot bot(BOTtoken, client);`;

  let code = "";
  return code;
};

Blockly.Generator.Arduino.forBlock["sensebox_telegram_do"] = function (
  block,
  generator,
) {
  var messageProcessing = Blockly.Generator.Arduino.statementToCode(
    block,
    "telegram_do",
    Blockly.Generator.Arduino.ORDER_ATOMIC,
  );

  Blockly.Generator.Arduino.definitions_["telegram_variables"] =
    `int Bot_mtbs = 1000; //mean time between scan messages
  long Bot_lasttime;   //last time messages' scan has been done`;

  Blockly.Generator.Arduino.loopCodeOnce_["sensebox_telegram_loop"] =
    `if (millis() > Bot_lasttime + Bot_mtbs)  {
      int numNewMessages = bot.getUpdates(bot.last_message_received + 1);
      while(numNewMessages) {
        for(int i=0; i<numNewMessages; i++) {
          String chat_id = String(bot.messages[i].chat_id);
          String text = bot.messages[i].text;
  
          ${messageProcessing}
        }
        numNewMessages = bot.getUpdates(bot.last_message_received + 1);
      }
      Bot_lasttime = millis();
    }`;
  var code = "";
  return code;
};

Blockly.Generator.Arduino.forBlock["sensebox_telegram_do_on_message"] =
  function (block, generator) {
    var message = this.getFieldValue("telegram_message");
    var stuffToDo = Blockly.Generator.Arduino.statementToCode(
      block,
      "telegram_do_on_message",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
    );
    var code = `
        if (text == "${message}") {
          ${stuffToDo}
        }`;
    return code;
  };

Blockly.Generator.Arduino.forBlock["sensebox_telegram_send"] = function (
  block,
  generator,
) {
  var textToSend =
    Blockly.Generator.Arduino.valueToCode(
      this,
      "telegram_text_to_send",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
    ) || '"Keine Eingabe"';
  var code = `bot.sendMessage(chat_id, String(${textToSend}), "");\n`;
  return code;
};
