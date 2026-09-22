import * as Blockly from "blockly";
import {
  QWIIC_STATUS,
  QWIIC_VALUES,
  QWIIC_BUTTONS,
} from "../../helpers/qwiicButton.js";
const arduino = Blockly.Generator.Arduino;
arduino.addReservedWords(
  QWIIC_BUTTONS.map(([id]) => `qwiicButton_${id}`).join(","),
);

function ledCode(name, mode, config) {
  if (mode === "OFF") return `${name}.LEDoff();\n`;
  if (mode === "ON")
    return `${name}.LEDon(${config.getFieldValue("BRIGHTNESS")});\n`;
  if (mode === "BREATHE")
    return `${name}.LEDconfig(${["BRIGHTNESS", "CYCLE", "OFF", "GRANULARITY"].map((key) => config.getFieldValue(key)).join(", ")});\n`;
  throw new Error("Invalid Qwiic Button LED mode.");
}
function device(block) {
  const id = block.getFieldValue("BUTTON");
  const configs = block.workspace
    .getBlocksByType("sensebox_qwiic_button_init", false)
    .filter((b) => b.isEnabled());
  const matches = configs.filter((b) => b.getFieldValue("BUTTON") === id);
  const name = `qwiicButton_${id}`;
  // Fail compilation rather than silently using an unconfigured device.
  const error =
    matches.length !== 1
      ? Blockly.Msg.qwiic_init_required
      : configs.some(
            (b) =>
              b !== matches[0] &&
              b.getFieldValue("ADDRESS") ===
                matches[0].getFieldValue("ADDRESS"),
          )
        ? Blockly.Msg.qwiic_address_duplicate
        : null;
  block.setWarningText(error || null, "qwiic-config");
  if (error) {
    arduino.definitions_[`qwiic_error_${id}`] =
      `#error "Qwiic Button ${id}: ${error.replace(/["\n]/g, " ")}"`;
    return null;
  }
  const config = matches[0];
  arduino.libraries_.library_wire = "#include <Wire.h>";
  arduino.libraries_.library_qwiic_button =
    "#include <SparkFun_Qwiic_Button.h> // http://librarymanager/All#SparkFun_Qwiic_Button";
  arduino.preSetupCode_["Wire.begin"] = "Wire.begin();";
  arduino.variables_[name] = `QwiicButton ${name};`;
  const interrupts = config.getFieldValue("INTERRUPTS");
  arduino.setupCode_[name] =
    `${name}.begin(${config.getFieldValue("ADDRESS")}, Wire);
${name}.setDebounceTime(${config.getFieldValue("DEBOUNCE")});
${name}.${["PRESS", "BOTH"].includes(interrupts) ? "enable" : "disable"}PressedInterrupt();
${name}.${["CLICK", "BOTH"].includes(interrupts) ? "enable" : "disable"}ClickedInterrupt();
${name}.clearEventBits();
${ledCode(name, config.getFieldValue("LED_MODE"), config)}`;
  return { name, config };
}
arduino.forBlock.sensebox_qwiic_button_init = function (block) {
  device(block || this);
  return "";
};
for (const [suffix, methods] of [
  ["status", QWIIC_STATUS],
  ["value", QWIIC_VALUES],
]) {
  arduino.forBlock[`sensebox_qwiic_button_${suffix}`] = function (block) {
    block = block || this;
    const selected = device(block);
    if (!selected) return ["0", arduino.ORDER_ATOMIC];
    const method = block.getFieldValue("METHOD");
    if (!methods.includes(method))
      throw new Error("Unknown Qwiic Button operation.");
    return [`${selected.name}.${method}()`, arduino.ORDER_UNARY_POSTFIX];
  };
}
arduino.forBlock.sensebox_qwiic_button_led = function (block) {
  block = block || this;
  const selected = device(block);
  return selected
    ? ledCode(selected.name, block.getFieldValue("MODE"), selected.config)
    : "";
};
arduino.forBlock.sensebox_qwiic_button_action = function (block) {
  const selected = device(block || this);
  return selected ? `${selected.name}.clearEventBits();\n` : "";
};
