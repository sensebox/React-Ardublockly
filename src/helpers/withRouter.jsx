// src/components/Route/withRouterV6.jsx
import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export function withRouterV6(WrappedComponent) {
  return function RouterWrapper(props) {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();

    return (
      <WrappedComponent
        {...props}
        location={location}
        navigate={navigate}
        match={{ params }} // v5-Kompatibilität
      />
    );
  };
}
