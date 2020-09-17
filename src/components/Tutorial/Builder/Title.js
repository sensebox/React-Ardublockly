import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';

class Title extends Component {

  state = {
    title: '',
    error: false
  }

  handleChange = (e) => {
    var value = e.target.value;
    if(value.replace(/\s/g,'') !== ''){
      this.setState({[e.target.name]: value, error: false});
    }
    else {
      this.setState({[e.target.name]: value, error: true});
    }
  };

  render() {
    return (
      <FormControl variant="outlined" fullWidth style={{marginBottom: '10px'}}>
        <InputLabel htmlFor="title">Titel</InputLabel>
        <OutlinedInput
          style={{borderRadius: '25px', padding: '0 0 0 10px'}}
          error={this.state.error}
          value={this.state.title}
          name='title'
          label='Titel'
          id='title'
          onChange={this.handleChange}
        />
        {this.state.error ? <FormHelperText style={{color: 'red'}}>Gib einen Titel für das Tutorial ein.</FormHelperText> : null}
      </FormControl>
    );
  };
}

export default Title;
