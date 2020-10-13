import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { tutorialId, setError, deleteError } from '../../../actions/tutorialBuilderActions';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';

import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const styles = theme => ({
  errorColor: {
    color: theme.palette.error.dark
  },
  errorColorShrink: {
    color: `rgba(0, 0, 0, 0.54) !important`
  },
  errorBorder: {
    borderColor: `${theme.palette.error.dark} !important`
  }
});

class Id extends Component {

  handleChange = (e) => {
    var value =

      parseInt(e.target.value);
    if (Number.isInteger(value) && value > 0) {
      this.props.tutorialId(value);
      if (this.props.error) {
        this.props.deleteError(undefined, 'id');
      }
    }
    else {
      this.props.tutorialId(value.toString());
      this.props.setError(undefined, 'id');
    }
  };

  handleCounter = (step) => {
    if (this.props.value + step < 1) {
      this.props.setError(undefined, 'id');
    }
    else if (this.props.error) {
      this.props.deleteError(undefined, 'id');
    }
    if (!this.props.value || !Number.isInteger(this.props.value)) {
      this.props.tutorialId(0 + step);
    }
    else {
      this.props.tutorialId(this.props.value + step);
    }
  }

  render() {
    return (
      <div style={{ display: 'inline-flex', marginTop: '15px' }}>
        <FormControl variant="outlined" style={{ marginBottom: '10px', width: '250px' }}>
          <InputLabel
            htmlFor="id"
            classes={{ shrink: this.props.error ? this.props.classes.errorColorShrink : null }}
          >
            ID
        </InputLabel>
          <OutlinedInput
            style={{ borderRadius: '25px', padding: '0 0 0 10px', width: '200px' }}
            classes={{ notchedOutline: this.props.error ? this.props.classes.errorBorder : null }}
            error={this.props.error}
            value={this.props.value}
            name='id'
            label='ID'
            id='id'
            onChange={this.handleChange}
            inputProps={{
              style: { marginRight: '10px' }
            }}
            endAdornment={
              <div style={{ display: 'flex' }}>
                <Button
                  disabled={this.props.value === 1 || !Number.isInteger(this.props.value)}
                  onClick={() => this.handleCounter(-1)}
                  variant='contained'
                  color='primary'
                  style={{ borderRadius: '25px 0 0 25px', height: '56px', boxShadow: '0 0 transparent' }}
                >
                  <FontAwesomeIcon icon={faMinus} />
                </Button>
                <Button
                  onClick={() => this.handleCounter(1)}
                  variant='contained'
                  color='primary'
                  style={{ borderRadius: '0 25px 25px 0', height: '56px', boxShadow: '0 0 transparent' }}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </Button>
              </div>
            }
          />
          {this.props.error ? <FormHelperText className={this.props.classes.errorColor}>Gib eine positive ganzzahlige Zahl ein.</FormHelperText> : null}
        </FormControl>
        <FormHelperText style={{ marginLeft: '-40px', marginTop: '5px', lineHeight: 'initial', marginBottom: '10px', width: '200px' }}>Beachte, dass die ID eindeutig sein muss. Sie muss sich also zu den anderen Tutorials unterscheiden.</FormHelperText>
      </div>
    );
  };
}

Id.propTypes = {
  tutorialId: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
  deleteError: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  change: state.builder.change
});

export default connect(mapStateToProps, { tutorialId, setError, deleteError })(withStyles(styles, { withTheme: true })(Id));
