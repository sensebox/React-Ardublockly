import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { tutorialTitle, tutorialBadge, jsonString, changeContent, setError, deleteError } from '../../../actions/tutorialBuilderActions';

import { withStyles } from '@material-ui/core/styles';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';

const styles = theme => ({
  multiline: {
    padding: '18.5px 14px 18.5px 24px'
  },
  errorColor: {
    color: `${theme.palette.error.dark} !important`
  },
  errorColorShrink: {
    color: `rgba(0, 0, 0, 0.54) !important`
  },
  errorBorder: {
    borderColor: `${theme.palette.error.dark} !important`
  }
});

class Textfield extends Component {

  componentDidMount(){
    if(this.props.error){
      if(this.props.property !== 'media'){
        this.props.deleteError(this.props.index, this.props.property);
      }
    }
  }

  handleChange = (e) => {
    var value = e.target.value;
    if(this.props.property === 'title'){
      this.props.tutorialTitle(value);
    }
    else if(this.props.property === 'json'){
      this.props.jsonString(value);
    }
    else if(this.props.property === 'badge'){
      this.props.tutorialBadge(value);
    }
    else {
      this.props.changeContent(value, this.props.index, this.props.property, this.props.property2);
    }
    if(value.replace(/\s/g,'') === ''){
      this.props.setError(this.props.index, this.props.property);
    }
    else{
      this.props.deleteError(this.props.index, this.props.property);
    }
  };

  render() {
    return (
      <FormControl variant="outlined" fullWidth style={{marginBottom: '10px'}}>
        <InputLabel
          htmlFor={this.props.property}
          classes={{shrink: this.props.error ? this.props.classes.errorColorShrink : null}}
        >
          {this.props.label}
        </InputLabel>
        <OutlinedInput
          style={{borderRadius: '25px'}}
          classes={{multiline: this.props.classes.multiline, notchedOutline: this.props.error ? this.props.classes.errorBorder : null}}
          error={this.props.error}
          value={this.props.value}
          label={this.props.label}
          id={this.props.property}
          multiline={this.props.multiline}
          rows={2}
          rowsMax={10}
          onChange={(e) => this.handleChange(e)}
        />
        {this.props.error ?
          this.props.property === 'title' ? <FormHelperText className={this.props.classes.errorColor}>Gib einen Titel für das Tutorial ein.</FormHelperText>
        : this.props.property === 'json' ? <FormHelperText className={this.props.classes.errorColor}>Gib einen JSON-String ein und bestätige diesen mit einem Klick auf den entsprechenden Button</FormHelperText>
        : <FormHelperText className={this.props.classes.errorColor}>{this.props.errorText}</FormHelperText>
        : null}
      </FormControl>
    );
  };
}

Textfield.propTypes = {
  tutorialTitle: PropTypes.func.isRequired,
  tutorialBadge: PropTypes.func.isRequired,
  jsonString: PropTypes.func.isRequired,
  changeContent: PropTypes.func.isRequired,
};

export default connect(null, { tutorialTitle, tutorialBadge, jsonString, changeContent, setError, deleteError })(withStyles(styles, { withTheme: true })(Textfield));
