import * as Blockly from "blockly/core";

let registered = false;

export function registerBlocklyContextMenu() {
  const registry = Blockly?.ContextMenuRegistry?.registry;

  if (!registry) {
    console.warn("Blockly ContextMenuRegistry not available");
    return;
  }

  if (registered) return;

  registered = true;

  // ✅ sicher prüfen, ob der Eintrag existiert
  const existing = registry.getItem("blockHelp");

  if (existing) {
    registry.unregister("blockHelp");
  }
}
