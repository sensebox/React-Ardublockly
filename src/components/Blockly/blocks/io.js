/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Blocks for Arduino Digital and Analogue input and output
 *     functions. The Arduino function syntax can be found at
 *     http://arduino.cc/en/Reference/HomePage
 *
 * TODO: maybe change this to a "PIN" BlocklyType
 */
import Blockly from 'blockly/core';
import { selectedBoard } from '../helpers/board'
import * as Types from '../helpers/types'


Blockly.Blocks['io_digitalwrite'] = {
    /**
     * Block for creating a 'set pin' to a state.
     * @this Blockly.Block
     */
    init: function () {
        this.setHelpUrl('http://arduino.cc/en/Reference/DigitalWrite');
        this.setColour(250);
        this.appendValueInput('STATE')
            .appendField(Blockly.Msg.ARD_DIGITALWRITE)
            .appendField(new Blockly.FieldDropdown(
                selectedBoard().digitalPins), 'PIN')
            .appendField(Blockly.Msg.ARD_WRITE_TO)
            .setCheck(Types.BOOLEAN.checkList);
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip(Blockly.Msg.ARD_DIGITALWRITE_TIP);
    },
    /**
     * Updates the content of the the pin related fields.
     * @this Blockly.Block
     */
    updateFields: function () {
        Blockly.Arduino.Boards.refreshBlockFieldDropdown(
            this, 'PIN', 'digitalPins');
    }
};

Blockly.Blocks['io_digitalread'] = {
    /**
     * Block for creating a 'read pin'.
     * @this Blockly.Block
     */
    init: function () {
        this.setHelpUrl('http://arduino.cc/en/Reference/DigitalRead');
        this.setColour(250);
        this.appendDummyInput()
            .appendField(Blockly.Msg.ARD_DIGITALREAD)
            .appendField(new Blockly.FieldDropdown(
                selectedBoard().digitalPins), 'PIN');
        this.setOutput(true, 'boolean');
        this.setTooltip(Blockly.Msg.ARD_DIGITALREAD_TIP);
    },
    /** @return {!string} The type of return value for the block, an integer. */
    getBlockType: function () {
        return Types.BOOLEAN;
    },
    /**
     * Updates the content of the the pin related fields.
     * @this Blockly.Block
     */
    updateFields: function () {
        Blockly.Arduino.Boards.refreshBlockFieldDropdown(
            this, 'PIN', 'digitalPins');
    }
};

Blockly.Blocks['io_builtin_led'] = {
    /**
     * Block for setting built-in LED to a state.
     * @this Blockly.Block
     */
    init: function () {
        this.setHelpUrl('http://arduino.cc/en/Reference/DigitalWrite');
        this.setColour(250);
        this.appendValueInput('STATE')
            .appendField(Blockly.Msg.ARD_BUILTIN_LED)
            .appendField(new Blockly.FieldDropdown(
                selectedBoard().builtinLed), 'BUILT_IN_LED')
            .appendField(Blockly.Msg.ARD_WRITE_TO)
            .setCheck(Types.BOOLEAN.compatibleTypes);
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip(Blockly.Msg.ARD_BUILTIN_LED_TIP);
    },
    /**
     * Updates the content of the the pin related fields.
     * @this Blockly.Block
     */
    updateFields: function () {
        Blockly.Arduino.Boards.refreshBlockFieldDropdown(
            this, 'BUILT_IN_LED', 'builtinLed');
    },
    /** @return {!string} The type of input value for the block, an integer. */
    getBlockType: function () {
        return Types.BOOLEAN;
    },
};

Blockly.Blocks['io_analogwrite'] = {
    /**
     * Block for creating a 'set pin' to an analogue value.
     * @this Blockly.Block
     */
    init: function () {
        this.setHelpUrl('http://arduino.cc/en/Reference/AnalogWrite');
        this.setColour(250);
        this.appendValueInput('NUM')
            .appendField(Blockly.Msg.ARD_ANALOGWRITE)
            .appendField(new Blockly.FieldDropdown(
                selectedBoard().pwmPins), 'PIN')
            .appendField(Blockly.Msg.ARD_WRITE_TO)
            .setCheck(Types.NUMBER.compatibleTypes);
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip(Blockly.Msg.ARD_ANALOGWRITE_TIP);
    },
    /**
     * Updates the content of the the pin related fields.
     * @this Blockly.Block
     */
    updateFields: function () {
        Blockly.Arduino.Boards.refreshBlockFieldDropdown(this, 'PIN', 'pwmPins');
    },
    /** @return {!string} The type of input value for the block, an integer. */
    getBlockType: function () {
        return Types.NUMBER;
    },
};

Blockly.Blocks['io_analogread'] = {
    /**
     * Block for reading an analogue input.
     * @this Blockly.Block
     */
    init: function () {
        this.setHelpUrl('http://arduino.cc/en/Reference/AnalogRead');
        this.setColour(250);
        this.appendDummyInput()
            .appendField(Blockly.Msg.ARD_ANALOGREAD)
            .appendField(new Blockly.FieldDropdown(
                selectedBoard().analogPins), 'PIN');
        this.setOutput(true, Types.NUMBER.typeId);
        this.setTooltip(Blockly.Msg.ARD_ANALOGREAD_TIP);
    },
    /** @return {!string} The type of return value for the block, an integer. */
    getBlockType: function () {
        return Types.NUMBER.typeId;
    },
    /**
     * Updates the content of the the pin related fields.
     * @this Blockly.Block
     */
    updateFields: function () {
        Blockly.Arduino.Boards.refreshBlockFieldDropdown(this, 'PIN', 'analogPins');
    }
};

Blockly.Blocks['io_highlow'] = {
    /**
     * Block for creating a pin state.
     * @this Blockly.Block
     */
    init: function () {
        this.setHelpUrl('http://arduino.cc/en/Reference/Constants');
        this.setColour(250);
        this.appendDummyInput()
            .appendField(
                new Blockly.FieldDropdown([[Blockly.Msg.ARD_HIGH, 'HIGH'], [Blockly.Msg.ARD_LOW, 'LOW']]),
                'STATE');
        this.setOutput(true, Types.BOOLEAN.typeId);
        this.setTooltip(Blockly.Msg.ARD_HIGHLOW_TIP);
    },
    /** @return {!string} The type of return value for the block, an integer. */
    getBlockType: function () {
        return Types.BOOLEAN;
    }
};

Blockly.Blocks['io_pulsein'] = {
    /**
     * Block for measuring the duration of a pulse in an input pin.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "type": "math_foo",
            "message0": Blockly.Msg.ARD_PULSE_READ,
            "args0": [{
                "type": "input_value",
                "name": "PULSETYPE",
                "check": Types.BOOLEAN.compatibleTypes
            }, {
                "type": "field_dropdown",
                "name": "PULSEPIN",
                "options": selectedBoard().digitalPins,
            }
            ],
            "output": Types.NUMBER.typeId,
            "inputsInline": true,
            "colour": 250,
            "tooltip": Blockly.Msg.ARD_PULSE_TIP,
            "helpUrl": 'https://www.arduino.cc/en/Reference/PulseIn'
        });
    },
    /** @return {!string} The type of input value for the block, an integer. */
    getBlockType: function () {
        return Types.NUMBER.typeId;
    }
};

Blockly.Blocks['io_pulsetimeout'] = {
    /**
     * Block for measuring (with a time-out) the duration of a pulse in an input
     * pin.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "type": "math_foo",
            "message0": Blockly.Msg.ARD_PULSE_READ_TIMEOUT,
            "args0": [{
                "type": "input_value",
                "name": "PULSETYPE",
                "check": Types.BOOLEAN.compatibleTypes
            }, {
                "type": "field_dropdown",
                "name": "PULSEPIN",
                "options": selectedBoard().digitalPins,
            }, {
                "type": "input_value",
                "name": "TIMEOUT",
                "check": Types.NUMBER.compatibleTypes
            }
            ],
            "output": Types.NUMBER.typeId,
            "inputsInline": true,
            "colour": 250,
            "tooltip": Blockly.Msg.ARD_PULSETIMEOUT_TIP,
            "helpUrl": 'https://www.arduino.cc/en/Reference/PulseIn'
        });
    },
    /** @return {!string} The type of input value for the block, an integer. */
    getBlockType: function () {
        return Types.NUMBER.typeId;
    }
};
