import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { tutorialTitle, changeContent } from '../../../actions/tutorialBuilderActions';

import Button from '@material-ui/core/Button';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';

class Textfield extends Component {

  // handleChange = (e) => {
  //   var value = e.target.value;
  //   if(value.replace(/\s/g,'') !== ''){
  //     this.setState({[e.target.name]: value, error: false});
  //   }
  //   else {
  //     this.setState({[e.target.name]: value, error: true});
  //   }
  // };

  render() {
    return (
      <FormControl variant="outlined" fullWidth style={{marginBottom: '10px'}}>
        <InputLabel htmlFor={this.props.property}>{this.props.label}</InputLabel>
        <OutlinedInput
          style={this.props.multiline ? {borderRadius: '25px', padding: '18.5px 14px 18.5px 24px'} : {borderRadius: '25px', padding: '0 0 0 10px'}}
          /* error={this.state.error}*/
          value={this.props.value}
          label={this.props.label}
          id={this.props.property}
          multiline={this.props.multiline}
          rows={2}
          rowsMax={10}
          onChange={(e) => {this.props.property === 'title' ?
                      this.props.tutorialTitle(e.target.value)
                    : this.props.changeContent(this.props.index, this.props.property, e.target.value)
                    }}
        />
        {/* {this.state.error ? <FormHelperText style={{color: 'red'}}>Gib einen Titel für das Tutorial ein.</FormHelperText> : null}*/}
      </FormControl>
    );
  };
}

Textfield.propTypes = {
  tutorialTitle: PropTypes.func.isRequired,
  changeContent: PropTypes.func.isRequired
};

export default connect(null, { tutorialTitle, changeContent })(Textfield);
