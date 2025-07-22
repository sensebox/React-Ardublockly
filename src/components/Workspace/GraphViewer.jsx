import * as Blockly from "blockly/core";
import { javascriptGenerator } from "blockly/javascript";
import { use, useEffect, useState } from "react";
import { useSelector } from "react-redux";

const GraphViewer = () => {
  // get all modules in simulator
  // create a graph for each module
  // get all values from all modules and create a graph for each value
  //   const modules = Blockly.Generator.Simulator.modules_;
  const modules = useSelector((state) => state.simulator.modules);
  const ignoredModules = [
    "sensebox_fluoroASM_init",
    "sensebox_fluoroASM_setLED2",
    "senseBox_display",
  ];
  useEffect(() => {
    console.log("module", modules);
  }, [modules]);

  return (
    <div>
      <h2>Graph Viewer</h2>
      {modules.map((module, index) => {
        if (ignoredModules.includes(module)) return;
        return <div key={index}>{module}</div>;
      })}
    </div>
  );
};

export default GraphViewer;
