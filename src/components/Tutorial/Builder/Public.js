import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  tutorialPublic,
  jsonString,
  changeContent,
  setError,
  deleteError,
} from "../../../actions/tutorialBuilderActions";

import { withStyles } from "@material-ui/core/styles";

import * as Blockly from "blockly";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

const styles = (theme) => ({
  multiline: {
    padding: "18.5px 14px 18.5px 24px",
  },
  errorColor: {
    color: `${theme.palette.error.dark} !important`,
  },
  errorColorShrink: {
    color: `rgba(0, 0, 0, 0.54) !important`,
  },
  errorBorder: {
    borderColor: `${theme.palette.error.dark} !important`,
  },
});

class Public extends Component {
  handleChange = (e) => {
    var value = e.target.checked;
    if (this.props.property === "public") {
      this.props.tutorialPublic(value);
    } else if (this.props.property === "json") {
      this.props.jsonString(value);
    } else {
      this.props.changeContent(
        value,
        this.props.index,
        this.props.property,
        this.props.property2
      );
    }
  };

  render() {
    return (
      <FormControl component="fieldset">
        <FormLabel component="legend">
          {Blockly.Msg.builder_public_head}
        </FormLabel>
        <FormGroup aria-label="position" row>
          <FormControlLabel
            value="Tutorial veröffentlichen"
            control={
              <Checkbox
                checked={this.props.value}
                onChange={this.handleChange}
                color="primary"
                name="checkedA"
                inputProps={{ "aria-label": "secondary checkbox" }}
              />
            }
            label={Blockly.Msg.builder_public_label}
            labelPlacement="start"
          />
        </FormGroup>
      </FormControl>
    );
  }
}

Public.propTypes = {
  tutorialPublic: PropTypes.func.isRequired,
  jsonString: PropTypes.func.isRequired,
  changeContent: PropTypes.func.isRequired,
};

export default connect(null, {
  tutorialPublic,
  jsonString,
  changeContent,
  setError,
  deleteError,
})(withStyles(styles, { withTheme: true })(Public));
