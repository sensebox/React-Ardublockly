import * as Blockly from "blockly/core";

export const INSTANCE_TYPES = {
  matrix: ["sensebox_ws2812_matrix_init"],
  sd_file: ["sensebox_sd_create_file", "sensebox_esp32s2_sd_create_file"],
};

export function instanceWorkspace(block) {
  return block?.workspace.targetWorkspace || block?.workspace;
}

export function instanceDefinitions(block, type, includeDisabled = false) {
  return (instanceWorkspace(block)?.getAllBlocks(false) || []).filter(
    (candidate) =>
      INSTANCE_TYPES[type]?.includes(candidate.type) &&
      (includeDisabled ||
        (candidate.isEnabled() && !candidate.getInheritedDisabled())),
  );
}

/** Add an editable default declaration ahead of the existing setup code. */
export function createDefaultInstance(block, type) {
  const workspace = instanceWorkspace(block);
  if (
    block.isInFlyout ||
    workspace.isReadOnly() ||
    instanceDefinitions(block, type, true).length
  )
    return null;
  const definitionType = INSTANCE_TYPES[type]?.[0];
  if (!definitionType) return null;
  const created = [];
  const newBlock = (blockType) => {
    const createdBlock = workspace.newBlock(blockType);
    if (workspace.rendered) createdBlock.initSvg();
    created.push(createdBlock);
    return createdBlock;
  };
  let setup = workspace.getBlocksByType("arduino_functions", false)[0];
  if (!setup) {
    setup = newBlock("arduino_functions");
  }
  const definition = newBlock(definitionType);
  if (type === "sd_file") {
    const filename = newBlock("text");
    filename.setFieldValue("Data", "TEXT");
    definition
      .getInput("FILENAME")
      .connection.connect(filename.outputConnection);
  }
  const setupConnection = setup.getInput("SETUP_FUNC").connection;
  const previous = setupConnection.targetConnection;
  if (previous) setupConnection.disconnect();
  setupConnection.connect(definition.previousConnection);
  if (previous) definition.nextConnection.connect(previous);
  if (workspace.rendered) {
    created.forEach((createdBlock) => createdBlock.render());
  }
  return definition;
}

export function instanceNameField(block, type, baseName) {
  const uniqueName = (value) => {
    const name = value.trim().replace(/\s+/g, " ");
    if (!name) return null;
    const names = instanceDefinitions(block, type, true)
      .filter((candidate) => candidate !== block)
      .map((candidate) =>
        candidate.getFieldValue("INSTANCE_NAME")?.toLowerCase(),
      );
    let result = name;
    for (let suffix = 2; names.includes(result.toLowerCase()); suffix++)
      result = `${name} ${suffix}`;
    return result;
  };
  return new Blockly.FieldTextInput(uniqueName(baseName), uniqueName);
}

// Resolve old projects before their users have selected an instance. Never
// substitute another definition for a deleted explicit selection.
export function legacyInstance(block, type) {
  if (block.getFieldValue("INSTANCE")) return null;
  const definitions = instanceDefinitions(block, type);
  let matches = [];
  if (type === "matrix") {
    const port = block.getFieldValue("Port");
    if (port)
      matches = definitions.filter(
        (definition) => definition.getFieldValue("Port") === port,
      );
  } else {
    const filename = block.getInputTargetBlock("FILENAME");
    if (filename?.type === "text") {
      matches = definitions.filter((definition) => {
        const target = definition.getInputTargetBlock("FILENAME");
        return (
          target?.type === "text" &&
          target.getFieldValue("TEXT") === filename.getFieldValue("TEXT") &&
          definition.getFieldValue("extension") ===
            block.getFieldValue("extension")
        );
      });
    }
  }
  return matches.length === 1 ? matches[0] : null;
}

export function selectedInstance(block, type) {
  const id = block.getFieldValue("INSTANCE");
  return (
    instanceDefinitions(block, type).find(
      (definition) => definition.id === id,
    ) || legacyInstance(block, type)
  );
}

export function instanceCodeName(definition, prefix, generator) {
  generator.instanceNames_ ||= new Map();
  const key = `${prefix}:${definition.id}`;
  if (!generator.instanceNames_.has(key)) {
    const label = definition.getFieldValue("INSTANCE_NAME") || prefix;
    generator.instanceNames_.set(
      key,
      generator.nameDB_.getDistinctName(`${prefix}_${label}`, "INSTANCE"),
    );
  }
  return generator.instanceNames_.get(key);
}
