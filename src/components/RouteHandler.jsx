import React, { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setEmbeddedMode } from "../actions/generalActions";
import { IPAD_CONFIG } from "../config/ipadConfig";

const RouteHandler = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const previousPathnameRef = useRef(location.pathname);
  
  useEffect(() => {
    const currentPathname = location.pathname;
    const previousPathname = previousPathnameRef.current;
    
    const isCurrentEmbedded = currentPathname === IPAD_CONFIG.ROUTE;
    const wasPreviousEmbedded = previousPathname === IPAD_CONFIG.ROUTE;
    
    // Always dispatch on first load (when previousPathname equals currentPathname)
    // or when transitioning between embedded and non-embedded modes
    if (previousPathname === currentPathname || isCurrentEmbedded !== wasPreviousEmbedded) {
      dispatch(setEmbeddedMode(isCurrentEmbedded));
    }
    
    previousPathnameRef.current = currentPathname;
  }, [location.pathname, dispatch]);
  
  return null;
};

export default RouteHandler;