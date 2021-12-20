import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setSounds } from "../../actions/generalActions";

import * as Blockly from "blockly/core";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";
import FormHelperText from "@material-ui/core/FormHelperText";

class SoundsSelector extends Component {
  componentDidMount() {
    // Ensure that Blockly.setLocale is adopted in the component.
    // Otherwise, the text will not be displayed until the next update of the component.
    this.forceUpdate();
  }

  render() {
    return (
      <div>
        <Typography style={{ fontWeight: "bold" }}>
          {Blockly.Msg.settings_sounds}
        </Typography>
        <FormHelperText
          style={{ color: "black", lineHeight: 1.3, marginBottom: "8px" }}
        >
          {Blockly.Msg.settings_sounds_text}
        </FormHelperText>
        <FormControl>
          <InputLabel id="demo-simple-select-label">
            {Blockly.Msg.settings_sounds}
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={this.props.sounds}
            onChange={(e) => this.props.setSounds(e.target.value)}
          >
            <MenuItem value={false}>{Blockly.Msg.settings_ota_off}</MenuItem>
            <MenuItem value={true}>{Blockly.Msg.settings_ota_on}</MenuItem>
          </Select>
        </FormControl>
      </div>
    );
  }
}

SoundsSelector.propTypes = {
  setSounds: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  sounds: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  sounds: state.general.sounds,
  language: state.general.language,
});

export default connect(mapStateToProps, { setSounds })(SoundsSelector);
