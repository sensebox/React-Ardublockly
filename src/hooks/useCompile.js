import { useState, useEffect, useCallback } from "react";

export const useCompile = (props) => {
  const [state, setState] = useState({
    progress: false,
    open: false,
    name: props.name || "unnamed",
    error: "",
    id: null,
  });

  useEffect(() => {
    if (props.name) {
      setState((prev) => ({ ...prev, name: props.name }));
    }
  }, [props.name]);

  const toggleDialog = useCallback(() => {
    setState((prev) => ({
      ...prev,
      open: !prev.open,
      progress: false,
    }));
  }, []);

  const setFileName = useCallback((e) => {
    const newName = e.target.value || "unnamed";
    setState((prev) => ({ ...prev, name: newName }));
  }, []);

  const compile = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      progress: true,
      open: true,
      error: "",
    }));

    const data = {
      board:
        props.selectedBoard === "mcu" || props.selectedBoard === "mini"
          ? "sensebox-mcu"
          : "sensebox-esp32s2",
      sketch: props.arduino,
    };

    try {
      const response = await fetch(`${props.compiler}/compile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();

      if (responseData.code === "Internal Server Error") {
        setState((prev) => ({
          ...prev,
          progress: false,
          open: true,
          error: responseData.message,
        }));
        return;
      }

      setState((prev) => ({
        ...prev,
        id: responseData.data.id,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        progress: false,
        open: true,
        error: err.message,
      }));
    }
  }, [props.selectedBoard, props.arduino, props.compiler]);

  return {
    state,
    compile,
    toggleDialog,
    setFileName,
  };
};
