import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setRenderer } from '../actions/generalActions';
import { IPAD_CONFIG } from '../config/ipadConfig';

export const useIpadEmbeddedMode = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Force Zelos renderer for iPad touch optimization
    dispatch(setRenderer(IPAD_CONFIG.RENDERER));

    // Update viewport meta tag for iPad
    const viewport = document.querySelector('meta[name="viewport"]');
    const originalContent = viewport?.getAttribute("content");
    
    if (viewport) {
      viewport.setAttribute("content", IPAD_CONFIG.VIEWPORT.content);
    }

    return () => {
      // Restore original viewport
      if (viewport && originalContent) {
        viewport.setAttribute("content", originalContent);
      }
    };
  }, [dispatch]);
};
