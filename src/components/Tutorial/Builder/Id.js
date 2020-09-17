import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';

import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Id extends Component {

  state = {
    id: 0,
    error: false
  }

  handleChange = (e) => {
    var value = parseInt(e.target.value);
    if(Number.isInteger(value)){
      this.setState({id: value, error: false});
    }
    else {
      this.setState({id: e.target.value, error: true});
    }
  };

  handleCounter = (step) => {
    if(!this.state.id){
      this.setState({id: 0+step});
    }
    else {
      this.setState({id: this.state.id+step});
    }
  }

  render() {
    return (
      <FormControl variant="outlined" /*fullWidth*/ style={{marginBottom: '10px', width: '100%'}}>
        <InputLabel htmlFor="id">ID</InputLabel>
        <OutlinedInput
          style={{borderRadius: '25px', padding: '0 0 0 10px', width: '200px'}}
          error={this.state.error}
          value={this.state.id}
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
        {this.state.error ? <FormHelperText style={{color: 'red'}}>Es muss eine positive ganzzahlige Zahl sein.</FormHelperText> : null}
      </FormControl>
    );
  };
}

export default Id;
