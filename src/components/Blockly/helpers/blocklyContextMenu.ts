import * as Blockly from "blockly/core";
import { generateBrowserUrl } from "@/helpers/shareUrlBuilder";

let registered = false;

export function registerBlocklyContextMenu() {
  const registry = Blockly?.ContextMenuRegistry?.registry;

  if (!registry) {
    console.warn("Blockly ContextMenuRegistry not available");
    return;
  }

  if (registered) return;

  registered = true;

  // Unregister existing help menu item
  const existing = registry.getItem("blockHelp");
  if (existing) {
    registry.unregister("blockHelp");
  }

  registry.register({
    displayText: () => {
      return Blockly.Msg.CONTEXTMENU_HELP || "Help";
    },
    preconditionFn: (scope) => {
      const block = scope.block;
      if (!block || !block.helpUrl) {
        return "disabled";
      }
      return "enabled";
    },
    callback: (scope) => {
      const block = scope.block;
      if (block && block.helpUrl) {
        // Get the help URL (handle both string and function)
        const helpUrl = typeof block.helpUrl === 'function' 
          ? block.helpUrl() 
          : block.helpUrl;
        
        if (helpUrl) {
          // Use browser:// scheme for Flutter app to open in system browser
          const browserUrl = generateBrowserUrl(helpUrl);
          window.location.href = browserUrl;
        }
      }
    },
    scopeType: Blockly.ContextMenuRegistry.ScopeType.BLOCK,
    id: "blockHelp",
    weight: 1,
  });
}
