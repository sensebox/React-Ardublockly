import * as Blockly from "blockly/core";
import { initialXml } from "../initialXml";

/**
 * Ensures the arduino_functions start block exists in the workspace.
 * This block is required for Arduino code generation and should never be missing.
 *
 * @param {Blockly.WorkspaceSvg} workspace - The Blockly workspace to check
 * @returns {boolean} - True if the block was added, false if it already existed
 */
export function ensureStartBlock(workspace) {
  if (!workspace) return false;

  const existingBlocks = workspace.getBlocksByType("arduino_functions", false);

  if (existingBlocks.length === 0) {
    try {
      const xmlDom = Blockly.utils.xml.textToDom(initialXml);
      Blockly.Xml.domToWorkspace(xmlDom, workspace);
      console.info("Start block (arduino_functions) was missing and has been restored.");
      return true;
    } catch (e) {
      console.error("Failed to restore start block:", e);
      return false;
    }
  }

  return false;
}
