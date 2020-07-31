import * as Blockly from 'blockly/core';


/**
 * Code generator to add code into the setup() and loop() functions.
 * Its use is not mandatory, but necessary to add manual code to setup().
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.Arduino['arduino_functions'] = function (block) {
    // Edited version of Blockly.Generator.prototype.statementToCode
    function statementToCodeNoTab(block, name) {
        var targetBlock = block.getInputTargetBlock(name);
        var code = Blockly.Arduino.blockToCode(targetBlock);
        if (typeof code != 'string') {
            throw new Error('Expecting code from statement block "' + targetBlock.type + '".');
        }
        return code;
    }

    var setupBranch = Blockly.Arduino.statementToCode(block, 'SETUP_FUNC');
    //var setupCode = Blockly.Arduino.scrub_(block, setupBranch); No comment block
    if (setupBranch) {
        Blockly.Arduino.setupCode_('userSetupCode', setupBranch, true);
    }

    var loopBranch = statementToCodeNoTab(block, 'LOOP_FUNC');
    //var loopcode = Blockly.Arduino.scrub_(block, loopBranch); No comment block
    return loopBranch;
};
