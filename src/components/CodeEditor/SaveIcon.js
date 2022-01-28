import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch, faSave } from "@fortawesome/free-solid-svg-icons";
import Tooltip from "@material-ui/core/Tooltip";
import React from "react";

const SaveIcon = ({ loading }) => (
  <Tooltip title={"Auto save enabled"} arrow placement="right">
    <div
      style={{
        position: "relative",
        width: "2rem",
        height: "2rem",
        margin: "1rem",
      }}
    >
      {loading && (
        <FontAwesomeIcon
          style={{ position: "absolute" }}
          icon={faCircleNotch}
          spin={true}
          size="2x"
          color="grey"
        />
      )}
      <FontAwesomeIcon
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%,-50%)",
        }}
        icon={faSave}
        color={loading ? "grey" : "green"}
        size={loading ? "1x" : "lg"}
      />
    </div>
  </Tooltip>
);

export default SaveIcon;
