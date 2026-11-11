// generator.js must be loaded first: the other files register their block
// generators on Blockly.Generator.Simulator.
import { simulatorGenerator } from "./generator";
import "./procedures";
import "./time";
import "./sensebox-display";
import "./sensebox-sensors";
import "./sensebox-led";
import "./fluoroASM";

export { simulatorGenerator };
