import { useEffect, useRef } from "react";
import * as Blockly from "blockly/core";

export const useEmbeddedToolbox = (workspace, isEmbedded) => {
  const originalUpdateToolboxRef = useRef(null);

  useEffect(() => {
    if (!isEmbedded || !workspace) {
      return;
    }

    originalUpdateToolboxRef.current = workspace.updateToolbox;

    const setupToolboxCollapse = () => {
      setTimeout(() => {
        const toolboxInstance = workspace.getToolbox();
        if (!toolboxInstance) return;

        const categoryElements = document.querySelectorAll('.blocklyToolboxCategory');

        categoryElements.forEach((element) => {
          const containsInput = !!element.querySelector('input');
          const targetElement = containsInput ? element : element.cloneNode(true);
          if (!containsInput) {
            element.parentNode.replaceChild(targetElement, element);
          }

          targetElement.addEventListener('click', (e) => {
            // Ignore clicks originating from input elements (e.g., search field)
            if (e && e.target && (e.target.tagName === 'INPUT' || (e.target.closest && e.target.closest('input')))) {
              return;
            }
            setTimeout(() => {
              const toolboxInstance = workspace.getToolbox();
              if (!toolboxInstance) {
                return;
              }

              let selectedItem = null;
              if (toolboxInstance.getSelectedItem) {
                selectedItem = toolboxInstance.getSelectedItem();
              } else if (toolboxInstance.getSelectedItemId) {
                const selectedId = toolboxInstance.getSelectedItemId();
                if (toolboxInstance.getToolboxItems) {
                  const items = toolboxInstance.getToolboxItems();
                  selectedItem = items.find(item => item.id === selectedId);
                }
              }

              if (!selectedItem) {
                if (toolboxInstance.getToolboxItems) {
                  const items = toolboxInstance.getToolboxItems();
                  selectedItem = items.find(item => item.isExpanded && item.isExpanded());
                }
                return;
              }

              let allCategories = [];
              if (toolboxInstance.getToolboxItems) {
                allCategories = toolboxInstance.getToolboxItems();
              } else {
                return;
              }

              const selectedHierarchy = [];
              let current = selectedItem;
              while (current) {
                selectedHierarchy.push(current);
                current = current.getParent && current.getParent();
              }
              allCategories.forEach((category) => {
                if (!category) return;
                
                if (!selectedHierarchy.includes(category)) {
                  if (category.setExpanded && typeof category.setExpanded === 'function') {
                    category.setExpanded(false);
                  } else if (category.setOpen && typeof category.setOpen === 'function') {
                    category.setOpen(false);
                  }
                }
              });
            }, 100);
          });

          targetElement.addEventListener('touchend', (e) => {
            // Ignore touches originating from input elements (e.g., search field)
            if (e && e.target && (e.target.tagName === 'INPUT' || (e.target.closest && e.target.closest('input')))) {
              return;
            }
            targetElement.click();
          });
        });

        // Set accent color CSS variable from the category left border
        const rows = document.querySelectorAll('.blocklyToolboxCategory');
        rows.forEach((row) => {
          const styles = window.getComputedStyle(row);
          const borderLeftColor = styles.getPropertyValue('border-left-color');
          if (borderLeftColor) {
            row.style.setProperty('--cat-accent', borderLeftColor.trim());
          }
        });
      }, 500);
    };

    setupToolboxCollapse();

    workspace.updateToolbox = function(toolboxDef) {
      const result = originalUpdateToolboxRef.current.call(this, toolboxDef);
      setTimeout(setupToolboxCollapse, 300);
      // Re-apply accent colors after updates
      setTimeout(() => {
        const rows = document.querySelectorAll('.blocklyToolboxCategory');
        rows.forEach((row) => {
          const styles = window.getComputedStyle(row);
          const borderLeftColor = styles.getPropertyValue('border-left-color');
          if (borderLeftColor) {
            row.style.setProperty('--cat-accent', borderLeftColor.trim());
          }
        });
      }, 350);
      return result;
    };
    return () => {
      if (workspace && originalUpdateToolboxRef.current) {
        workspace.updateToolbox = originalUpdateToolboxRef.current;
      }
    };
  }, [workspace, isEmbedded]);
};
