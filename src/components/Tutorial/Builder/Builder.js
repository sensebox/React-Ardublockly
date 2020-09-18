import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Breadcrumbs from '../../Breadcrumbs';
import Id from './Id';
import Title from './Textfield';
import Step from './Step';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Builder extends Component {


  render() {
    return (
      <div>
        <Breadcrumbs content={[{link: '/', title: 'Home'},{link: '/tutorial', title: 'Tutorial'}, {link: '/tutorial/builder', title: 'Builder'}]}/>

        <h1>Tutorial-Builder</h1>

        <Id />
        <Title value={this.props.title} property={'title'} label={'Titel'}/>

        {this.props.steps.map((step, i) =>
          <Step step={step} index={i} />

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

Builder.propTypes = {
  title: PropTypes.string.isRequired,
  steps: PropTypes.array.isRequired,
  change: PropTypes.number.isRequired
};

const mapStateToProps = state => ({
  title: state.builder.title,
  steps: state.builder.steps,
  change: state.builder.change
});

export default connect(mapStateToProps, null)(Builder);
