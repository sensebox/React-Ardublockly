import * as Blockly from "blockly/core";

// Collapsing is disabled (workspace option `collapse: false`). Blocks that were
// saved collapsed in older projects would otherwise stay closed forever, so
// expand them as soon as they are created.
export function expandCollapsedBlocks(ws) {
  const listener = (event) => {
    if (event.type !== Blockly.Events.BLOCK_CREATE) return;
    event.ids?.forEach((id) => {
      const block = ws.getBlockById(id);
      if (block?.isCollapsed()) block.setCollapsed(false);
    });
  };
  ws.addChangeListener(listener);
  return listener;
}
