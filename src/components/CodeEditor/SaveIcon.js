import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";
import {
  faCircleNotch,
  faSave,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import Tooltip from "@material-ui/core/Tooltip";
import { IconButton } from "@material-ui/core";
import PropTypes from "prop-types";
import React from "react";

const SaveIcon = ({ loading }) => {
  const value = useSelector((state) => state.general.autoSave);

  return (
    <div>
      {value === true ? (
        <Tooltip title={"Auto save enabled"} arrow placement="right">
          <IconButton
            style={{
              width: "40px",
              height: "40px",
              position: "absolute",
            }}
          >
            {loading && (
              <FontAwesomeIcon
                style={{ position: "absolute" }}
                icon={faCircleNotch}
                spin={true}
                size="2x"
                color="#4EAF47"
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
              color={loading ? "gray" : "#4EAF47"}
              size={loading ? "1x" : "md"}
            />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title={"Auto save disabled"} arrow placement="right">
          <IconButton
            style={{
              width: "40px",
              height: "40px",
              position: "absolute",
            }}
            onClick={() => {
              this.propTypes.setAutoSave(true);
            }}
          >
            {loading && (
              <FontAwesomeIcon
                style={{ position: "absolute" }}
                icon={faCircleNotch}
                spin={true}
                size="2x"
                color="#4EAF47"
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
              color={loading ? "gray" : "#4EAF47"}
              size={loading ? "1x" : "md"}
            />
          </IconButton>
        </Tooltip>
      )}
    </div>
  );
};

SaveIcon.propTypes = {
  setAutoSave: PropTypes.func.isRequired,
  autoSave: PropTypes.bool.isRequired,
};

export default SaveIcon;
