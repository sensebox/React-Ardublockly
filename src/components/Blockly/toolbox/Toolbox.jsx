import React, { useEffect, useRef } from "react";
import "@blockly/block-plus-minus";
import { TypedVariableModal } from "@blockly/plugin-typed-variable-modal";
import * as Blockly from "blockly/core";
import { useSelector } from "react-redux";
import { ToolboxMcu } from "./ToolboxMcu";
import { ToolboxEsp } from "./ToolboxEsp";
import "./toolbox_styles.css";

const Toolbox = ({ workspace, toolbox }) => {
  const selectedBoard = useSelector((state) => state.board.board);
  const language = useSelector((state) => state.general.language);
  const previousBoard = useRef(null);

  // Register typed variable flyout on board change or mount
  useEffect(() => {
    if (!workspace || !toolbox?.current) return;

    // Register callback
    workspace.registerToolboxCategoryCallback(
      "CREATE_TYPED_VARIABLE",
      createFlyout,
    );

    // Init modal
    const typedVarModal = new TypedVariableModal(workspace, "callbackName", [
      [Blockly.Msg.variable_NUMBER, "int"],
      [Blockly.Msg.variable_LONG, "long"],
      [Blockly.Msg.variable_DECIMAL, "float"],
      [Blockly.Msg.variables_TEXT, "String"],
      [Blockly.Msg.variables_CHARACTER, "char"],
      [Blockly.Msg.variables_BOOLEAN, "boolean"],
      [Blockly.Msg.variable_BITMAP, "bitmap"],
    ]);
    typedVarModal.init();

    // Log board change
    if (previousBoard.current !== selectedBoard) {
      previousBoard.current = selectedBoard;
    }

    workspace.updateToolbox(toolbox.current);

    // Simple and direct approach - override the toolbox's click behavior
    const setupToolboxCollapse = () => {
      // Wait for toolbox to be rendered
      setTimeout(() => {
        const toolboxInstance = workspace.getToolbox();
        if (!toolboxInstance) return;

        console.log('Setting up toolbox collapse functionality');

        // Get all category elements
        const categoryElements = document.querySelectorAll('.blocklyToolboxCategory');
        console.log('Found category elements:', categoryElements.length);

        categoryElements.forEach((element, index) => {
          // Remove existing event listeners by cloning the element
          const newElement = element.cloneNode(true);
          element.parentNode.replaceChild(newElement, element);

          // Add new click handler
          newElement.addEventListener('click', (e) => {
            console.log('Category clicked:', newElement.textContent.trim());
            
            // Allow the default Blockly behavior to happen first
            setTimeout(() => {
              const toolboxInstance = workspace.getToolbox();
              if (!toolboxInstance) {
                console.log('No toolbox instance found');
                return;
              }

              // Try different methods to get selected item
              let selectedItem = null;
              if (toolboxInstance.getSelectedItem) {
                selectedItem = toolboxInstance.getSelectedItem();
              } else if (toolboxInstance.getSelectedItemId) {
                const selectedId = toolboxInstance.getSelectedItemId();
                // Try to find the item by ID
                if (toolboxInstance.getToolboxItems) {
                  const items = toolboxInstance.getToolboxItems();
                  selectedItem = items.find(item => item.id === selectedId);
                }
              }

              if (!selectedItem) {
                // Try to get all items and find the one that's expanded
                if (toolboxInstance.getToolboxItems) {
                  const items = toolboxInstance.getToolboxItems();
                  selectedItem = items.find(item => item.isExpanded && item.isExpanded());
                }
                return;
              }

              // Get all categories using the correct API
              let allCategories = [];
              if (toolboxInstance.getToolboxItems) {
                allCategories = toolboxInstance.getToolboxItems();
              } else {
                return;
              }

              // Build hierarchy of selected item
              const selectedHierarchy = [];
              let current = selectedItem;
              while (current) {
                selectedHierarchy.push(current);
                current = current.getParent && current.getParent();
              }

              // Collapse all categories not in the hierarchy
              allCategories.forEach((category) => {
                if (!category) return;
                
                if (!selectedHierarchy.includes(category)) {
                  // Try different methods to collapse
                  if (category.setExpanded && typeof category.setExpanded === 'function') {
                    category.setExpanded(false);
                  } else if (category.setOpen && typeof category.setOpen === 'function') {
                    category.setOpen(false);
                  }
                  // Note: Some categories might not have collapse methods (like search)
                }
              });
            }, 100);
          });

          // Also handle touch events for mobile
          newElement.addEventListener('touchend', (e) => {
            console.log('Category touched:', newElement.textContent.trim());
            // Trigger the same logic as click
            newElement.click();
          });
        });
      }, 500);
    };

    // Set up the collapse functionality
    setupToolboxCollapse();

    // Also set up when toolbox updates
    const originalUpdateToolbox = workspace.updateToolbox;
    workspace.updateToolbox = function(toolboxDef) {
      const result = originalUpdateToolbox.call(this, toolboxDef);
      // Re-setup after toolbox update
      setTimeout(setupToolboxCollapse, 300);
      return result;
    };

    // Store original method for cleanup
    const originalMethod = originalUpdateToolbox;

    return () => {
      // Restore original updateToolbox method
      workspace.updateToolbox = originalMethod;
    };
  }, [workspace, toolbox, selectedBoard, language]);

  return (
    <xml
      xmlns="https://developers.google.com/blockly/xml"
      id="blockly"
      style={{ display: "none" }}
      ref={toolbox}
    >
      {selectedBoard === "MCU" || selectedBoard === "MCU:mini" ? (
        <ToolboxMcu />
      ) : (
        <ToolboxEsp />
      )}
    </xml>
  );
};

// --- Static helper for flyout ---
const createFlyout = (workspace) => {
  let xmlList = [];

  const button = document.createElement("button");
  button.setAttribute("text", Blockly.Msg.button_createVariable);
  button.setAttribute("callbackKey", "callbackName");

  xmlList.push(button);

  const blockList = Blockly.VariablesDynamic.flyoutCategoryBlocks(workspace);
  return xmlList.concat(blockList);
};

export default Toolbox;
