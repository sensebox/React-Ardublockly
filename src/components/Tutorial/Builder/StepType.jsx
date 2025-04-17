import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  changeContent,
  deleteProperty,
  deleteError,
} from "../../../actions/tutorialBuilderActions";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

class StepType extends Component {
  onChange = (value) => {
    this.props.changeContent(value, this.props.index, "type");
    // delete property 'xml', so that all used blocks are reset
    this.props.deleteProperty(this.props.index, "xml");
    if (value === "task") {
      this.props.deleteError(undefined, "type");
    }
  };

  render() {
    return (
      <RadioGroup
        row
        value={this.props.value === "task" ? "task" : "instruction"}
        onChange={(e) => this.onChange(e.target.value)}
      >
        <FormControlLabel
          style={{ color: "black" }}
          value="instruction"
          control={<Radio />}
          label="Anleitung"
          labelPlacement="end"
        />
        <FormControlLabel
          style={{ color: "black" }}
          disabled={this.props.index === 0}
          value="task"
          control={<Radio />}
          label="Aufgabe"
          labelPlacement="end"
        />
      </RadioGroup>
    );
  }
}

StepType.propTypes = {
  changeContent: PropTypes.func.isRequired,
  deleteProperty: PropTypes.func.isRequired,
  deleteError: PropTypes.func.isRequired,
};

export default connect(null, { changeContent, deleteProperty, deleteError })(
  StepType,
);
