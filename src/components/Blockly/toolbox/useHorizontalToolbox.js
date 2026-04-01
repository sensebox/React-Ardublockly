import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export const useHorizontalToolbox = () => {
  const isEmbedded = useSelector((state) => state.general.embeddedMode);
  const [isHorizontalToolbox, setIsHorizontalToolbox] = useState(() => window.innerHeight > window.innerWidth);

  // Track orientation changes
  useEffect(() => {
    if (!isEmbedded) {
      setIsHorizontalToolbox(false);
      return;
    }

    const updateOrientation = () => {
      setIsHorizontalToolbox(window.innerHeight > window.innerWidth);
    };

    // Update immediately
    updateOrientation();

    window.addEventListener('resize', updateOrientation);
    window.addEventListener('orientationchange', updateOrientation);

    return () => {
      window.removeEventListener('resize', updateOrientation);
      window.removeEventListener('orientationchange', updateOrientation);
    };
  }, [isEmbedded]);

  return { isHorizontalToolbox: isEmbedded && isHorizontalToolbox };
};
