import { Block, Value, Field, Statement, Shadow, Category, Label } from "../..";
import { getColour } from "../../helpers/colour";
import * as Blockly from "blockly/core";
import "@blockly/toolbox-search";
import "../search-category.css";
import { useLevelStore } from "../../../../store/useLevelStore";
import { ToolBoxEspLevel1 } from "./ToolBoxEspLevel1";
import { ToolBoxEspLevel2 } from "./ToolBoxEspLevel2";
import { ToolBoxEspLevel3 } from "./ToolBoxEspLevel3";

export const ToolboxEsp = () => {
  const level = useLevelStore((state) => state.level);
  return (
    <>
      <Category name="Search" kind="search">
        {" "}
      </Category>
      {level > 0 && <ToolBoxEspLevel1 />}
      {level > 1 && <ToolBoxEspLevel2 />}
      {level > 2 && <ToolBoxEspLevel3 />}
    </>
  );
};
