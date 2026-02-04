import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRenderer, setEmbeddedMode } from "../actions/generalActions";
import { EMBEDDED_CONFIG } from "../config/embeddedConfig";

export const useEmbeddedMode = () => {
  const dispatch = useDispatch();
  const isEmbedded = useSelector((state) => state.general.embeddedMode);

  useEffect(() => {
    dispatch(setRenderer(EMBEDDED_CONFIG.RENDERER));
    const viewport = document.querySelector('meta[name="viewport"]');
    const originalContent = viewport?.getAttribute("content");

    if (viewport) {
      viewport.setAttribute("content", EMBEDDED_CONFIG.VIEWPORT.content);
    }

    return () => {
      // Restore original viewport
      if (viewport && originalContent) {
        viewport.setAttribute("content", originalContent);
      }
    };
  }, [dispatch]);

  return {
    isEmbedded,
    setEmbeddedMode: (value) => dispatch(setEmbeddedMode(value)),
  };
};
