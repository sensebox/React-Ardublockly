import React, { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setEmbeddedMode } from "../actions/generalActions";
import { isEmbeddedPath } from "../helpers/shareUrlBuilder";

const RouteHandler = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const previousPathnameRef = useRef(location.pathname);
  
  useEffect(() => {
    const currentPathname = location.pathname;
    const isCurrentEmbedded = isEmbeddedPath(currentPathname);
    
    dispatch(setEmbeddedMode(isCurrentEmbedded));
    
    previousPathnameRef.current = currentPathname;
  }, [location.pathname, dispatch]);
  
  return null;
};

export default RouteHandler;