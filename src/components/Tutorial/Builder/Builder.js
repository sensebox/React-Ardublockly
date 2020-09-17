import React, { Component } from 'react';

import Breadcrumbs from '../../Breadcrumbs';
import Id from './Id';
import Title from './Title';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Builder extends Component {

  state = {
    steps: [
      {
        headline: ''
      },
      {
        headline: ''
      }
    ]
  }

  addStep = (index) => {
    var step = {
      headline: ''
    };
    var steps = this.state.steps;
    steps.splice(index, 0, step);
    this.setState({steps: steps});
  }

  removeStep = (index) => {
    var steps = this.state.steps;
    steps.splice(index, 1);
    this.setState({steps: steps});
  }

  render() {
    return (
      <div>
        <Breadcrumbs content={[{link: '/', title: 'Home'},{link: '/tutorial', title: 'Tutorial'}, {link: '/tutorial/builder', title: 'Builder'}]}/>

        <h1>Tutorial-Builder</h1>

        <Id />
        <Title />

        {this.state.steps.map((step, i) =>
          <div style={{borderRadius: '25px', background: 'lightgrey', padding: '10px', marginBottom: '20px'}}>
            <Typography style={{marginBottom: '10px', marginLeft: '25px'}}>Schritt {i+1}</Typography>
            <Title />
            <div style={{display: 'flex'}}>
              <Button
                disabled={i === 0}
                onClick={() => this.removeStep(i)}
                variant='contained'
                color='primary'
                style={{borderRadius: '25px 0 0 25px', height: '40px', boxShadow: '0 0 transparent'}}
              >
                <FontAwesomeIcon icon={faMinus} />
              </Button>
              <Button
                onClick={() => this.addStep(i)}
                variant='contained'
                color='primary'
                style={{borderRadius: '0 25px 25px 0', height: '40px', boxShadow: '0 0 transparent'}}
              >
                <FontAwesomeIcon icon={faPlus} />
              </Button>
            </div>
          </div>

        )}


        <Button variant='contained' color='primary' onClick={() => {alert('hi')}}>Submit</Button>


      </div>
      /*<div style={{borderRadius: '25px', background: 'yellow', textAlign: 'center'}}>
        <Typography variant='h4'>Tutorial-Builder</Typography>
      </div>
      */
    );
  };
}

export default Builder;
