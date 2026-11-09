import * as Blockly from "blockly/core";
import {
  instanceDefinitions,
  instanceWorkspace,
  legacyInstance,
  selectedInstance,
  createDefaultInstance,
} from "../helpers/instances";

/** Typed references to setup declarations, stored by block ID, not by label. */
export default class FieldInstance extends Blockly.FieldDropdown {
  constructor(type) {
    super(function () {
      return this.instanceOptions();
    });
    this.instanceType = type;
  }

  static fromJson(options) {
    return new FieldInstance(options.instanceType);
  }

  instanceOptions() {
    const definitions = instanceDefinitions(
      this.getSourceBlock(),
      this.instanceType,
    );
    const options = definitions.map((definition) => [
      definition.getFieldValue("INSTANCE_NAME") || definition.type,
      definition.id,
    ]);
    options.sort((a, b) => a[0].localeCompare(b[0]));
    const value = this.getValue();
    if (value && !options.some((option) => option[1] === value)) {
      options.unshift([
        Blockly.Msg.senseBox_instance_missing || "Missing instance",
        value,
      ]);
    }
    if (!value || !options.length)
      options.unshift([
        Blockly.Msg.senseBox_instance_select || "Choose instance…",
        "",
      ]);
    return options;
  }

  // References may be loaded before their definitions (XML, JSON and undo).
  doClassValidation_(value) {
    return typeof value === "string" ? value : null;
  }

  doValueUpdate_(value) {
    this.value_ = value;
    this.getOptions(false);
    super.doValueUpdate_(value);
  }

  setSourceBlock(block) {
    super.setSourceBlock(block);
    this.workspace_ = instanceWorkspace(block);
    this.listener_ = (event) => {
      if (event.isUiEvent || block.isDeadOrDying()) return;
      if (
        event.type === Blockly.Events.BLOCK_CREATE ||
        event.type === Blockly.Events.FINISHED_LOADING
      ) {
        // Wait for creation/loading to finish so saved references and legacy
        // ports/filenames take precedence over the default selection.
        const hasLegacyConfiguration =
          this.instanceType === "matrix"
            ? !!block.getFieldValue("Port")
            : !!block.getInputTargetBlock("FILENAME");
        let definition =
          legacyInstance(block, this.instanceType) ||
          (!hasLegacyConfiguration &&
            instanceDefinitions(block, this.instanceType)[0]);
        if (!this.getValue() && !block.isInFlyout) {
          const group = Blockly.Events.getGroup();
          Blockly.Events.setGroup(event.group || true);
          try {
            // Keep the inserted setup blocks and the triggering block in one
            // undo action, including when the original creation had no group.
            event.group ||= Blockly.Events.getGroup();
            if (
              !definition &&
              !hasLegacyConfiguration &&
              (event.type === Blockly.Events.FINISHED_LOADING ||
                event.ids?.includes(block.id))
            ) {
              definition = createDefaultInstance(block, this.instanceType);
            }
            if (definition) this.setValue(definition.id);
          } finally {
            Blockly.Events.setGroup(group);
          }
        }
      }
      this.refresh();
    };
    this.workspace_?.addChangeListener(this.listener_);
  }

  initView() {
    super.initView();
    this.refresh();
  }

  refresh() {
    const block = this.getSourceBlock();
    if (!block || block.isDeadOrDying()) return;
    const oldLabel = this.getText();
    // Refresh the selected label after a rename without changing the reference
    // or recording an extra undo event.
    this.doValueUpdate_(this.getValue());
    if (this.getText() !== oldLabel) this.forceRerender();
    if (block.isInFlyout) return;
    const hasLegacyFile =
      this.instanceType === "sd_file" &&
      !this.getValue() &&
      !!block.getInputTargetBlock("FILENAME");
    block.setWarningText(
      selectedInstance(block, this.instanceType) || hasLegacyFile
        ? null
        : Blockly.Msg.senseBox_instance_warning,
      "instance",
    );
    if (this.instanceType === "sd_file") {
      for (const name of ["FILENAME", "EXTENSION"]) {
        const input = block.getInput(name);
        if (input && input.isVisible() !== hasLegacyFile) {
          const blocks = input.setVisible(hasLegacyFile);
          if (block.rendered) {
            blocks.forEach((child) => child.queueRender());
            block.queueRender();
          }
        }
      }
    }
  }

  dispose() {
    this.workspace_?.removeChangeListener(this.listener_);
    super.dispose();
  }
}

Blockly.fieldRegistry.register("field_instance", FieldInstance);
