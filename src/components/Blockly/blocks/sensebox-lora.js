import * as Blockly from 'blockly/core';
import { getColour } from '../helpers/colour';


/*
----------------------------------LoRa--------------------------------------------------
*/

Blockly.Blocks['sensebox_lora_initialize_otaa'] = {
    init: function () {
        this.setTooltip(Blockly.Msg.senseBox_LoRa_init_otaa_tooltip);
        this.setHelpUrl(Blockly.Msg.senseBox_LoRa_init_helpurl);
        this.setColour(getColour().sensebox);
        this.appendDummyInput()
            .appendField("Initialize LoRa (OTAA)");
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_LEFT)
            .appendField(Blockly.Msg.senseBox_LoRa_device_id)
            .appendField(new Blockly.FieldTextInput("DEVICE ID"), "DEVICEID");
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_LEFT)
            .appendField(Blockly.Msg.senseBox_LoRa_app_id)
            .appendField(new Blockly.FieldTextInput("APP ID"), "APPID");
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_LEFT)
            .appendField(Blockly.Msg.senseBox_LoRa_app_key)
            .appendField(new Blockly.FieldTextInput("APP KEY"), "APPKEY");
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_LEFT)
            .appendField(Blockly.Msg.senseBox_LoRa_interval)
            .appendField(new Blockly.FieldTextInput("5"), "INTERVAL");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    },
};

Blockly.Blocks['sensebox_lora_initialize_abp'] = {
    init: function () {
        this.setTooltip(Blockly.Msg.senseBox_LoRa_init_abp_tooltip);
        this.setHelpUrl(Blockly.Msg.senseBox_LoRa_init_helpurl);
        this.setColour(getColour().sensebox);
        this.appendDummyInput()
            .appendField("Initialize LoRa (ABP)");
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_LEFT)
            .appendField(Blockly.Msg.senseBox_LoRa_nwskey_id)
            .appendField(new Blockly.FieldTextInput("NWSKEY"), "NWSKEY");
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_LEFT)
            .appendField(Blockly.Msg.senseBox_LoRa_appskey_id)
            .appendField(new Blockly.FieldTextInput("APPSKEY"), "APPSKEY");
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_LEFT)
            .appendField(Blockly.Msg.senseBox_LoRa_devaddr_id)
            .appendField(new Blockly.FieldTextInput("DEVADDR"), "DEVADDR");
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_LEFT)
            .appendField(Blockly.Msg.senseBox_LoRa_interval)
            .appendField(new Blockly.FieldTextInput("5"), "INTERVAL");
        // this.appendStatementInput('DO')
        //     .appendField(Blockly.Msg.senseBox_measurements)
        //     .setCheck(null);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    },
};

Blockly.Blocks['sensebox_lora_message_send'] = {
    init: function () {
        this.setTooltip(Blockly.Msg.senseBox_LoRa_message_tooltip);
        this.setHelpUrl('');
        this.setColour(getColour().sensebox);
        this.appendStatementInput('DO')
            .appendField(Blockly.Msg.senseBox_LoRa_send_message)
            .setCheck(null);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    }
};

Blockly.Blocks['sensebox_send_lora_sensor_value'] = {
    init: function () {
        this.setTooltip(Blockly.Msg.senseBox_LoRa_sensor_tip);
        this.setHelpUrl('');
        this.setColour(getColour().sensebox);
        this.appendValueInput('Value')
            .appendField(Blockly.Msg.senseBox_measurement)
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_LEFT)
            .appendField("Bytes")
            .appendField(new Blockly.FieldTextInput("2"), "MESSAGE_BYTES");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    },
    /**
     * Called whenever anything on the workspace changes.
     * Add warning if block is not nested inside a the correct loop.
     * @param {!Blockly.Events.Abstract} e Change event.
     * @this Blockly.Block
     */
    onchange: function (e) {
        var legal = false;
        // Is the block nested in a loop?
        var block = this;
        do {
            if (this.LOOP_TYPES.indexOf(block.type) !== -1) {
                legal = true;
                break;
            }
            block = block.getSurroundParent();
        } while (block);
        if (legal) {
            this.setWarningText(null);
        } else {
            this.setWarningText(Blockly.Msg.CONTROLS_FLOW_STATEMENTS_WARNING);
        }
    },
    LOOP_TYPES: ['sensebox_lora_message_send'],
};

Blockly.Blocks['sensebox_lora_ttn_mapper'] = {
    init: function (block) {
        this.setColour(getColour().sensebox);
        this.appendDummyInput()
            .appendField("TTN Mapper");
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("Fix Type Limit")
            .appendField(new Blockly.FieldDropdown([["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"]].reverse()), "dropdown");
        // reverse() because i want 3 be be at first and i'm to lazy to write the array again
        this.appendValueInput('Latitude')
            .appendField(Blockly.Msg.senseBox_gps_lat)
            .setCheck(null);
        this.appendValueInput('Longitude')
            .appendField(Blockly.Msg.senseBox_gps_lng)
            .setCheck(null);
        this.appendValueInput('Altitude')
            .appendField(Blockly.Msg.senseBox_gps_alt)
            .setCheck(null);
        this.appendValueInput('pDOP')
            .appendField('pDOP')
            .setCheck(null);
        this.appendValueInput('Fix Type')
            .appendField('Fix Type')
            .setCheck(null);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip(Blockly.Msg.senseBox_display_printDisplay_tip);

    }
};

Blockly.Blocks['sensebox_lora_cayenne_send'] = {
    init: function () {
        this.setTooltip(Blockly.Msg.senseBox_LoRa_cayenne_tip);
        this.setHelpUrl('');
        this.setColour(getColour().sensebox);
        this.appendStatementInput('DO')
            .appendField(Blockly.Msg.senseBox_LoRa_send_cayenne)
            .setCheck(null);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    }
};
Blockly.Blocks['sensebox_lora_cayenne_temperature'] = {
    init: function () {
        this.setTooltip(Blockly.Msg.senseBox_LoRa_cayenne_temperature_tip);
        this.setHelpUrl('');
        this.setColour(getColour().sensebox);
        this.appendValueInput('Value')
            .appendField(Blockly.Msg.senseBox_LoRa_cayenne_temperature)
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_LEFT)
            .appendField(Blockly.Msg.senseBox_LoRa_cayenne_channel)
            .appendField(new Blockly.FieldTextInput("1"), "CHANNEL");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    },
    LOOP_TYPES: ['sensebox_lora_cayenne_send'],
};
Blockly.Blocks['sensebox_lora_cayenne_humidity'] = {
    init: function () {
        this.setTooltip(Blockly.Msg.senseBox_LoRa_cayenne_humidity_tip);
        this.setHelpUrl('');
        this.setColour(getColour().sensebox);
        this.appendValueInput('Value')
            .appendField(Blockly.Msg.senseBox_LoRa_cayenne_humidity)
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_LEFT)
            .appendField(Blockly.Msg.senseBox_LoRa_cayenne_channel)
            .appendField(new Blockly.FieldTextInput("1"), "CHANNEL");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    },
    LOOP_TYPES: ['sensebox_lora_cayenne_send'],
};
Blockly.Blocks['sensebox_lora_cayenne_pressure'] = {
    init: function () {
        this.setTooltip(Blockly.Msg.senseBox_LoRa_cayenne_pressure_tip);
        this.setHelpUrl('');
        this.setColour(getColour().sensebox);
        this.appendValueInput('Value')
            .appendField(Blockly.Msg.senseBox_LoRa_cayenne_pressure)
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_LEFT)
            .appendField(Blockly.Msg.senseBox_LoRa_cayenne_channel)
            .appendField(new Blockly.FieldTextInput("1"), "CHANNEL");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    },
    LOOP_TYPES: ['sensebox_lora_cayenne_send'],
};
Blockly.Blocks['sensebox_lora_cayenne_luminosity'] = {
    init: function () {
        this.setTooltip(Blockly.Msg.senseBox_LoRa_cayenne_luminosity_tip);
        this.setHelpUrl('');
        this.setColour(getColour().sensebox);
        this.appendValueInput('Value')
            .appendField(Blockly.Msg.senseBox_LoRa_cayenne_luminosity)
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_LEFT)
            .appendField(Blockly.Msg.senseBox_LoRa_cayenne_channel)
            .appendField(new Blockly.FieldTextInput("1"), "CHANNEL");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    },
    LOOP_TYPES: ['sensebox_lora_cayenne_send'],
};
Blockly.Blocks['sensebox_lora_cayenne_sensor'] = {
    init: function () {
        this.setTooltip(Blockly.Msg.senseBox_LoRa_cayenne_analog_tip);
        this.setHelpUrl('');
        this.setColour(getColour().sensebox);
        this.appendValueInput('Value')
            .appendField(Blockly.Msg.senseBox_LoRa_cayenne_analog)
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_LEFT)
            .appendField(Blockly.Msg.senseBox_LoRa_cayenne_channel)
            .appendField(new Blockly.FieldTextInput("1"), "CHANNEL");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    },
    LOOP_TYPES: ['sensebox_lora_cayenne_send'],
};
Blockly.Blocks['sensebox_lora_cayenne_accelerometer'] = {
    init: function () {
        this.setTooltip(Blockly.Msg.senseBox_LoRa_cayenne_gyros_tip);
        this.setHelpUrl('');
        this.setColour(getColour().sensebox);
        this.appendValueInput('X')
            .appendField(Blockly.Msg.senseBox_LoRa_cayenne_x)
        this.appendValueInput('Y')
            .appendField(Blockly.Msg.senseBox_LoRa_cayenne_y)
        this.appendValueInput('Z')
            .appendField(Blockly.Msg.senseBox_LoRa_cayenne_z)
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_LEFT)
            .appendField(Blockly.Msg.senseBox_LoRa_cayenne_channel)
            .appendField(new Blockly.FieldTextInput("1"), "CHANNEL");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    },
    LOOP_TYPES: ['sensebox_lora_cayenne_send'],
};
Blockly.Blocks['sensebox_lora_cayenne_gps'] = {
    init: function () {
        this.setTooltip(Blockly.Msg.senseBox_LoRa_cayenne_gps_tip);
        this.setHelpUrl('');
        this.setColour(getColour().sensebox);
        this.appendValueInput('LAT')
            .appendField(Blockly.Msg.senseBox_LoRa_cayenne_lat)
        this.appendValueInput('LNG')
            .appendField(Blockly.Msg.senseBox_LoRa_cayenne_lng)
        this.appendValueInput('ALT')
            .appendField(Blockly.Msg.senseBox_LoRa_cayenne_alt)
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_LEFT)
            .appendField(Blockly.Msg.senseBox_LoRa_cayenne_channel)
            .appendField(new Blockly.FieldTextInput("1"), "CHANNEL");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    },
    LOOP_TYPES: ['sensebox_lora_cayenne_send'],
};
