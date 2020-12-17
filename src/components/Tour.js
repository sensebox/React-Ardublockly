import * as Blockly from 'blockly/core';

export const home = () => {
    return [
        {
            selector: ".wrapper",
            content: `${Blockly.Msg.hometour_wrapper}`,
        },
        {
            selector: ".blocklyWindow",
            content: `${Blockly.Msg.hometour_blocklyWindow}`,
        },
        {
            selector: ".blocklyToolboxDiv",
            content: `${Blockly.Msg.hometour_blocklyToolboxDiv}`,
        },
        {
            selector: '.workspaceFunc',
            content: `${Blockly.Msg.hometour_workspaceFunc}`,
        },
        {
            selector: ".compileBlocks",
            content: `${Blockly.Msg.hometour_compileBlocks}`,
        },
        {
            selector: ".shareBlocks",
            content: `${Blockly.Msg.hometour_shareBlocks}`,
        },
        {
            selector: ".showCode",
            content: `${Blockly.Msg.hometour_showCode}`,
        },
        {
            selector: ".MenuButton",
            content: `${Blockly.Msg.hometour_menuButton}`,
        }
    ];
};

export const assessment = () => {
    return [
        // to be continued...

        {
            selector: '.assessmentDiv',
            content: `${Blockly.Msg.assessmenttour_assessmentDiv}`
        },
        {
            selector: '.injectionDiv',
            content: `${Blockly.Msg.assessmenttour_injectionDiv}`
        },
        {
            selector: '.solutionCheck',
            content: `${Blockly.Msg.assessmenttour_solutionCheck}`
        }
    ];
};
