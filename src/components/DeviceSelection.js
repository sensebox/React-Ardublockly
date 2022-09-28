import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Dialog from "./Dialog";

import { withStyles } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import * as Blockly from "blockly";
import { IconButton, Grid, Avatar, Typography } from "@material-ui/core";
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
    var previousPageWasAnotherDomain = props.pageVisits === 0;
    var userWantToKeepBoard = window.localStorage.getItem("board")
      ? true
      : false;
    super(props);
    this.state = {
      open: userWantToKeepBoard
        ? !userWantToKeepBoard
        : previousPageWasAnotherDomain,
      selectedBoard : "",
      saveSettings: false,

    };
  }

  toggleDialog = () => {
    this.setState({ open: !this.state });
    if(this.state.saveSettings){
      window.localStorage.setItem("board", this.state.selectedBoard) 
    }
    this.props.setBoard(this.state.selectedBoard)

  };

  onChange = (e) => {
    if (e.target.checked) {
      this.setState({ saveSettings: true});
    } else {
      this.setState({ saveSettings: false});
    }
  };

  onclick = (e, value) => {
    console.log(e, value)
    this.setState({selectedBoard: value})
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
        button={Blockly.Msg.button_accept}
        disabled={this.state.selectedBoard===""}
      >
        <div>
          <Grid container spacing={2} style={{  textAlign : "center" }}>
            <Grid item xs={6}>
            <IconButton onClick={(e) => this.onclick(e, "mcu")}>
              <Avatar
                alt="Sensebox MCU"
                src="/media/hardware/senseboxmcu.png"
                style={{
                  border: this.state.selectedBoard === "mcu" ? 'medium solid DeepSkyBlue': "0.1px solid lightgray",
                  width:"20vw",
                  height: "20vw"
               }}
              />
              </IconButton>
              <p>senseBox MCU</p>
            </Grid>

            {/* <Grid item xs={4}>
            <IconButton onClick={(e) => this.onclick(e, "esp")}>
              <Avatar
                alt="Sensebox ESP"
                src="/media/hardware/senseboxmcu.png"
                style={{
                  border: this.state.selectedBoard == "esp" ? 'medium solid DeepSkyBlue': "0.1px solid lightgray",
                  width:"20vw",
                  height: "20vw"
               }}
              />
              </IconButton>
              <p>Sensebox ESP</p>
            </Grid> */}
            <Grid item xs={6}>
              <IconButton onClick={(e) => this.onclick(e, "mini")}>
              <Avatar
                alt="Sensebox Mini"
                src="/media/hardware/senseboxmcumini.png"
                 style={{
                  border: this.state.selectedBoard === "mini" ? 'medium solid DeepSkyBlue': "0.1px solid lightgray",
                  width:"20vw",
                  height: "20vw"
               }}
              />
              </IconButton>
              <p>senseBox MCU:mini</p>
            </Grid>
          </Grid>
        </div>
        <FormControlLabel
          style={{ marginTop: "20px" }}
          classes={{ label: this.props.classes.label }}
          control={
            <Checkbox
              size={"small"}
              value={true}
              checked={this.state.checked}
              onChange={(e) => this.onChange(e)}
              name="dialog"
              color="primary"
            />
          }
          label={Blockly.Msg.deviceselection_keep_selection}
        />
        <Typography variant="body1" >
          {Blockly.Msg.deviceselection_footnote} <a href="https://sensebox.github.io/blockly/">Arduino UNO</a> {Blockly.Msg.deviceselection_footnote_02} <a href="/">senseBox MCU</a>
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
  selectedBoard: state.board.board
});

export default connect(
  mapStateToProps,
  {setBoard}
)(withStyles(styles, { withTheme: true })(DeviceSeclection));
