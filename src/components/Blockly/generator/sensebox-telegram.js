import * as Blockly from 'blockly/core';


/**
 * Telegram Bot by re:edu
 */
Blockly.Arduino.sensebox_telegram = function (Block) {
  let token = Block.getFieldValue('telegram_token');
  Blockly['Arduino'].libraries_['library_senseBoxMCU'] = '#include "SenseBoxMCU.h"';
  Blockly['Arduino'].libraries_['library_telegram'] = `#include <UniversalTelegramBot.h>`
  Blockly['Arduino'].functionNames_['WiFiSSLClient'] = 'WiFiSSLClient client;';
  Blockly['Arduino'].functionNames_['telegram_objects'] = `#define BOTtoken "${token}"  // your Bot Token (Get from Botfather)
      
    UniversalTelegramBot bot(BOTtoken, client);`

  let code = '';
  return code;
};

Blockly.Arduino.sensebox_telegram_do = function (block) {
  var messageProcessing = Blockly.Arduino.statementToCode(block, 'telegram_do', Blockly.Arduino.ORDER_ATOMIC);

  Blockly.Arduino.definitions_['telegram_variables'] = `int Bot_mtbs = 1000; //mean time between scan messages
  long Bot_lasttime;   //last time messages' scan has been done`

  Blockly.Arduino.loopCodeOnce_['sensebox_telegram_loop'] = `if (millis() > Bot_lasttime + Bot_mtbs)  {
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
  var code = '';
  return code;
};

Blockly.Arduino.sensebox_telegram_do_on_message = function (block) {
  var message = this.getFieldValue('telegram_message');
  var stuffToDo = Blockly.Arduino.statementToCode(block, 'telegram_do_on_message', Blockly.Arduino.ORDER_ATOMIC);
  var code = `
        if (text == "${message}") {
          ${stuffToDo}
        }`;
  return code;
};

Blockly.Arduino.sensebox_telegram_send = function (block) {
  var textToSend = Blockly.Arduino.valueToCode(this, 'telegram_text_to_send', Blockly.Arduino.ORDER_ATOMIC) || '"Keine Eingabe"';
  var code = `bot.sendMessage(chat_id, String(${textToSend}), "");\n`;
  return code;
};
