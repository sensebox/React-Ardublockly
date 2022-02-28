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
      <FormControl component="fieldset">
        <FormLabel component="legend">Tutorial veröffentlichen</FormLabel>
        <p>
          {" "}
          Du kannst dein Tutorial direkt über den Link mit anderen Personen
          teilen. Wenn du dein Tutorial für alle Nutzer:innen in der Überischt
          veröffenltichen wollen kannst du es hier aktivieren. Ein Administrator
          wird dein Tutorial ansehen und anschließend freischalten.
        </p>
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
