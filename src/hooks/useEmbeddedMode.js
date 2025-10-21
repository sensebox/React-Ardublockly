import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setRenderer } from '../actions/generalActions';
import { EMBEDDED_CONFIG } from '../config/embeddedConfig';

export const useEmbeddedMode = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Force Zelos renderer for embedded touch optimization
    dispatch(setRenderer(EMBEDDED_CONFIG.RENDERER));

    // Update viewport meta tag for embedded mode
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
};
