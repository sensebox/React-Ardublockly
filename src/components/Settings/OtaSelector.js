import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setPlatform } from "../../actions/generalActions";

import * as Blockly from "blockly/core";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";
import FormHelperText from "@material-ui/core/FormHelperText";

class OtaSelector extends Component {
  componentDidMount() {
    // Ensure that Blockly.setLocale is adopted in the component.
    // Otherwise, the text will not be displayed until the next update of the component.
    this.forceUpdate();
  }

  render() {
    return (
      <div>
        <Typography style={{ fontWeight: "bold" }}>OTA</Typography>
        <FormHelperText
          style={{ color: "black", lineHeight: 1.3, marginBottom: "8px" }}
        >
          Aktiviere OTA Modus{" "}
        </FormHelperText>
        <FormControl>
          <InputLabel id="demo-simple-select-label">
            {Blockly.Msg.settings_statistics}
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={this.props.platform}
            onChange={(e) => this.props.setPlatform(e.target.value)}
          >
            <MenuItem value={true}>true</MenuItem>
            <MenuItem value={false}>false</MenuItem>
          </Select>
        </FormControl>
      </div>
    );
  }
}

OtaSelector.propTypes = {
  setPlatform: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  platform: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  language: state.general.language,
  platform: state.general.platform,
});

export default connect(mapStateToProps, { setPlatform })(OtaSelector);
