import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setCompiler } from "../../actions/generalActions";

import * as Blockly from "blockly/core";

import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import FormHelperText from "@mui/material/FormHelperText";
import { TextField } from "@mui/material";

class CompilerSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      readOnly: false,
    };
  }

  componentDidMount() {
    // Ensure that Blockly.setLocale is adopted in the component.
    // Otherwise, the text will not be displayed until the next update of the component.
    this.forceUpdate();
    
  }


  changeStatus = () => {
    this.setState({ readOnly: !this.state.readOnly });
  };

  render() {
    return (
      <div>
      <Typography style={{ fontWeight: "bold" }}>
        {Blockly.Msg.settings_compiler}
      </Typography>
      <FormHelperText
        style={{
        color: "black",
        lineHeight: 1.3,
        marginBottom: "8px",
        }}
      >
        {Blockly.Msg.settings_compiler_text}
      </FormHelperText>
      <FormControl variant="standard">
        <FormControlLabel
        control={<Checkbox defaultChecked />}
        checked={this.state.readOnly}
        onChange={this.changeStatus}
        label={Blockly.Msg.settings_compiler_readOnly}
        />
        <TextField
        id="outlined-helperText"
        label="Helper text"
        helperText={Blockly.Msg.settings_compiler_helperText}
        onChange={(e) => this.props.setCompiler(e.target.value)}
        value={this.props.selectedCompiler}
        InputProps={{
          readOnly: !this.state.readOnly,
        }}
        style={{
          backgroundColor: !this.state.readOnly ? "#f0f0f0" : "white",
          color: this.state.readOnly ? "gray" : "black",
          borderRadius: "5px",
        }}
        />
      </FormControl>
      </div>
    );
  }
}

CompilerSelector.propTypes = {
  setCompiler: PropTypes.func.isRequired,
  compiler: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  selectedCompiler: state.general.compiler,
});

export default connect(mapStateToProps, { setCompiler })(CompilerSelector);
