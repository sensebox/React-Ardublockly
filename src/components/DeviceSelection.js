import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Dialog from "./Dialog";

import { withStyles } from "@material-ui/core/styles";
import * as Blockly from "blockly";
import { IconButton, Grid, Avatar, Typography } from "@material-ui/core";
import { setBoard } from "../actions/boardAction";
import mini_opacity from "../data/mini_opacity.png"
import mcu_opacity from "../data/mcu_opacity.png"

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
      open: this.props.selectedBoard !== "" ? false : true,
      selectedBoard : this.props.selectedBoard,
      saveSettings: false,

    };
  }

  toggleDialog = () => {
    
    this.props.setBoard(this.state.selectedBoard)

  };


  onclick = (e, value) => {
    console.log(e, value)
    const root = document.querySelector(':root');
    root.style.setProperty('--url', `url(${value === "mcu" ? mcu_opacity : mini_opacity })`);
    this.setState({selectedBoard: value})
    this.props.setBoard(value)
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
        <Typography variant="body1" >
          {Blockly.Msg.deviceselection_footnote} <a href="https://sensebox.github.io/blockly/">Arduino UNO</a> {Blockly.Msg.deviceselection_footnote_02} <a href="https://sensebox-blockly.netlify.app/ardublockly/?board=sensebox-mcu">senseBox MCU</a>
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
