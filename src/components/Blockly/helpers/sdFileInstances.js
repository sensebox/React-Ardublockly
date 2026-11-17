import * as Blockly from "blockly/core";
import { getColour } from "@/components/Blockly/helpers/colour";
import {
  nextFreeName,
  plugBlock,
  runInEventGroup,
} from "@/components/Blockly/helpers/instanceSync";

/**
 * SD card file instances.
 *
 * "Erstelle Datei [Datei 1]  Dateiname [Data] . csv" defines the file
 * instance "Datei 1". The instance name and the file name are two different
 * things:
 * - the instance name is a name block fixed to the create block (it can't be
 *   dragged out or deleted on its own)
 * - the file name and extension are only entered in the create block
 *
 * The instance block `[Datei 1 ▾]` references the create block (by its block
 * id) and plugs into the file name input of the blocks that use a file
 * (open, exists). It shows the current instance name; the generators read
 * file name and extension from the create block. Renaming the instance or
 * the file changes nothing in the other blocks.
 *
 * Optional: a plain text block in the file name input still works as before,
 * so old projects and tutorials are unchanged. Old create blocks get a name
 * block when they are loaded.
 */
const CREATE_TYPES = [
  "sensebox_sd_create_file",
  "sensebox_esp32s2_sd_create_file",
];
const DEPENDENT_TYPES = [
  "sensebox_sd_open_file",
  "sensebox_esp32s2_sd_open_file",
  "sensebox_sd_exists",
];
export const SD_FILE_BLOCK = "sensebox_sd_file_instance";
export const SD_FILE_NAME_BLOCK = "sensebox_sd_file_instance_name";
const SD_FILE_CHECK = "SdFile";
const SD_FILE_NAME_CHECK = "SdFileName";
const FILENAME = "FILENAME";
const EXTENSION = "extension";
const INSTANCE = "INSTANCE";
const NAME = "NAME";
const FILE = "FILE";
const NONE = "NONE";

const baseName = () => Blockly.Msg.senseBox_sd_file_instance || "Datei";

const isUsable = (block) =>
  block && block.workspace && !block.isInFlyout && !block.workspace.isFlyout;

/** Workspace with the create blocks (the main workspace for the toolbox). */
const sourceWorkspace = (block) =>
  block && block.workspace && !block.workspace.isFlyout
    ? block.workspace
    : Blockly.getMainWorkspace();

const blocksOfTypes = (ws, types) =>
  ws ? types.flatMap((type) => ws.getBlocksByType(type, false)) : [];

const getCreates = (ws) => blocksOfTypes(ws, CREATE_TYPES);

/** Instance name of a create block, or null. */
const instanceName = (create) => {
  const nameBlock = create.getInputTargetBlock(INSTANCE);
  return nameBlock ? nameBlock.getFieldValue(NAME) : null;
};

const instanceNames = (ws) =>
  getCreates(ws)
    .map(instanceName)
    .filter((name) => name !== null);

/** The create block an instance block refers to, or null. */
const createOf = (fileBlock) => {
  const ws = sourceWorkspace(fileBlock);
  const create = ws && ws.getBlockById(fileBlock.getFieldValue(FILE));
  return create && CREATE_TYPES.includes(create.type) ? create : null;
};

const pluggedFileBlock = (block) => {
  const target = block.getInputTargetBlock(FILENAME);
  return target && target.type === SD_FILE_BLOCK ? target : null;
};

/**
 * Dropdown with the file instances on the workspace. The value is the id of
 * the create block, the text is its current instance name.
 */
class FieldSdFileDropdown extends Blockly.FieldDropdown {
  constructor() {
    super(function () {
      const block = this.getSourceBlock && this.getSourceBlock();
      const options = getCreates(sourceWorkspace(block)).map((create) => [
        instanceName(create) || "?",
        create.id,
      ]);
      const current = this.getValue && this.getValue();
      if (current && !options.some((option) => option[1] === current)) {
        options.push([this.getText_(), current]);
      }
      if (options.length === 0) options.push([this.getText_(), NONE]);
      return options;
    });
  }

  doClassValidation_(newValue) {
    return typeof newValue === "string" && newValue !== "" ? newValue : null;
  }

  /** Always the current instance name of the referenced create block. */
  getText_() {
    const block = this.getSourceBlock && this.getSourceBlock();
    const ws = sourceWorkspace(block);
    const create = ws && ws.getBlockById(this.getValue());
    if (create && CREATE_TYPES.includes(create.type)) {
      return instanceName(create) || "?";
    }
    // toolbox: show the instance the block will get when it is dragged out
    const first = getCreates(ws)[0];
    if (this.getValue() === NONE && first) return instanceName(first) || "?";
    return Blockly.Msg.senseBox_sd_file_none || "?";
  }
}

/** Rejects empty names and names used by another create block. */
function nameValidator(newName) {
  const name = String(newName).trim();
  if (!name) return null;
  const nameBlock = this.getSourceBlock();
  if (!isUsable(nameBlock)) return name;
  const create = nameBlock.getParent();
  const taken = getCreates(nameBlock.workspace).some(
    (other) => other !== create && instanceName(other) === name,
  );
  return taken ? null : name;
}

/**
 * Defines the name and instance blocks, adds the name input to the create
 * blocks and lets the using blocks accept the instance block.
 */
export function applySdFileInstances() {
  Blockly.Blocks[SD_FILE_NAME_BLOCK] = {
    init: function () {
      this.setColour(getColour().sensebox);
      this.appendDummyInput().appendField(
        new Blockly.FieldTextInput(`${baseName()} 1`, nameValidator),
        NAME,
      );
      this.setOutput(true, SD_FILE_NAME_CHECK);
      // fixed to its create block
      this.setMovable(false);
      this.setDeletable(false);
      this.setTooltip(Blockly.Msg.senseBox_sd_file_instance_name_tooltip);
      this.setHelpUrl(Blockly.Msg.sensebox_sd_helpurl);
    },
  };

  Blockly.Blocks[SD_FILE_BLOCK] = {
    init: function () {
      this.setColour(getColour().sensebox);
      this.appendDummyInput().appendField(new FieldSdFileDropdown(), FILE);
      this.setOutput(true, SD_FILE_CHECK);
      this.setTooltip(Blockly.Msg.senseBox_sd_file_instance_tooltip);
      this.setHelpUrl(Blockly.Msg.sensebox_sd_helpurl);
    },
  };

  // The legacy esp32s2 types share the definition objects, wrap each once.
  new Set(CREATE_TYPES.map((t) => Blockly.Blocks[t])).forEach((def) => {
    const originalInit = def.init;
    def.init = function () {
      originalInit.call(this);
      // The heading ("Erstelle Datei auf SD-Karte") moves into the new
      // instance input, so the name block sits next to it.
      const heading = this.inputList[0];
      const nameInput =
        this.appendValueInput(INSTANCE).setCheck(SD_FILE_NAME_CHECK);
      heading.fieldRow.forEach((field) => {
        nameInput.appendField(field.getText());
      });
      heading.setVisible(false);
      this.inputList.splice(this.inputList.indexOf(nameInput), 1);
      this.inputList.splice(1, 0, nameInput);
    };
  });

  new Set(DEPENDENT_TYPES.map((t) => Blockly.Blocks[t])).forEach((def) => {
    const originalInit = def.init;
    def.init = function () {
      originalInit.call(this);
      this.getInput(FILENAME).setCheck(["String", SD_FILE_CHECK]);
    };
    const originalOnchange = def.onchange;
    def.onchange = function (e) {
      if (originalOnchange) originalOnchange.call(this, e);
      sdFileWarning.call(this);
    };
  });
}

/** The extension comes from the file, so it is hidden in the using block. */
function setExtensionVisible(block, visible) {
  const input = block.getField(EXTENSION).getParentInput();
  if (input.isVisible() === visible) return;
  input.setVisible(visible);
  if (block.rendered) block.queueRender();
}

/**
 * - name blocks only exist inside create blocks
 * - every create block has a name block with a unique name
 * - new instance blocks without a file (toolbox) get the first file;
 *   references to deleted files are kept (warning)
 * - the extension of a using block is hidden while an instance is plugged in
 * - instance blocks show the current instance names
 */
function normalize(ws, createdIds) {
  // e.g. a pasted name block: it can't be moved or deleted by the user
  ws.getBlocksByType(SD_FILE_NAME_BLOCK, false)
    .filter((nameBlock) => !nameBlock.getParent())
    .forEach((nameBlock) => nameBlock.dispose(false));

  const creates = getCreates(ws);
  const used = new Set();
  creates.forEach((create) => {
    let name = instanceName(create);
    if (name === null || used.has(name)) {
      name = nextFreeName(baseName(), new Set([...used, ...instanceNames(ws)]));
      const nameBlock = create.getInputTargetBlock(INSTANCE);
      if (nameBlock) nameBlock.setFieldValue(name, NAME);
      else plugBlock(create, SD_FILE_NAME_BLOCK, NAME, name);
    }
    used.add(name);
  });

  ws.getBlocksByType(SD_FILE_BLOCK, false).forEach((fileBlock) => {
    if (
      createdIds.has(fileBlock.id) &&
      fileBlock.getFieldValue(FILE) === NONE &&
      creates[0]
    ) {
      fileBlock.setFieldValue(creates[0].id, FILE);
    }
    if (fileBlock.rendered) fileBlock.getField(FILE).forceRerender();
  });

  blocksOfTypes(ws, DEPENDENT_TYPES).forEach((block) =>
    setExtensionVisible(block, !pluggedFileBlock(block)),
  );
}

/**
 * Workspace change listener for the SD file instances.
 * @param {!Blockly.Workspace} ws main workspace
 * @returns {function(!Blockly.Events.Abstract)} listener
 */
export function createSdFileListener(ws) {
  return (e) => {
    if (e.workspaceId !== ws.id || e.isUiEvent) return;
    const createdIds = new Set();
    if (e.type === Blockly.Events.BLOCK_CREATE) {
      // Not filtered by recordUndo: blocks appended via JSON (paste, flyout)
      // fire create events with recordUndo = false. normalize() changes
      // nothing if the workspace is already consistent (e.g. on redo).
      (e.ids || [e.blockId]).forEach((id) => createdIds.add(id));
    } else if (
      e.type !== Blockly.Events.BLOCK_CHANGE &&
      e.type !== Blockly.Events.BLOCK_DELETE &&
      !(e.type === Blockly.Events.BLOCK_MOVE && e.oldParentId !== e.newParentId)
    ) {
      return;
    }
    runInEventGroup(e, () => normalize(ws, createdIds));
  };
}

/**
 * Warns if the plugged-in instance doesn't exist (anymore).
 * @this {Blockly.Block}
 */
function sdFileWarning() {
  if (!isUsable(this) || !this.setWarningText) return;
  const fileBlock = pluggedFileBlock(this);
  const missing = fileBlock && !createOf(fileBlock);
  this.setWarningText(
    missing ? Blockly.Msg.senseBox_sd_file_not_created || "" : null,
    "instance",
  );
}

/**
 * Extension for a block using a file: from the plugged-in instance,
 * otherwise from its own dropdown.
 * @param {!Blockly.Block} block open/exists block
 * @returns {string}
 */
export function sdFileExtension(block) {
  const fileBlock = pluggedFileBlock(block);
  const create = fileBlock && createOf(fileBlock);
  return create
    ? create.getFieldValue(EXTENSION)
    : block.getFieldValue(EXTENSION);
}

/**
 * Generator for the instance block: the file name code of the create block
 * (e.g. `"Data"`), like a text block in the file name input.
 */
export function sdFileGenerator(block, generator) {
  const create = createOf(block);
  const code = create
    ? generator.valueToCode(create, FILENAME, generator.ORDER_ATOMIC)
    : "";
  return [code || '"Data"', generator.ORDER_ATOMIC];
}

/** The name block generates nothing (the create block doesn't use it). */
export function sdFileNameGenerator(block, generator) {
  return ["", generator.ORDER_ATOMIC];
}
