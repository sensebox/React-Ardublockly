import React from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrochip, faCaretDown } from "@fortawesome/free-solid-svg-icons";

/**
 * BoardSelector component for selecting MCU board type.
 * Props:
 * - selectedBoard: string ("mcu", "mini", or "esp32")
 * - setBoard: function to set the selected board
 */
class BoardSelector extends React.Component {
  constructor(props) {
    super(props);
    this.mcuRef = React.createRef();
    this.state = {
      anchorElBoard: null,
    };
  }

  handleOpenMenu = () => {
    this.setState({ anchorElBoard: this.mcuRef.current });
  };

  handleCloseMenu = () => {
    this.setState({ anchorElBoard: null });
  };

  handleSelectBoard = (event) => {
    this.props.setBoard(event.currentTarget.getAttribute("value"));
    this.handleCloseMenu();
  };

  render() {
    const { selectedBoard } = this.props;
    return (
      <div style={{ padding: "12px" }}>
        <Button
          style={{
            textTransform: "none",
            cursor: "pointer",
            alignItems: "center",
            alignContent: "center",
            background: "transparent",
            color: "inherit",
            fontWeight: "bold",
            border: "2px solid white",
            borderRadius: "25px",
          }}
          ref={this.mcuRef}
          onClick={this.handleOpenMenu}
          startIcon={<FontAwesomeIcon icon={faMicrochip} />}
          endIcon={<FontAwesomeIcon icon={faCaretDown} />}
        >
          {selectedBoard === "mcu"
            ? "MCU"
            : selectedBoard === "mini"
              ? "MCU:mini"
              : "MCU-S2"}
        </Button>
        <Menu
          anchorEl={this.state.anchorElBoard}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={Boolean(this.state.anchorElBoard)}
          onClose={this.handleCloseMenu}
        >
          <MenuItem value="mcu" onClick={this.handleSelectBoard}>
            MCU
          </MenuItem>
          <MenuItem value="mini" onClick={this.handleSelectBoard}>
            MCU:mini
          </MenuItem>
          <MenuItem value="esp32" onClick={this.handleSelectBoard}>
            MCU-S2
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

export default BoardSelector;
