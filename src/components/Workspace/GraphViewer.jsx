import * as Blockly from "blockly/core";
import { javascriptGenerator } from "blockly/javascript";
import { use, useEffect, useState } from "react";
import { useSelector } from "react-redux";

const GraphViewer = () => {
  const modules = useSelector((state) => state.simulator.modules);
  const moduleValues = useSelector((state) => state.simulator.moduleValues);

  const ignoredModules = [
    "sensebox_fluoroASM_init",
    "sensebox_fluoroASM_setLED2",
    "senseBox_display",
    "senseBox_hdc1080",
  ];

  useEffect(() => {
    console.log("new values", moduleValues);
  }, [moduleValues]);

  return (
    <div>
      {Object.keys(moduleValues).map((value, index) => {
        if (ignoredModules.includes(value)) {
          return null;
        }
        return (
          <div key={index}>
            {value}: {moduleValues[value]}
          </div>
        );
      })}
    </div>
  );
};

export default GraphViewer;
