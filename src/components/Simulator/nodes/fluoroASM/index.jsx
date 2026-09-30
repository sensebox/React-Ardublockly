import React, { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Blockly from "blockly/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { addLog } from "@/actions/logActions";
import { setFilterOffset } from "@/actions/fluoroActions";
import SvgFluoroBee from "./svg";
import { FILTER_POSITIONS } from "./filter";

/**
 * QOOOL fluoro bee on the board. Filter, diamond and filter colour are set
 * on the init block; the arrows move the filter from LED to LED.
 */
const FluoroASM = () => {
  const dispatch = useDispatch();
  const { filterEnabled, diamondEnabled, filterOffset, filterColour } =
    useSelector((state) => state.fluoroASM);

  const position = FILTER_POSITIONS.indexOf(filterOffset);

  const moveFilter = (step, description) => (e) => {
    e.stopPropagation();
    // Safari fix to release mouse
    document.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));

    const next = Math.min(
      FILTER_POSITIONS.length - 1,
      Math.max(0, position + step),
    );
    dispatch(setFilterOffset(FILTER_POSITIONS[next]));
    dispatch(addLog({ type: "simulator", title: "FluoroASM", description }));
  };

  return (
    <div style={{ minWidth: "150px", position: "relative" }}>
      <SvgFluoroBee
        filterEnabled={filterEnabled}
        filterOffset={filterOffset}
        diamondEnabled={diamondEnabled}
        filterColour={filterColour}
      />

      {filterEnabled && (
        <div
          style={{
            position: "absolute",
            top: "50px",
            left: "95px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <button
            disabled={position <= 0}
            onClick={moveFilter(-1, Blockly.Msg.simulator_log_filter_up)}
          >
            <FontAwesomeIcon icon={faArrowUp} />
          </button>
          <button
            disabled={position >= FILTER_POSITIONS.length - 1}
            onClick={moveFilter(1, Blockly.Msg.simulator_log_filter_down)}
          >
            <FontAwesomeIcon icon={faArrowDown} />
          </button>
        </div>
      )}
    </div>
  );
};

export default memo(FluoroASM);
