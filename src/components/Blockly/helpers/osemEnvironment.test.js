import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import * as Blockly from "blockly";
import { OSEM } from "../msg/en/sensebox-osem.js";

let workspace, state, generator;
// Execute the real modules with only the app store and main workspace supplied by this harness.
function load(relative, context) {
  const source = readFileSync(
    new URL(relative, import.meta.url),
    "utf8",
  ).replace(/^import .*;\n/gm, "");
  vm.runInNewContext(source, context, { filename: relative });
}
beforeEach(() => {
  Blockly.Events.disable();
  Blockly.setLocale({
    ...OSEM,
    senseBox_sensor: "Sensors",
    senseBox_gps_lat: "Latitude",
    senseBox_gps_lng: "Longitude",
    senseBox_gps_alt: "Altitude",
    senseBox_gps_timeStamp: "Timestamp",
    CONTROLS_FLOW_STATEMENTS_WARNING: "Place inside interval",
  });
  workspace = new Blockly.Workspace();
  state = {
    board: { board: "MCU-S2" },
    auth: {
      user: {
        boxes: [
          {
            _id: "production-box",
            name: "Production box",
            access_token: "production-token",
            sensors: [{ _id: "production-sensor", title: "Temperature" }],
          },
        ],
      },
    },
  };
  generator = Blockly.Generator.Arduino = new Blockly.Generator("Arduino");
  generator.ORDER_ATOMIC = 0;
  generator.statementToCode = () => "";
  generator.valueToCode = () => "0";
  const context = {
    Blockly: { ...Blockly, getMainWorkspace: () => workspace },
    getColour: () => ({ sensebox: 120 }),
    store: { getState: () => state, subscribe() {} },
  };
  load("../blocks/sensebox-osem.js", context);
  load("../generator/arduino/sensebox-osem.js", context);
});
afterEach(() => {
  workspace.dispose();
  Blockly.Events.enable();
});
function resetGenerator() {
  for (const key of [
    "definitions_",
    "libraries_",
    "setupCode_",
    "variables_",
    "functionNames_",
  ])
    generator[key] = {};
}
for (const type of [
  "sensebox_osem_connection",
  "sensebox_esp32s2_osem_connection",
]) {
  test(`${type}: defaults to production and saves staging with manually entered credentials`, () => {
    const block = workspace.newBlock(type);
    assert.equal(block.getFieldValue("ENVIRONMENT"), "PRODUCTION");
    assert.ok(block.getField("BoxID") instanceof Blockly.FieldDropdown);
    block.setFieldValue("STAGING", "ENVIRONMENT");
    assert.ok(block.getField("BoxID") instanceof Blockly.FieldTextInput);
    block.setFieldValue("staging-box", "BoxID");
    block.setFieldValue("staging-token", "access_token");
    block.onchange({});
    assert.equal(block.getFieldValue("access_token"), "staging-token");
    const copy = Blockly.serialization.blocks.append(
      Blockly.serialization.blocks.save(block),
      workspace,
    );
    assert.equal(copy.getFieldValue("ENVIRONMENT"), "STAGING");
    assert.equal(copy.getFieldValue("BoxID"), "staging-box");
    assert.equal(copy.getFieldValue("access_token"), "staging-token");
    block.setFieldValue("PRODUCTION", "ENVIRONMENT");
    block.onchange({});
    assert.equal(block.getFieldValue("BoxID"), "production-box");
    assert.equal(block.getFieldValue("access_token"), "production-token");
  });
  test(`${type}: generates selected host for every board, SSL option and exposure`, () => {
    const block = workspace.newBlock(type);
    for (const board of ["MCU", "MCU:MINI", "MCU-S2", "MCU-EYE"]) {
      state.board.board = board;
      for (const ssl of ["TRUE", "FALSE"])
        for (const exposure of ["Stationary", "Mobile"])
          for (const environment of ["PRODUCTION", "STAGING"]) {
            resetGenerator();
            block.setFieldValue(ssl, "SSL");
            block.setFieldValue(exposure, "type");
            block.setFieldValue(environment, "ENVIRONMENT");
            generator.forBlock[type].call(block, block, generator);
            const host =
              environment === "STAGING"
                ? "upload.staging.opensensemap.org"
                : "ingress.opensensemap.org";
            assert.ok(generator.definitions_.host.includes(`"${host}"`));
            assert.ok(
              generator.functionNames_.submitValues.includes(
                "char _server[strlen_P(server) + 1];",
              ),
            );
            assert.ok(
              generator.functionNames_.submitValues.includes("Host: %s"),
            );
          }
    }
    resetGenerator();
    // Simulate an older block without the newly added field.
    block.inputList
      .find((input) => input.fieldRow.includes(block.getField("ENVIRONMENT")))
      .removeField("ENVIRONMENT");
    generator.forBlock[type].call(block, block, generator);
    assert.ok(generator.definitions_.host.includes("ingress.opensensemap.org"));
  });
}
test("nested staging measurements accept sensor IDs without production suggestions", () => {
  const block = workspace.newBlock("sensebox_osem_connection");
  const sensor = workspace.newBlock("sensebox_send_to_osem");
  block.getInput("DO").connection.connect(sensor.previousConnection);
  block.setFieldValue("STAGING", "ENVIRONMENT");
  sensor.onchange();
  assert.ok(sensor.getField("SensorID") instanceof Blockly.FieldTextInput);
  sensor.setFieldValue("staging-sensor", "SensorID");
  sensor.onchange();
  assert.equal(sensor.getFieldValue("SensorID"), "staging-sensor");
  const jsonCopy = Blockly.serialization.blocks.append(
    Blockly.serialization.blocks.save(block),
    workspace,
  );
  assert.equal(
    jsonCopy.getInputTargetBlock("DO").getFieldValue("SensorID"),
    "staging-sensor",
  );
  const xmlCopy = Blockly.Xml.domToBlock(
    Blockly.Xml.blockToDom(block),
    workspace,
  );
  assert.equal(xmlCopy.getFieldValue("ENVIRONMENT"), "STAGING");
  assert.equal(
    xmlCopy.getInputTargetBlock("DO").getFieldValue("SensorID"),
    "staging-sensor",
  );
});
