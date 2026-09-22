import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import * as Blockly from "blockly";
import "../blocks/sensebox-qwiic-button.js";
import { QWIIC_STATUS, QWIIC_VALUES } from "./qwiicButton.js";
import { QWIIC_BUTTON as en } from "../msg/en/sensebox-qwiic-button.js";
import { QWIIC_BUTTON as de } from "../msg/de/sensebox-qwiic-button.js";
const generator = (Blockly.Generator.Arduino = new Blockly.Generator(
  "Arduino",
));
generator.ORDER_NONE = 99;
generator.ORDER_ATOMIC = 0;
generator.ORDER_UNARY_POSTFIX = 1;
await import("../generator/arduino/sensebox-qwiic-button.js");
let workspace;
beforeEach(() => {
  Blockly.setLocale(en);
  workspace = new Blockly.Workspace();
  for (const key of [
    "libraries_",
    "definitions_",
    "preSetupCode_",
    "variables_",
    "setupCode_",
    "codeFunctions_",
  ])
    generator[key] = {};
  generator.isInitialized = true;
});
afterEach(() => workspace.dispose());
const generate = (block) => generator.forBlock[block.type](block, generator);
const init = (id = "1", address = 111) => {
  const block = workspace.newBlock("sensebox_qwiic_button_init");
  block.setFieldValue(id, "BUTTON");
  block.setFieldValue(address, "ADDRESS");
  return block;
};
test("initialization configures everything once even when loop blocks generate first", () => {
  const setup = init();
  setup.setFieldValue("BOTH", "INTERRUPTS");
  setup.setFieldValue("BREATHE", "LED_MODE");
  setup.setFieldValue(42, "BRIGHTNESS");
  setup.setFieldValue(1500, "CYCLE");
  const led = workspace.newBlock("sensebox_qwiic_button_led");
  led.setFieldValue("BREATHE", "MODE");
  assert.equal(generate(led), "qwiicButton_1.LEDconfig(42, 1500, 200, 1);\n");
  assert.equal(generate(setup), "");
  generate(led);
  assert.equal(Object.keys(generator.setupCode_).length, 1);
  assert.match(generator.setupCode_.qwiicButton_1, /begin\(111, Wire\)/);
  assert.match(generator.setupCode_.qwiicButton_1, /setDebounceTime\(20\)/);
  assert.match(generator.setupCode_.qwiicButton_1, /enablePressedInterrupt/);
  assert.match(generator.setupCode_.qwiicButton_1, /enableClickedInterrupt/);
  assert.match(
    generator.setupCode_.qwiicButton_1,
    /LEDconfig\(42, 1500, 200, 1\)/,
  );
});
test("loop blocks have no address or setup inputs and retain output types and translations", () => {
  init();
  for (const locale of [en, de]) {
    Blockly.setLocale(locale);
    for (const [suffix, methods, type] of [
      ["status", QWIIC_STATUS, "boolean"],
      ["value", QWIIC_VALUES, "long"],
    ]) {
      const block = workspace.newBlock(`sensebox_qwiic_button_${suffix}`);
      assert.equal(block.getField("ADDRESS"), null);
      assert.deepEqual(block.outputConnection.getCheck(), [type]);
      for (const method of methods) {
        block.setFieldValue(method, "METHOD");
        assert.equal(
          block.getField("METHOD").getText(),
          locale[`qwiic_${method}`],
        );
        assert.equal(generate(block)[0], `qwiicButton_1.${method}()`);
      }
    }
  }
});
test("multiple buttons keep independent settings through serialization", () => {
  init();
  const second = init("2", 112);
  second.setFieldValue(30, "BRIGHTNESS");
  const led = workspace.newBlock("sensebox_qwiic_button_led");
  led.setFieldValue("2", "BUTTON");
  led.setFieldValue("ON", "MODE");
  const saved = Blockly.serialization.workspaces.save(workspace);
  workspace.clear();
  Blockly.serialization.workspaces.load(saved, workspace);
  const restored = workspace.getBlocksByType("sensebox_qwiic_button_led")[0];
  assert.equal(generate(restored), "qwiicButton_2.LEDon(30);\n");
  assert.match(generator.setupCode_.qwiicButton_2, /begin\(112, Wire\)/);
});
test("missing, duplicate or disabled setup cannot silently generate an unconfigured device", () => {
  const led = workspace.newBlock("sensebox_qwiic_button_led");
  assert.equal(generate(led), "");
  assert.match(generator.definitions_.qwiic_error_1, /#error/);
  const first = init();
  init();
  generate(led);
  assert.match(generator.definitions_.qwiic_error_1, /exactly one/);
  first.setDisabledReason(true, "test");
  generate(led);
  assert.equal(Object.keys(generator.setupCode_).length, 1);
});
test("conflicting addresses are detected and setup numbers are bounded", () => {
  const first = init();
  init("2");
  generate(first);
  assert.match(generator.definitions_.qwiic_error_1, /different I2C address/);
  first.setFieldValue(300, "ADDRESS");
  assert.equal(first.getFieldValue("ADDRESS"), 119);
  first.setFieldValue(-5, "BRIGHTNESS");
  assert.equal(first.getFieldValue("BRIGHTNESS"), 0);
  first.setFieldValue(0, "GRANULARITY");
  assert.equal(first.getFieldValue("GRANULARITY"), 1);
});
test("category is under Advanced in every full toolbox", () => {
  for (const board of ["Esp", "Mcu", "Eye"]) {
    const source = readFileSync(
      new URL(`../toolbox/Toolbox${board}.jsx`, import.meta.url),
      "utf8",
    );
    assert.equal(source.split("<QwiicButtonCategory />").length, 2);
    assert.match(
      source,
      /<Category name=\{Blockly.Msg.toolbox_advanced\}[^>]*>\s*<QwiicButtonCategory \/>/,
    );
  }
});
test("all loop features produce a sketch with configuration only in setup", () => {
  const first = init();
  first.setFieldValue("BOTH", "INTERRUPTS");
  generate(first);
  const second = init("2", 112);
  generate(second);
  const statements = [];
  for (const [suffix, methods] of [
    ["status", QWIIC_STATUS],
    ["value", QWIIC_VALUES],
  ]) {
    const block = workspace.newBlock(`sensebox_qwiic_button_${suffix}`);
    for (const method of methods) {
      block.setFieldValue(method, "METHOD");
      statements.push(`(void)${generate(block)[0]};`);
    }
  }
  const led = workspace.newBlock("sensebox_qwiic_button_led");
  for (const mode of ["ON", "OFF", "BREATHE"]) {
    led.setFieldValue(mode, "MODE");
    statements.push(generate(led));
  }
  statements.push(generate(workspace.newBlock("sensebox_qwiic_button_action")));
  assert.ok(statements.includes("qwiicButton_1.clearEventBits();\n"));
  assert.ok(
    statements.every(
      (s) => !s.includes(".begin(") && !s.includes("setDebounceTime"),
    ),
  );
  const join = (object) => Object.values(object).join("\n");
  const code = `${join(generator.libraries_)}\n${join(generator.definitions_)}\n${join(generator.variables_)}\nvoid setup() {\n${join(generator.preSetupCode_)}\n${join(generator.setupCode_)}\n}\nvoid loop() {\n${statements.join("\n")}\n}`;
  mkdirSync("/tmp/qwiic-smoke", { recursive: true });
  writeFileSync("/tmp/qwiic-smoke/qwiic-smoke.ino", code);
});
