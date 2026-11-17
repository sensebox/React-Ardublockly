import * as Blockly from "blockly/core";
import { getColour } from "@/components/Blockly/helpers/colour";

/**
 * Block instances.
 *
 * An init block (e.g. "LED-Matrix initialisieren") defines a named instance
 * ("Matrix 1") on a port. Several instances can exist at the same time
 * (e.g. "Matrix 1" on port A and "Matrix 2" on port B).
 *
 * - The name is a block (`nameBlock`) that is fixed to the init block: it
 *   looks like a block but can't be dragged out or deleted on its own.
 * - Blocks that use the device get a value input "INSTANCE" for the instance
 *   block (`instance`), which can be moved freely (like the file name block
 *   of the SD card blocks).
 *
 * Backwards compatibility: the dependent blocks keep their "Port" field. It is
 * hidden and kept in sync with the port of the plugged-in instance, so the
 * generators stay unchanged. Old projects, tutorials and share links (which
 * only contain "Port") get a name block for every init block and an instance
 * block for the init block with the same port when they are loaded.
 */
export const INSTANCE_GROUPS = [
  {
    init: "sensebox_ws2812_matrix_init",
    nameBlock: "sensebox_ws2812_matrix_instance_name",
    instance: "sensebox_ws2812_matrix_instance",
    nameCheck: "MatrixInstanceName",
    check: "MatrixInstance",
    baseName: "Matrix",
    variablePrefix: "matrix_",
    nameTooltipMsg: "senseBox_ws2812_rgb_matrix_instance_name_tooltip",
    tooltipMsg: "senseBox_ws2812_rgb_matrix_instance_tooltip",
    helpUrlMsg: "senseBox_ws2812_rgb_matrix_helpurl",
    notInitializedMsg: "senseBox_ws2812_rgb_matrix_not_initialized",
    missingMsg: "senseBox_ws2812_rgb_matrix_instance_missing",
    dependents: [
      "sensebox_ws2812_matrix_text",
      "sensebox_ws2812_matrix_drawPixel",
      "sensebox_ws2812_matrix_clear",
      "sensebox_ws2812_matrix_showBitmap",
      "sensebox_ws2812_matrix_fullcolor",
    ],
  },
];

const PORT = "Port";
const NAME = "NAME";
const INSTANCE = "INSTANCE";

const groupByInit = (type) => INSTANCE_GROUPS.find((g) => g.init === type);
const groupByNameBlock = (type) =>
  INSTANCE_GROUPS.find((g) => g.nameBlock === type);
const groupByInstance = (type) =>
  INSTANCE_GROUPS.find((g) => g.instance === type);
const groupByDependent = (type) =>
  INSTANCE_GROUPS.find((g) => g.dependents.includes(type));

const isUsable = (block) =>
  block && block.workspace && !block.isInFlyout && !block.workspace.isFlyout;

const getInits = (ws, group) => ws.getBlocksByType(group.init, false);
const getInstances = (ws, group) => ws.getBlocksByType(group.instance, false);
const getDependents = (ws, group) =>
  group.dependents.flatMap((type) => ws.getBlocksByType(type, false));

/** Name of an init block (from its name block) or null. */
const initName = (init) => {
  const nameBlock = init.getInputTargetBlock(INSTANCE);
  return nameBlock ? nameBlock.getFieldValue(NAME) : null;
};

/** Name of the instance plugged into a dependent block or null. */
const pluggedInstance = (dep) => {
  const target = dep.getInputTargetBlock(INSTANCE);
  return target ? target.getFieldValue(INSTANCE) : null;
};

const instanceNames = (ws, group) =>
  getInits(ws, group)
    .map(initName)
    .filter((name) => name !== null);

/** First free name "<baseName> <n>" that is not in `used`. */
export const nextFreeName = (baseName, used) => {
  let i = 1;
  while (used.has(`${baseName} ${i}`)) i++;
  return `${baseName} ${i}`;
};

const isValidOption = (field, value) =>
  field.getOptions(false).some((option) => option[1] === value);

/**
 * Dropdown that lists the instances on the workspace. It accepts any name,
 * so a saved project keeps its selection even if the instance is created
 * later or has been deleted.
 * @param {function(!Blockly.Workspace): !Array<string>} getNames instances
 * @param {string} defaultName shown if there is no instance (e.g. toolbox)
 */
export class FieldInstanceDropdown extends Blockly.FieldDropdown {
  constructor(getNames, defaultName) {
    super(function () {
      const block = this.getSourceBlock && this.getSourceBlock();
      const names = isUsable(block) ? [...getNames(block.workspace)] : [];
      const current = this.getValue && this.getValue();
      if (current && !names.includes(current)) names.push(current);
      if (names.length === 0) names.push(defaultName);
      return names.map((name) => [name, name]);
    });
  }

  doClassValidation_(newValue) {
    return typeof newValue === "string" && newValue !== "" ? newValue : null;
  }
}

/** Rejects empty names and names used by another init block. */
function createNameValidator(group) {
  return function (newName) {
    const name = String(newName).trim();
    if (!name) return null;
    const nameBlock = this.getSourceBlock();
    if (!isUsable(nameBlock)) return name;
    const init = nameBlock.getParent();
    const taken = getInits(nameBlock.workspace, group).some(
      (other) => other !== init && initName(other) === name,
    );
    return taken ? null : name;
  };
}

/**
 * Defines the name and instance blocks and adds the instance inputs to the
 * existing block definitions:
 * - init blocks get a value input for the (fixed) name block
 * - dependent blocks get a value input for the instance block; their port
 *   is hidden
 */
export function applyInstanceFields() {
  INSTANCE_GROUPS.forEach((group) => {
    Blockly.Blocks[group.nameBlock] = {
      init: function () {
        this.setColour(getColour().sensebox);
        this.appendDummyInput().appendField(
          new Blockly.FieldTextInput(
            `${group.baseName} 1`,
            createNameValidator(group),
          ),
          NAME,
        );
        this.setOutput(true, group.nameCheck);
        // fixed to its init block
        this.setMovable(false);
        this.setDeletable(false);
        this.setTooltip(Blockly.Msg[group.nameTooltipMsg]);
        this.setHelpUrl(Blockly.Msg[group.helpUrlMsg]);
      },
    };

    Blockly.Blocks[group.instance] = {
      init: function () {
        this.setColour(getColour().sensebox);
        this.appendDummyInput().appendField(
          new FieldInstanceDropdown(
            (ws) => instanceNames(ws, group),
            `${group.baseName} 1`,
          ),
          INSTANCE,
        );
        this.setOutput(true, group.check);
        this.setTooltip(Blockly.Msg[group.tooltipMsg]);
        this.setHelpUrl(Blockly.Msg[group.helpUrlMsg]);
      },
    };

    const initDef = Blockly.Blocks[group.init];
    const originalInit = initDef.init;
    initDef.init = function () {
      originalInit.call(this);
      moveLabelsToInstanceInput(this, group.nameCheck);
    };

    group.dependents.forEach((type) => {
      const def = Blockly.Blocks[type];
      const originalDepInit = def.init;
      def.init = function () {
        originalDepInit.call(this);
        moveLabelsToInstanceInput(this, group.check, { hidePort: true });
      };
      def.onchange = instanceWarningOnChange;
    });
  });
}

/**
 * Adds the value input "INSTANCE" in the place of the input with the port.
 * The labels of that input (e.g. "Zeige Text/Zahl") move to the new input.
 * With hidePort the port input is hidden; it stays serialised, so the
 * generators and saved projects keep using "Port".
 */
function moveLabelsToInstanceInput(block, check, { hidePort = false } = {}) {
  const portField = block.getField(PORT);
  const portInput = portField.getParentInput();
  const portLabel = portInput.fieldRow.find(
    (field) => !field.name && field.getText() === "Port:",
  );
  const labels = portInput.fieldRow.filter(
    (field) =>
      field !== portField &&
      field !== portLabel &&
      field instanceof Blockly.FieldLabel &&
      !field.name,
  );

  const instanceInput = block.appendValueInput(INSTANCE).setCheck(check);
  labels.forEach((label) => {
    instanceInput.appendField(label.getText());
    label.setVisible(false);
  });
  if (hidePort) {
    if (
      portInput.fieldRow.every(
        (field) =>
          !field.isVisible() || field === portField || field === portLabel,
      )
    ) {
      portInput.setVisible(false);
    } else {
      if (portLabel) portLabel.setVisible(false);
      portField.setVisible(false);
    }
  }
  // place the instance input in front of the port input
  block.inputList.splice(block.inputList.indexOf(instanceInput), 1);
  block.inputList.splice(block.inputList.indexOf(portInput), 0, instanceInput);
}

/** Creates a block and plugs it into the input "INSTANCE" of a block. */
export function plugBlock(parent, type, fieldName, value) {
  const ws = parent.workspace;
  const block = ws.newBlock(type);
  block.setFieldValue(value, fieldName);
  if (ws.rendered) {
    block.initSvg();
    block.render();
  }
  parent.getInput(INSTANCE).connection.connect(block.outputConnection);
  return block;
}

/**
 * Brings the workspace into a consistent state:
 * - name blocks only exist inside init blocks
 * - every init block has a name block with a unique name
 * - old blocks (loaded without instance block) get one for their port
 * - new instance blocks get an existing instance if their name doesn't exist
 * - the hidden port of every dependent block follows its instance
 */
function normalize(ws, createdIds) {
  INSTANCE_GROUPS.forEach((group) => {
    // e.g. a pasted name block: it can't be moved or deleted by the user
    ws.getBlocksByType(group.nameBlock, false)
      .filter((nameBlock) => !nameBlock.getParent())
      .forEach((nameBlock) => nameBlock.dispose(false));

    const inits = getInits(ws, group);
    const used = new Set();
    inits.forEach((init) => {
      let name = initName(init);
      if (name === null || used.has(name)) {
        const taken = new Set([...used, ...instanceNames(ws, group)]);
        name = nextFreeName(group.baseName, taken);
        const nameBlock = init.getInputTargetBlock(INSTANCE);
        if (nameBlock) nameBlock.setFieldValue(name, NAME);
        else plugBlock(init, group.nameBlock, NAME, name);
      }
      used.add(name);
    });

    const portByName = new Map(
      inits.map((init) => [initName(init), init.getFieldValue(PORT)]),
    );

    getInstances(ws, group).forEach((instance) => {
      if (
        createdIds.has(instance.id) &&
        !portByName.has(instance.getFieldValue(INSTANCE)) &&
        inits.length > 0
      ) {
        instance.setFieldValue(initName(inits[0]), INSTANCE);
      }
    });

    getDependents(ws, group).forEach((dep) => {
      if (!dep.getInput(INSTANCE)) return;
      if (createdIds.has(dep.id) && !dep.getInputTargetBlock(INSTANCE)) {
        const match = inits.find(
          (init) => init.getFieldValue(PORT) === dep.getFieldValue(PORT),
        );
        if (match) plugBlock(dep, group.instance, INSTANCE, initName(match));
      }

      const port = portByName.get(pluggedInstance(dep));
      const portField = dep.getField(PORT);
      if (
        port !== undefined &&
        portField.getValue() !== port &&
        isValidOption(portField, port)
      ) {
        portField.setValue(port);
      }
    });
  });
}

function renameReferences(ws, group, oldName, newName) {
  if (instanceNames(ws, group).includes(oldName)) return;
  getInstances(ws, group).forEach((instance) => {
    if (instance.getFieldValue(INSTANCE) === oldName) {
      instance.setFieldValue(newName, INSTANCE);
    }
  });
}

const isRelevantType = (type) =>
  !!(
    groupByInit(type) ||
    groupByNameBlock(type) ||
    groupByInstance(type) ||
    groupByDependent(type)
  );

/**
 * Workspace change listener that keeps instances and the hidden ports of the
 * dependent blocks in sync.
 * @param {!Blockly.Workspace} ws main workspace
 * @returns {function(!Blockly.Events.Abstract)} listener
 */
export function createInstanceSyncListener(ws) {
  return (e) => {
    if (e.workspaceId !== ws.id || e.isUiEvent) return;

    const createdIds = new Set();
    let rename = null;

    if (e.type === Blockly.Events.BLOCK_CREATE) {
      // Not filtered by recordUndo: blocks appended via JSON (paste, flyout)
      // fire create events with recordUndo = false. normalize() changes
      // nothing if the workspace is already consistent (e.g. on redo).
      (e.ids || [e.blockId]).forEach((id) => createdIds.add(id));
    } else {
      // Undo/redo fires events with recordUndo = false. Our follow-up changes
      // are in the same event group and are reverted by Blockly itself.
      if (!e.recordUndo) return;
      const block = ws.getBlockById(e.blockId);
      if (!block || !isRelevantType(block.type)) return;

      if (e.type === Blockly.Events.BLOCK_CHANGE && e.element === "field") {
        const group = groupByNameBlock(block.type);
        if (group && e.name === NAME && e.oldValue !== e.newValue) {
          rename = { group, oldName: e.oldValue, newName: e.newValue };
        }
      } else if (e.type === Blockly.Events.BLOCK_MOVE) {
        // only (dis)connecting an instance block is relevant
        if (e.oldParentId === e.newParentId) return;
      } else {
        return;
      }
    }

    runInEventGroup(e, () => {
      if (rename) {
        renameReferences(ws, rename.group, rename.oldName, rename.newName);
      }
      normalize(ws, createdIds);
    });
  };
}

/**
 * Runs follow-up changes in the event group of the triggering event, so a
 * single undo reverts all of them. The event is already on the undo stack,
 * so assigning the group here also affects the undo grouping.
 * @param {!Blockly.Events.Abstract} e triggering event
 * @param {function()} fn follow-up changes
 */
export function runInEventGroup(e, fn) {
  if (!e.group) e.group = Blockly.utils.idGenerator.genUid();
  const previousGroup = Blockly.Events.getGroup();
  Blockly.Events.setGroup(e.group);
  try {
    fn();
  } finally {
    Blockly.Events.setGroup(previousGroup);
  }
}

/**
 * onchange handler for dependent blocks: warns if no instance is plugged in
 * or the instance has no init block on the workspace.
 * @this {Blockly.Block}
 */
export function instanceWarningOnChange() {
  if (!isUsable(this) || !this.setWarningText) return;
  const group = groupByDependent(this.type);
  if (!group) return;

  const name = pluggedInstance(this);
  let warning = null;
  if (name === null) {
    warning = Blockly.Msg[group.missingMsg] || "";
  } else if (!instanceNames(this.workspace, group).includes(name)) {
    warning = (Blockly.Msg[group.notInitializedMsg] || "").replace(/%1/g, name);
  }
  this.setWarningText(warning, "instance");
}

/**
 * Generator for the instance and name blocks: the device object of the
 * instance (e.g. `matrix_2`). The init and dependent blocks don't use it
 * (they use their port), it only keeps the generator from failing.
 */
export function instanceGenerator(block) {
  const group = groupByInstance(block.type) || groupByNameBlock(block.type);
  const name = block.getFieldValue(INSTANCE) ?? block.getFieldValue(NAME);
  const init = getInits(block.workspace, group).find(
    (b) => initName(b) === name,
  );
  const port = init ? init.getFieldValue(PORT) : "";
  return [
    `${group.variablePrefix}${port}`,
    Blockly.Generator.Arduino.ORDER_ATOMIC,
  ];
}
