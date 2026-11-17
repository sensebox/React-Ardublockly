import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch, faSave } from "@fortawesome/free-solid-svg-icons";
import Tooltip from "@mui/material/Tooltip";
import React from "react";

const SaveIcon = ({ loading }) => (
  <Tooltip title={"Auto save enabled"} arrow placement="right">
    <div
      style={{
        display: "grid",
        placeItems: "center",
        width: "2rem",
        height: "2rem",
        margin: "1rem",
      }}
    >
      {loading && (
        <FontAwesomeIcon
          style={{ gridArea: "1 / 1", width: "2rem", height: "2rem" }}
          icon={faCircleNotch}
          spin={true}
          size="2x"
          color="grey"
        />
      )}
      <FontAwesomeIcon
        style={{
          gridArea: "1 / 1",
        }}
        icon={faSave}
        color={loading ? "grey" : "green"}
        size={loading ? "1x" : "lg"}
      />
    </div>
  </Tooltip>
);

export default SaveIcon;
