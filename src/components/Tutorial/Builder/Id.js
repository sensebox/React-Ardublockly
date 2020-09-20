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
  }
});

class Id extends Component {

  handleChange = (e) => {
    var value = parseInt(e.target.value);
    if(Number.isInteger(value) && value > 0){
      this.props.tutorialId(value);
      if(this.props.error){
        this.props.deleteError(undefined, 'id');
      }
    }
    else {
      this.props.tutorialId(value);
      this.props.setError(undefined,'id');
    }
  };

  handleCounter = (step) => {
    if(this.props.value+step < 1){
      this.props.setError(undefined,'id');
    }
    else if(this.props.error){
      this.props.deleteError(undefined, 'id');
    }
    if(!this.props.value){
      this.props.tutorialId(0+step);
    }
    else {
      this.props.tutorialId(this.props.value+step);
    }
  }

  render() {
    return (
      <div style={{display: 'inline-flex'}}>
      <FormControl variant="outlined" /*fullWidth*/ style={{marginBottom: '10px', width: 'max-content'}}>
        <InputLabel htmlFor="id">ID</InputLabel>
        <OutlinedInput
          style={{borderRadius: '25px', padding: '0 0 0 10px', width: '200px'}}
          error={this.props.error}
          value={this.props.value}
          name='id'
          label='ID'
          id='id'
          onChange={this.handleChange}
          inputProps={{
            style: {marginRight: '10px'}
          }}
          endAdornment={
            <div style={{display: 'flex'}}>
              <Button
                disabled={this.props.value === 1 || !this.props.value}
                onClick={() => this.handleCounter(-1)}
                variant='contained'
                color='primary'
                style={{borderRadius: '25px 0 0 25px', height: '56px', boxShadow: '0 0 transparent'}}
              >
                <FontAwesomeIcon icon={faMinus} />
              </Button>
              <Button
                onClick={() => this.handleCounter(1)}
                variant='contained'
                color='primary'
                style={{borderRadius: '0 25px 25px 0', height: '56px', boxShadow: '0 0 transparent'}}
              >
                <FontAwesomeIcon icon={faPlus} />
              </Button>
            </div>
          }
        />
        {this.props.error ? <FormHelperText className={this.props.classes.errorColor}>Gib eine positive ganzzahlige Zahl ein.</FormHelperText> : null}
      </FormControl>
      <FormHelperText style={{marginLeft: '10px', marginTop: '5px', lineHeight: 'initial', marginBottom: '10px', width: '200px'}}>Beachte, dass die ID eindeutig sein muss. Sie muss sich also zu den anderen Tutorials unterscheiden.</FormHelperText>
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