import * as Blockly from 'blockly/core';
import { Block } from 'blockly';


/**
 * Telegram Bot by re:edu
 */
Blockly.Arduino['sensebox_telegram'] = function (Block) {
  let token = Block.getFieldValue('telegram_token');
  Blockly['Arduino'].libraries_['library_senseBoxMCU'] = '#include "SenseBoxMCU.h"';
  Blockly['Arduino'].libraries_['library_telegram'] = `#include <UniversalTelegramBot.h>`
  Blockly['Arduino'].functionNames_['WiFiSSLClient'] = 'WiFiSSLClient client;';
  Blockly['Arduino'].functionNames_['telegram_objects'] = `#define BOTtoken "${token}"  // your Bot Token (Get from Botfather)
    
  UniversalTelegramBot bot(BOTtoken, client);`

  let code = 'testcode';
  return code;
};