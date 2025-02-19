import * as Blockly from "blockly/core";
import "./generator"; // This must come first
import "./procedures";
import "./sensebox-sensors";
import "./time";
import "./sensebox-display";
import "./sensebox-led";

// Initialize simulator on workspace creation
export function initSimulator(workspace) {
  if (!Blockly.Generator.Simulator) {
    console.warn("Creating new Simulator generator");
    Blockly.Generator.Simulator = new Blockly.Generator("Simulator");
  }

  try {
    Blockly.Generator.Simulator.init(workspace);
  } catch (err) {
    console.warn("Error initializing simulator:", err);
  }
}
