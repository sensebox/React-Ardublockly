import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Dialog from "./Dialog";

import withStyles from "@mui/styles/withStyles";
import * as Blockly from "blockly";
import { IconButton, Grid, Avatar, Typography } from "@mui/material";
import { setBoard } from "../actions/boardAction";

const styles = (theme) => ({
  link: {
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      color: theme.palette.primary.main,
      textDecoration: `underline`,
    },
  },
  label: {
    fontSize: "0.9rem",
    color: "grey",
  },
});

class DeviceSeclection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: props.selectedBoard ? false : true,
      selectedBoard: "",
      saveSettings: false,
    };
  }

  toggleDialog = () => {
    this.props.setBoard(this.state.selectedBoard);
  };

  onChange = (e) => {
    if (e.target.checked) {
      this.setState({ saveSettings: true });
    } else {
      this.setState({ saveSettings: false });
    }
  };

  onclick = (e, value) => {
    this.setState({ selectedBoard: value });
    this.props.setBoard(value);
    this.setState({ open: !this.state });
  };

  render() {
    return (
      <Dialog
        style={{ zIndex: 9999999 }}
        fullWidth
        maxWidth={"xl"}
        open={this.state.open}
        title={Blockly.Msg.deviceselection_head}
        content={""}
        onClick={this.toggleDialog}
        disabled={this.state.selectedBoard === ""}
      >
        <div>
          <Grid container spacing={2} style={{ textAlign: "center" }}>
            <Grid item xs={4}>
              <IconButton onClick={(e) => this.onclick(e, "mcu")} size="large">
                <Avatar
                  alt="Sensebox MCU"
                  src="/media/hardware/blockly_mcu.png"
                  style={{
                    border:
                      this.state.selectedBoard === "mcu"
                        ? "medium solid DeepSkyBlue"
                        : "0.1px solid lightgray",
                    width: "10vw",
                    height: "10vw",
                  }}
                />
              </IconButton>
              <p>senseBox MCU</p>
            </Grid>
            <Grid item xs={4}>
              <IconButton
                onClick={(e) => this.onclick(e, "esp32")}
                size="large"
              >
                <Avatar
                  alt="Sensebox ESP"
                  src="/media/hardware/blockly_esp.png"
                  style={{
                    border:
                      this.state.selectedBoard === "esp32"
                        ? "medium solid DeepSkyBlue"
                        : "0.1px solid lightgray",
                    width: "10vw",
                    height: "10vw",
                  }}
                />
              </IconButton>
              <p>senseBox MCU-S2</p>
            </Grid>
            <Grid item xs={4}>
              <IconButton onClick={(e) => this.onclick(e, "mini")} size="large">
                <Avatar
                  alt="Sensebox Mini"
                  src="/media/hardware/blockly_mini.png"
                  style={{
                    border:
                      this.state.selectedBoard === "mini"
                        ? "medium solid DeepSkyBlue"
                        : "0.1px solid lightgray",
                    width: "10vw",
                    height: "10vw",
                  }}
                />
              </IconButton>
              <p>senseBox MCU:mini</p>
            </Grid>
          </Grid>
        </div>
        <Typography variant="body1">
          {Blockly.Msg.deviceselection_footnote}{" "}
          <a href="https://sensebox.github.io/blockly/">Arduino UNO</a>{" "}
          {Blockly.Msg.deviceselection_footnote_02}{" "}
          <a href="https://sensebox-blockly.netlify.app/ardublockly/?board=sensebox-mcu">
            senseBox MCU
          </a>
        </Typography>
      </Dialog>
    );
  }
}

DeviceSeclection.propTypes = {
  pageVisits: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  pageVisits: state.general.pageVisits,
  selectedBoard: state.board.board,
});

export default connect(mapStateToProps, { setBoard })(
  withStyles(styles, { withTheme: true })(DeviceSeclection),
);
