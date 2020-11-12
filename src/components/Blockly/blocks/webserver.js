import Blockly from 'blockly/core';
import { getColour } from '../helpers/colour';
import { getCompatibleTypes } from '../helpers/types'
import * as Types from '../helpers/types';

/** 
 * Webserver Blocks By Lucas Steinmann
 *  */

Blockly.Blocks['sensebox_initialize_http_server'] = {
    init: function () {
        this.setTooltip(Blockly.Msg.senseBox_init_http_server_tip);
        this.setHelpUrl('https://sensebox.de/books');
        this.setColour(getColour().webserver);
        this.appendDummyInput()
            .appendField(Blockly.Msg.senseBox_init_http_server);
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_LEFT)
            .appendField("Port")
            .appendField(new Blockly.FieldNumber(80), "Port");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    },
    onchange: function (e) {
        // Is the block nested in a loop?
        var block = this;
        do {
            if (this.LOOP_TYPES.indexOf(block.type) !== -1) {
                break;
            }
            block = block.getSurroundParent();
        } while (block);
    },
    LOOP_TYPES: ['arduino_functions'],
};


Blockly.Blocks['sensebox_http_on_client_connect'] = {
    init: function () {
        this.setTooltip(Blockly.Msg.senseBox_http_on_client_connect_tip);
        this.setColour(getColour().webserver);
        this.appendDummyInput().appendField(Blockly.Msg.senseBox_http_on_client_connect);
        this.appendStatementInput('ON_CONNECT');
        this.setHelpUrl('https://sensebox.de/books');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    }
};


Blockly.Blocks['sensebox_http_method'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(Blockly.Msg.senseBox_http_method)
        this.setOutput(true, Types.TEXT.typeName);
        this.setColour(getColour().webserver);
        this.setTooltip(Blockly.Msg.senseBox_http_method_tip);
        this.setHelpUrl('https://sensebox.de/books');
    },
    getBlockType: function () {
        return Blockly.Types.TEXT;
    },
};


Blockly.Blocks['sensebox_http_uri'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(Blockly.Msg.senseBox_http_uri)
        this.setOutput(true, Types.TEXT.typeName);
        this.setColour(getColour().webserver);
        this.setTooltip(Blockly.Msg.senseBox_http_uri_tip);
        this.setHelpUrl('https://sensebox.de/books');
    }
};


Blockly.Blocks['sensebox_http_protocol_version'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(Blockly.Msg.senseBox_http_protocol_version)
        this.setOutput(true, Types.TEXT.typeName);
        this.setColour(getColour().webserver);
        this.setTooltip(Blockly.Msg.senseBox_http_protocol_version_tip);
        this.setHelpUrl('https://sensebox.de/books');
    }
};

Blockly.Blocks['sensebox_ip_address'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(Blockly.Msg.senseBox_ip_address);
        this.setTooltip(Blockly.Msg.senseBox_ip_address_tip);
        this.setHelpUrl('');
        this.setOutput(true, Types.TEXT.typeName);
        this.setColour(getColour().webserver);
    }
};

Blockly.Blocks['sensebox_http_user_agent'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(Blockly.Msg.senseBox_http_user_agent)
        this.setOutput(true, Types.TEXT.typeName);
        this.setColour(getColour().webserver);
        this.setTooltip(Blockly.Msg.senseBox_http_user_agent_tip);
        this.setHelpUrl('https://sensebox.de/books');
    }
};

Blockly.Blocks['sensebox_generate_html_doc'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(Blockly.Msg.senseBox_html_document);
        this.appendValueInput('HEADER')
            .setAlign(Blockly.ALIGN_LEFT)
            .setCheck(getCompatibleTypes('String'))
            .appendField(Blockly.Msg.senseBox_html_header);
        this.appendValueInput('BODY')
            .setAlign(Blockly.ALIGN_LEFT)
            .setCheck(getCompatibleTypes('String'))
            .appendField(Blockly.Msg.senseBox_html_body);
        this.setInputsInline(false);
        this.setOutput(true, Types.TEXT.typeName);
        this.setColour(getColour().webserver);
        this.setTooltip(Blockly.Msg.senseBox_html_document_tip);
        this.setHelpUrl('https://sensebox.de/books');
    },
};

Blockly.Blocks['sensebox_generate_http_succesful_response'] = {
    init: function () {
        this.setColour(getColour().webserver);
        this.appendDummyInput()
            .appendField(Blockly.Msg.senseBox_http_success);
        this.appendDummyInput()
            .appendField(Blockly.Msg.senseBox_http_success_l2);
        this.appendValueInput('CONTENT')
            .appendField(Blockly.Msg.senseBox_http_success_buildhtml)
            .setCheck(getCompatibleTypes('String'));
        this.setTooltip(Blockly.Msg.senseBox_http_success_tip);
        this.setInputsInline(false);
        this.setHelpUrl('https://sensebox.de/books');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    }
};

Blockly.Blocks['sensebox_generate_http_not_found_response'] = {
    init: function () {
        this.setTooltip(Blockly.Msg.senseBox);
        this.setColour(getColour().webserver);
        this.appendDummyInput().appendField(Blockly.Msg.senseBox_http_not_found);
        this.setTooltip(Blockly.Msg.senseBox_http_not_found_tip);
        this.setHelpUrl('https://sensebox.de/books');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    }
};


Blockly.Blocks['sensebox_general_html_tag'] = {
    init: function () {
        this.setTooltip(Blockly.Msg.senseBox_html_general_tag_tip);
        this.setColour(getColour().webserver);
        this.appendDummyInput()
            .appendField("<")
            .appendField(new Blockly.FieldTextInput("Tag"), "TAG")
            .appendField(">");
        this.appendValueInput('DO0')
            .setCheck(getCompatibleTypes('String'));
        this.setInputsInline(false);
        this.setOutput(true, Types.TEXT.typeName);
        this.setHelpUrl('https://sensebox.de/books');
        this.setPreviousStatement(false);
        this.setNextStatement(false);
        this.setMutator(new Blockly.Mutator(['additional_child']));
        this.additionalChildCount_ = 0;
    },
    /**
     * Create XML to represent the number of else-if and else inputs.
     * @return {Element} XML storage element.
     * @this Blockly.Block
     */
    mutationToDom: function () {
        if (!this.additionalChildCount_) {
            return null;
        }
        var container = document.createElement('mutation');
        if (this.additionalChildCount_) {
            container.setAttribute('add_child', this.additionalChildCount_);
        }
        return container;
    },
    /**
     * Parse XML to restore the else-if and else inputs.
     * @param {!Element} xmlElement XML storage element.
     * @this Blockly.Block
     */
    domToMutation: function (xmlElement) {
        this.additionalChildCount_ = parseInt(xmlElement.getAttribute('add_child'), 10) || 0;
        this.updateShape_();
    },
    /**
     * Populate the mutator's dialog with this block's components.
     * @param {!Blockly.Workspace} workspace Mutator's workspace.
     * @return {!Blockly.Block} Root block in mutator.
     * @this Blockly.Block
     */
    decompose: function (workspace) {
        var containerBlock = workspace.newBlock('first_child');
        containerBlock.initSvg();
        var connection = containerBlock.nextConnection;
        for (var i = 1; i <= this.additionalChildCount_; i++) {
            var elseifBlock = workspace.newBlock('additional_child');
            elseifBlock.initSvg();
            connection.connect(elseifBlock.previousConnection);
            connection = elseifBlock.nextConnection;
        }
        return containerBlock;
    },
    /**
     * Reconfigure this block based on the mutator dialog's components.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    compose: function (containerBlock) {
        var clauseBlock = containerBlock.nextConnection.targetBlock();
        // Count number of inputs.
        this.additionalChildCount_ = 0;
        var statementConnections = [null];
        while (clauseBlock) {
            switch (clauseBlock.type) {
                case 'additional_child':
                    this.additionalChildCount_++;
                    statementConnections.push(clauseBlock.statementConnection_);
                    break;
                default:
                    throw new Error("Unknown block type.");
            }
            clauseBlock = clauseBlock.nextConnection &&
                clauseBlock.nextConnection.targetBlock();
        }
        this.updateShape_();
        // Reconnect any child blocks.
        for (var i = 1; i <= this.additionalChildCount_; i++) {
            Blockly.Mutator.reconnect(statementConnections[i], this, 'DO' + i);
        }
    },
    /**
     * Store pointers to any connected child blocks.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    saveConnections: function (containerBlock) {
        var clauseBlock = containerBlock.nextConnection.targetBlock();
        var i = 1;
        while (clauseBlock) {
            switch (clauseBlock.type) {
                case 'additional_child':
                    var inputDo = this.getInput('DO' + i);
                    clauseBlock.statementConnection_ =
                        inputDo && inputDo.connection.targetConnection;
                    i++;
                    break;
                default:
                    throw new Error('Unknown block type.');
            }
            clauseBlock = clauseBlock.nextConnection &&
                clauseBlock.nextConnection.targetBlock();
        }
    },
    /**
     * Modify this block to have the correct number of inputs.
     * @private
     * @this Blockly.Block
     */
    updateShape_: function () {
        // Delete everything.
        var i = 1;
        while (this.getInput('DO' + i)) {
            this.removeInput('DO' + i);
            i++;
        }
        // Rebuild block.
        for (i = 1; i <= this.additionalChildCount_; i++) {
            this.appendValueInput('DO' + i, Blockly.Arduino.ORDER_NONE);
        }
    }
};

Blockly.Blocks['first_child'] = {
    init: function () {
        this.setColour(getColour().webserver);
        this.appendDummyInput()
            .appendField("<Tag>");
        this.setNextStatement(true);
        this.setInputsInline(true);
        this.setTooltip(Blockly.Msg.senseBox_tag_first_mutator_tip);
        this.contextMenu = false;
    }
};


Blockly.Blocks['additional_child'] = {
    init: function () {
        this.setColour(getColour().webserver);
        this.appendDummyInput()
            .appendField("<Tag>");
        this.setPreviousStatement(true);
        this.setInputsInline(true);
        this.setNextStatement(true);
        this.setTooltip(Blockly.Msg.senseBox_tag_optional_mutator_tip);
        this.contextMenu = false;
    }
};

// Additional Webserver Blocks

Blockly.Blocks['sensebox_web_readHTML'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(Blockly.Msg.senseBox_sd_web_readHTML)
            .setAlign(Blockly.ALIGN_LEFT);
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_LEFT)
            .appendField(Blockly.Msg.sensebox_web_readHTML_filename)
            .appendField(new Blockly.FieldTextInput("index.txt"), "FILENAME");
        this.setOutput(true, Types.TEXT.typeName);
        this.setColour(getColour().webserver);
        this.setTooltip(Blockly.Msg.senseBox_output_safetosd_tip);
        this.setHelpUrl('https://sensebox.de/books');
    }
};