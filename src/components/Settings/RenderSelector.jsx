import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setRenderer } from "../../actions/generalActions";

import * as Blockly from "blockly/core";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import FormHelperText from "@mui/material/FormHelperText";

class RenderSelector extends Component {
  componentDidMount() {
    // Ensure that Blockly.setLocale is adopted in the component.
    // Otherwise, the text will not be displayed until the next update of the component.
    this.forceUpdate();
  }

  render() {
    return (
      <div>
        <Typography style={{ fontWeight: "bold" }}>
          {Blockly.Msg.settings_renderer}
        </Typography>
        <FormHelperText
          style={{
            color: "black",
            lineHeight: 1.3,
            marginBottom: "8px",
          }}
        >
          {Blockly.Msg.settings_renderer_text}
        </FormHelperText>
        <FormControl variant="standard">
          <InputLabel id="demo-simple-select-label">
            {Blockly.Msg.settings_renderer}
          </InputLabel>
          <Select
            variant="standard"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={this.props.renderer}
            onChange={(e) => this.props.setRenderer(e.target.value)}
          >
            <MenuItem value={"geras"}>Geras</MenuItem>
            <MenuItem value={"zelos"}>Zelos</MenuItem>
          </Select>
        </FormControl>
      </div>
    );
  }
}

RenderSelector.propTypes = {
  setRenderer: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  renderer: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  renderer: state.general.renderer,
  language: state.general.language,
});

export default connect(mapStateToProps, { setRenderer })(RenderSelector);
