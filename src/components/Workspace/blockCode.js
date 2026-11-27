import * as Blockly from "blockly";
import { diffLines } from "./codeDiff";

// Only the parts of the workspace state that affect the generated code.
// Plugin serializers (e.g. the backpack) need a rendered workspace and fail
// on a headless one, so serialization.workspaces.load can't be used.
const CODE_SERIALIZERS = ["variables", "procedures", "blocks"];

const loadCodeState = (state, workspace) => {
  CODE_SERIALIZERS.map((name) => ({
    name,
    serializer: Blockly.registry.getObject(
      Blockly.registry.Type.SERIALIZER,
      name,
    ),
  }))
    .filter(({ name, serializer }) => serializer && state[name])
    .sort((a, b) => b.serializer.priority - a.serializer.priority)
    .forEach(({ name, serializer }) => serializer.load(state[name], workspace));
};

/**
 * Finds the lines of `code` (the displayed Arduino code) that belong to
 * `block`: its own statement or expression plus includes, definitions and
 * setup code it adds.
 *
 * The workspace is copied into a headless workspace and the code is generated
 * once with and once without the block. Lines that only exist with the block
 * are its code. Removing a block heals the stack, so following blocks keep
 * their code; child blocks inside the block belong to it.
 *
 * Returns sorted 1-based line numbers of `code`.
 */
export const getBlockLines = (block, code) => {
  if (!block || !code || block.isShadow() || !block.isEnabled()) return [];
  const generator = Blockly.Generator.Arduino;
  if (!generator) return [];

  const state = Blockly.serialization.workspaces.save(block.workspace);
  const copy = new Blockly.Workspace();
  Blockly.Events.disable();
  try {
    loadCodeState(state, copy);
    const withBlock = generator.workspaceToCode(copy);
    const copiedBlock = copy.getBlockById(block.id);
    if (!copiedBlock) return [];
    copiedBlock.dispose(true);
    const withoutBlock = generator.workspaceToCode(copy);

    const { changed } = diffLines(withoutBlock, withBlock);
    if (changed.length === 0) return [];
    // Map to the displayed code in case it differs from the headless result
    const { lineMap } = diffLines(withBlock, code);
    return changed.map((line) => lineMap.get(line)).filter(Boolean);
  } catch (e) {
    console.warn("Could not determine the code of the selected block", e);
    return [];
  } finally {
    copy.dispose();
    Blockly.Events.enable();
  }
};
