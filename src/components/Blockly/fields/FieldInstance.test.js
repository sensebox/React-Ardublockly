import { test, before, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import * as Blockly from "blockly/core";
import "../blocks/sensebox-led";
import "../blocks/sensebox-sd";
import "../blocks/procedures";
import { selectedInstance, instanceCodeName } from "../helpers/instances";
import { LED } from "../msg/en/sensebox-led";
import { SD } from "../msg/en/sensebox-sd";
import { setBoardHelper } from "../helpers/board";

Object.assign(Blockly.Msg, LED, SD);
globalThis.window = { sessionStorage: { getItem: () => "MCU" } };

// Use the production block generators with a small, headless Arduino harness.
const generator = new Blockly.Generator("Arduino");
Blockly.Generator.Arduino = generator;
before(async () => {
  await import("../generator/arduino/sensebox-led");
  await import("../generator/arduino/sensebox-sd");
});
generator.ORDER_ATOMIC = 0;
generator.ORDER_NONE = 99;
generator.forBlock.text = (block) => [
  JSON.stringify(block.getFieldValue("TEXT")),
  0,
];
Blockly.Blocks.text = {
  init() {
    this.appendDummyInput().appendField(
      new Blockly.FieldTextInput("Data"),
      "TEXT",
    );
    this.setOutput(true, "String");
  },
};
const resetGenerator = () => {
  for (const property of [
    "definitions_",
    "libraries_",
    "setupCode_",
    "functionNames_",
  ])
    generator[property] = {};
  generator.nameDB_ = new Blockly.Names("for,while,class");
  generator.instanceNames_ = new Map();
};
const tick = () => new Promise((resolve) => setTimeout(resolve, 30));
const matrixType = "sensebox_ws2812_matrix_init";
const fileType = "sensebox_sd_create_file";
let workspace;
beforeEach(() => {
  workspace = new Blockly.Workspace();
  setBoardHelper("MCU");
  resetGenerator();
});
afterEach(() => workspace.dispose());
function file(name = "Data") {
  const definition = workspace.newBlock(fileType);
  const text = workspace.newBlock("text");
  text.setFieldValue(name, "TEXT");
  definition.getInput("FILENAME").connection.connect(text.outputConnection);
  return definition;
}
function use(type, definition) {
  const block = workspace.newBlock(type);
  block.setFieldValue(definition.id, "INSTANCE");
  return block;
}
function code(block) {
  return generator.forBlock[block.type].call(block, block, generator);
}

test("typed references follow renaming and port changes, with unique names", async () => {
  const first = workspace.newBlock(matrixType);
  const second = workspace.newBlock(matrixType);
  const sd = file();
  assert.notEqual(
    first.getFieldValue("INSTANCE_NAME"),
    second.getFieldValue("INSTANCE_NAME"),
  );
  const draw = use("sensebox_ws2812_matrix_clear", first);
  await tick();
  const options = draw.getField("INSTANCE").getOptions(false);
  assert.ok(options.some((option) => option[1] === second.id));
  assert.ok(!options.some((option) => option[1] === sd.id));
  first.setFieldValue("My display", "INSTANCE_NAME");
  const port = first.getField("Port").getOptions(false).at(-1)[1];
  first.setFieldValue(port, "Port");
  await tick();
  assert.equal(draw.getField("INSTANCE").getText(), "My display");
  const generated = code(draw);
  const name = instanceCodeName(first, "matrix", generator);
  assert.match(generated, new RegExp(`${name}\\.show`));
  assert.ok(
    Object.values(generator.definitions_).some((value) =>
      value.includes(`HEIGHT, ${port},`),
    ),
  );
  assert.match(name, /^[a-zA-Z_][a-zA-Z0-9_]*$/);
});

test("deletion never silently switches the instance, and undo restores it", async () => {
  const definition = workspace.newBlock(matrixType);
  const other = workspace.newBlock(matrixType);
  const draw = use("sensebox_ws2812_matrix_clear", definition);
  await tick();
  workspace.clearUndo();
  const id = definition.id;
  definition.dispose();
  await tick();
  assert.equal(draw.getFieldValue("INSTANCE"), id);
  assert.equal(selectedInstance(draw, "matrix"), null);
  assert.equal(code(draw), "");
  workspace.undo(false);
  await tick();
  assert.equal(selectedInstance(draw, "matrix").id, id);
  assert.notEqual(selectedInstance(draw, "matrix").id, other.id);
});

test("XML and JSON preserve forward references", async () => {
  const draw = workspace.newBlock("sensebox_ws2812_matrix_clear");
  const definition = workspace.newBlock(matrixType);
  draw.setFieldValue(definition.id, "INSTANCE");
  const xml = Blockly.Xml.workspaceToDom(workspace);
  const json = Blockly.serialization.workspaces.save(workspace);
  workspace.clear();
  Blockly.Xml.domToWorkspace(xml, workspace);
  await tick();
  assert.equal(
    selectedInstance(workspace.getBlocksByType(draw.type)[0], "matrix").id,
    definition.id,
  );
  Blockly.serialization.workspaces.load(json, workspace);
  await tick();
  assert.equal(
    selectedInstance(workspace.getBlocksByType(draw.type)[0], "matrix").id,
    definition.id,
  );
});

test("old matrix ports and SD filenames resolve to matching declarations", async () => {
  const definition = workspace.newBlock(matrixType);
  const draw = workspace.newBlock("sensebox_ws2812_matrix_clear");
  draw.setFieldValue(definition.getFieldValue("Port"), "Port");
  const sd = file("Legacy");
  const open = workspace.newBlock("sensebox_sd_open_file");
  const filename = workspace.newBlock("text");
  filename.setFieldValue("Legacy", "TEXT");
  open.getInput("FILENAME").connection.connect(filename.outputConnection);
  await tick();
  assert.equal(draw.getFieldValue("INSTANCE"), definition.id);
  assert.equal(open.getFieldValue("INSTANCE"), sd.id);
});

test("SD instances share central filenames and use separate File handles", async () => {
  const first = file("First"),
    second = file("Second");
  const openFirst = use("sensebox_sd_open_file", first);
  const openSecond = use("sensebox_sd_open_file", second);
  const exists = use("sensebox_sd_exists", first);
  const write = workspace.newBlock("sensebox_sd_write_file");
  openFirst.getInput("SD").connection.connect(write.previousConnection);
  const firstHandle = instanceCodeName(first, "sdFile", generator);
  const secondHandle = instanceCodeName(second, "sdFile", generator);
  assert.notEqual(firstHandle, secondHandle);
  assert.ok(code(write).startsWith(firstHandle + ".println"));
  first.getInputTargetBlock("FILENAME").setFieldValue("Renamed", "TEXT");
  first.setFieldValue("csv", "extension");
  assert.match(code(openFirst), /Renamed/);
  assert.match(code(exists)[0], /Renamed/);
  assert.match(code(openSecond), /Second/);
  assert.ok(code(openSecond).includes(secondHandle + ".close"));
  await tick();
  assert.equal(openFirst.getInput("FILENAME").isVisible(), false);
});

test("disabled definitions and cross-type references cannot generate calls", async () => {
  const definition = workspace.newBlock(matrixType);
  const draw = use("sensebox_ws2812_matrix_clear", definition);
  definition.setDisabledReason(true, "test");
  await tick();
  assert.equal(selectedInstance(draw, "matrix"), null);
  assert.equal(code(draw), "");
  assert.equal(draw.getField("INSTANCE").getText(), "Missing instance");
  definition.setDisabledReason(false, "test");
  await tick();
  assert.equal(selectedInstance(draw, "matrix"), definition);
  draw.setFieldValue(file().id, "INSTANCE");
  assert.equal(selectedInstance(draw, "matrix"), null);
});

test("each matrix operation uses its selected definition", () => {
  const first = workspace.newBlock(matrixType),
    second = workspace.newBlock(matrixType);
  for (const type of [
    "sensebox_ws2812_matrix_clear",
    "sensebox_ws2812_matrix_text",
    "sensebox_ws2812_matrix_drawPixel",
    "sensebox_ws2812_matrix_showBitmap",
    "sensebox_ws2812_matrix_fullcolor",
  ]) {
    const consumer = use(type, second);
    assert.ok(
      code(consumer).includes(
        instanceCodeName(second, "matrix", generator) + ".",
      ),
    );
    assert.ok(
      !code(consumer).includes(
        instanceCodeName(first, "matrix", generator) + ".",
      ),
    );
  }
});

for (const board of ["MCU", "MCU-S2", "MCU-EYE"]) {
  test(`SD generation retains board-specific paths and write mode on ${board}`, () => {
    setBoardHelper(board);
    const definition = file("Log"),
      open = use("sensebox_sd_open_file", definition);
    const generated = code(open);
    assert.match(generated, board === "MCU" ? /FILE_WRITE/ : /FILE_APPEND/);
    assert.ok(
      generated.includes(board === "MCU" ? 'String("")' : 'String("/")'),
    );
    assert.match(code(definition), /FILE_WRITE/);
    const setup = Object.values(generator.setupCode_).join("\n");
    assert.ok(
      setup.includes(
        board === "MCU"
          ? "SD.begin(28)"
          : board === "MCU-EYE"
            ? "PIN_SD_CS"
            : "VSPI_SS",
      ),
    );
  });
}

test("legacy SD files remain editable without a matching declaration", async () => {
  const open = workspace.newBlock("sensebox_esp32s2_sd_open_file");
  const filename = workspace.newBlock("text");
  filename.setFieldValue("Old", "TEXT");
  open.getInput("FILENAME").connection.connect(filename.outputConnection);
  await tick();
  assert.equal(open.getInput("FILENAME").isVisible(), true);
  assert.match(code(open), /Old/);
  assert.match(code(open), /sdFile.close/);
});

test("nested SD blocks write to their nearest enclosing file", () => {
  const outer = use("sensebox_sd_open_file", file("Outer"));
  const inner = use("sensebox_sd_open_file", file("Inner"));
  const write = workspace.newBlock("sensebox_sd_write_file");
  outer.getInput("SD").connection.connect(inner.previousConnection);
  inner.getInput("SD").connection.connect(write.previousConnection);
  const handle = instanceCodeName(
    selectedInstance(inner, "sd_file"),
    "sdFile",
    generator,
  );
  assert.ok(code(write).startsWith(handle + ".println"));
});

test("SD instance references and names survive JSON reload", async () => {
  const definition = file("Log");
  definition.setFieldValue("Measurements", "INSTANCE_NAME");
  const open = use("sensebox_sd_open_file", definition);
  const json = Blockly.serialization.workspaces.save(workspace);
  Blockly.serialization.workspaces.load(json, workspace);
  await tick();
  const restored = workspace.getBlockById(open.id);
  assert.equal(restored.getField("INSTANCE").getText(), "Measurements");
  assert.match(code(restored), /Log/);
});

for (const [definitionType, consumerType] of [
  [matrixType, "sensebox_ws2812_matrix_clear"],
  [fileType, "sensebox_sd_open_file"],
]) {
  test(`${consumerType} automatically selects the first defined instance`, async () => {
    const first = workspace.newBlock(definitionType);
    const second = workspace.newBlock(definitionType);
    const consumer = workspace.newBlock(consumerType);
    await tick();
    assert.equal(consumer.getFieldValue("INSTANCE"), first.id);
    consumer.setFieldValue(second.id, "INSTANCE");
    workspace.newBlock(definitionType);
    await tick();
    assert.equal(consumer.getFieldValue("INSTANCE"), second.id);
  });

  test(`${consumerType} creates and selects a default setup instance`, async () => {
    const consumer = workspace.newBlock(consumerType);
    await tick();
    const definitions = workspace.getBlocksByType(definitionType);
    assert.equal(definitions.length, 1);
    assert.equal(consumer.getFieldValue("INSTANCE"), definitions[0].id);
    const setup = workspace.getBlocksByType("arduino_functions")[0];
    assert.equal(setup.getInputTargetBlock("SETUP_FUNC"), definitions[0]);
    if (definitionType === fileType) {
      assert.equal(
        definitions[0].getInputTargetBlock("FILENAME").getFieldValue("TEXT"),
        "Data",
      );
    }
    const next = workspace.newBlock(consumerType);
    await tick();
    assert.equal(next.getFieldValue("INSTANCE"), definitions[0].id);
    assert.equal(workspace.getBlocksByType(definitionType).length, 1);
  });
}

test("autoselection leaves unmatched legacy configuration untouched", async () => {
  file("Other");
  const open = workspace.newBlock("sensebox_sd_open_file");
  const filename = workspace.newBlock("text");
  filename.setFieldValue("Legacy", "TEXT");
  open.getInput("FILENAME").connection.connect(filename.outputConnection);
  const matrix = workspace.newBlock(matrixType);
  const draw = workspace.newBlock("sensebox_ws2812_matrix_clear");
  const otherPort = matrix
    .getField("Port")
    .getOptions(false)
    .find((option) => option[1] !== matrix.getFieldValue("Port"))[1];
  draw.setFieldValue(otherPort, "Port");
  await tick();
  assert.equal(open.getFieldValue("INSTANCE"), "");
  assert.equal(draw.getFieldValue("INSTANCE"), "");
  assert.match(code(open), /Legacy/);
});

test("automatic declarations preserve existing setup code and undo together", async () => {
  const setup = workspace.newBlock("arduino_functions");
  const existing = file("Existing");
  setup.getInput("SETUP_FUNC").connection.connect(existing.previousConnection);
  await tick();
  workspace.clearUndo();
  const consumer = workspace.newBlock("sensebox_ws2812_matrix_clear");
  await tick();
  await tick();
  const definition = selectedInstance(consumer, "matrix");
  assert.equal(setup.getInputTargetBlock("SETUP_FUNC"), definition);
  assert.equal(definition.getNextBlock(), existing);
  workspace.undo(false);
  await tick();
  assert.equal(workspace.getBlocksByType(matrixType).length, 0);
  assert.equal(workspace.getBlocksByType(consumer.type).length, 0);
  assert.equal(setup.getInputTargetBlock("SETUP_FUNC"), existing);
  workspace.undo(true);
  await tick();
  assert.equal(workspace.getBlocksByType(matrixType).length, 1);
  assert.equal(
    selectedInstance(workspace.getBlockById(consumer.id), "matrix").id,
    definition.id,
  );
});
