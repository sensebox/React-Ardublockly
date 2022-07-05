import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  tutorialDifficulty,
  jsonString,
  changeContent,
  setError,
  deleteError,
} from "../../../actions/tutorialBuilderActions";

import { withStyles } from "@material-ui/core/styles";
import ReactStars from "react-rating-stars-component";
import * as Blockly from "blockly";
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

class Difficulty extends Component {
  ratingChanged = (newRating) => {
    console.log(newRating);
    this.handleChange(newRating);
  };

  handleChange = (e) => {
    var value = e;
    console.log(value);
    if (this.props.property === "difficulty") {
      this.props.tutorialDifficulty(value);
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
          {Blockly.Msg.builder_difficulty}
        </FormLabel>
        <FormGroup aria-label="position" row>
          <FormControlLabel
            value="Tutorial veröffentlichen"
            control={
              <ReactStars
                count={5}
                onChange={this.handleChange}
                value={this.props.value}
                size={30}
                isHalf={true}
                emptyIcon={<i className="fa fa-star"></i>}
                halfIcon={<i className="fa fa-star-half-alt"></i>}
                fullIcon={<i className="fa fa-star"></i>}
                activeColor="#ffd700"
              />
            }
            label="Schwierigkeitsgrad"
            labelPlacement="start"
          />
        </FormGroup>
      </FormControl>
    );
  }
}

Difficulty.propTypes = {
  tutorialDifficulty: PropTypes.func.isRequired,
  jsonString: PropTypes.func.isRequired,
  changeContent: PropTypes.func.isRequired,
};

export default connect(null, {
  tutorialDifficulty,
  jsonString,
  changeContent,
  setError,
  deleteError,
})(withStyles(styles, { withTheme: true })(Difficulty));
