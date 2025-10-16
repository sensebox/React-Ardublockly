import React from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setEmbeddedMode } from "../actions/generalActions";

const RouteHandler = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const previousPathnameRef = React.useRef(location.pathname);
  
  React.useEffect(() => {
    const currentPathname = location.pathname;
    const previousPathname = previousPathnameRef.current;
    
    // Always dispatch on first load (when previousPathname equals currentPathname)
    // or when transitioning between embedded and non-embedded routes
    const isCurrentEmbedded = currentPathname === '/embedded';
    const wasPreviousEmbedded = previousPathname === '/embedded';
    
    if (previousPathname === currentPathname || isCurrentEmbedded !== wasPreviousEmbedded) {
      dispatch(setEmbeddedMode(isCurrentEmbedded));
    }
    
    previousPathnameRef.current = currentPathname;
  }, [location.pathname, dispatch]);
  
  return null;
};

export default RouteHandler;