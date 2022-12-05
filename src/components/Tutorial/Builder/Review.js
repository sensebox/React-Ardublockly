import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  tutorialReview,
  jsonString,
  changeContent,
  setError,
  deleteError,
} from "../../../actions/tutorialBuilderActions";

import withStyles from '@mui/styles/withStyles';

import * as Blockly from "blockly";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

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

class Review extends Component {
  handleChange = (e) => {
    var value = e.target.checked;
    if (this.props.property === "review") {
      this.props.tutorialReview(value);
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
      <FormControl variant="standard" component="fieldset">
        <FormLabel component="legend">
          {Blockly.Msg.builder_review_head}
        </FormLabel>
        {Blockly.Msg.builder_review_text}
        <FormGroup aria-label="position" row>
          <FormControlLabel
            value="Tutorial veröffentlichen"
            control={
              <Checkbox
                checked={this.props.value}
                onChange={this.handleChange}
                name="checkedA"
                inputProps={{ "aria-label": "secondary checkbox" }}
              />
            }
            label="Ich möchte mein Tutorial öffentlich machen"
            labelPlacement="start"
          />
        </FormGroup>
      </FormControl>
    );
  }
}

Review.propTypes = {
  tutorialReview: PropTypes.func.isRequired,
  jsonString: PropTypes.func.isRequired,
  changeContent: PropTypes.func.isRequired,
};

export default connect(null, {
  tutorialReview,
  jsonString,
  changeContent,
  setError,
  deleteError,
})(withStyles(styles, { withTheme: true })(Review));
