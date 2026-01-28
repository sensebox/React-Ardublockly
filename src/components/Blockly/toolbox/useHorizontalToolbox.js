import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import * as Blockly from "blockly/core";

export const useHorizontalToolbox = (workspace) => {
  const isEmbedded = useSelector((state) => state.general.embeddedMode);
  const originalUpdateToolboxRef = useRef(null);
  const [isHorizontalToolbox, setIsHorizontalToolbox] = useState(() => window.innerHeight > window.innerWidth);

  // Track orientation changes
  useEffect(() => {
    if (!isEmbedded) return;

    const updateOrientation = () => {
      setIsHorizontalToolbox(window.innerHeight > window.innerWidth);
    };

    window.addEventListener('resize', updateOrientation);
    window.addEventListener('orientationchange', updateOrientation);

    return () => {
      window.removeEventListener('resize', updateOrientation);
      window.removeEventListener('orientationchange', updateOrientation);
    };
  }, [isEmbedded]);

  useEffect(() => {
    // Only apply custom toolbox behavior in embedded mode AND portrait orientation (horizontal toolbox)
    const shouldApplyCustomBehavior = isEmbedded && isHorizontalToolbox;
    
    if (!shouldApplyCustomBehavior || !workspace) {
      return;
    }

    originalUpdateToolboxRef.current = workspace.updateToolbox;

    const collapseAllCategories = () => {
      const toolbox = workspace.getToolbox();
      const items = toolbox?.getToolboxItems?.();
      if (!items) return;

      items.forEach((category) => {
        if (category?.setExpanded) {
          category.setExpanded(false);
        } else if (category?.setOpen) {
          category.setOpen(false);
        }
      });
    };

    const setAccentColors = () => {
      document.querySelectorAll('.blocklyToolboxCategory').forEach((row) => {
        const borderColor = window.getComputedStyle(row).getPropertyValue('border-left-color');
        if (borderColor) {
          row.style.setProperty('--cat-accent', borderColor.trim());
        }
      });
    };

    const isInputElement = (target) => {
      return target?.tagName === 'INPUT' || target?.closest?.('input');
    };

    const setupToolboxCollapse = () => {
      setTimeout(() => {
        const toolbox = workspace.getToolbox();
        if (!toolbox) return;

        document.querySelectorAll('.blocklyToolboxCategory').forEach((element) => {
          const hasInput = !!element.querySelector('input');
          const targetElement = hasInput ? element : element.cloneNode(true);
          
          if (!hasInput) {
            element.parentNode.replaceChild(targetElement, element);
          }

          const handleCategoryClick = (e) => {
            if (isInputElement(e.target)) return;

            setTimeout(() => {
              const toolbox = workspace.getToolbox();
              if (!toolbox) return;

              const items = toolbox.getToolboxItems?.();
              if (!items) return;

              let selectedItem = toolbox.getSelectedItem?.() || 
                                items.find(item => item.id === toolbox.getSelectedItemId?.()) ||
                                items.find(item => item.isExpanded?.());

              if (!selectedItem) return;

              const selectedHierarchy = [];
              let current = selectedItem;
              while (current) {
                selectedHierarchy.push(current);
                current = current.getParent?.();
              }

              items.forEach((category) => {
                if (category && !selectedHierarchy.includes(category)) {
                  category.setExpanded?.(false) || category.setOpen?.(false);
                }
              });
            }, 100);
          };

          targetElement.addEventListener('click', handleCategoryClick);
          targetElement.addEventListener('touchend', (e) => {
            if (!isInputElement(e.target)) {
              targetElement.click();
            }
          });
        });

        setAccentColors();
      }, 500);
    };

    const setupWorkspaceClickCollapse = () => {
      const svg = workspace.getParentSvg();
      if (!svg) return () => {};

      const toolboxElement = document.querySelector('.blocklyToolbox');
      if (!toolboxElement) return () => {};

      const handleWorkspaceClick = (e) => {
        if (!toolboxElement.contains(e.target)) {
          collapseAllCategories();
        }
      };

      svg.addEventListener('click', handleWorkspaceClick, true);
      return () => svg.removeEventListener('click', handleWorkspaceClick, true);
    };

    setupToolboxCollapse();
    const cleanupWorkspaceClick = setupWorkspaceClickCollapse();

    workspace.updateToolbox = function(toolboxDef) {
      const result = originalUpdateToolboxRef.current.call(this, toolboxDef);
      setTimeout(setupToolboxCollapse, 300);
      setTimeout(setAccentColors, 350);
      return result;
    };

    return () => {
      if (workspace?.updateToolbox && originalUpdateToolboxRef.current) {
        workspace.updateToolbox = originalUpdateToolboxRef.current;
      }
      cleanupWorkspaceClick?.();
    };
  }, [workspace, isEmbedded, isHorizontalToolbox]);

  return { isHorizontalToolbox: isEmbedded && isHorizontalToolbox };
};
