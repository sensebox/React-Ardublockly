import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { changeContent } from '../../../actions/tutorialBuilderActions';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

class StepType extends Component {

  render() {
    return (
      <RadioGroup row value={this.props.value} onChange={(e) => {this.props.changeContent(this.props.index, 'type', e.target.value)}}>
        <FormControlLabel style={{color: 'black'}}
          value="instruction"
          control={<Radio color="primary" />}
          label="Anleitung"
          labelPlacement="end"
        />
        <FormControlLabel style={{color: 'black'}}
          disabled={this.props.index === 0}
          value="task"
          control={<Radio color="primary" />}
          label="Aufgabe"
          labelPlacement="end"
        />
      </RadioGroup>
    );
  };
}

StepType.propTypes = {
  changeContent: PropTypes.func.isRequired
};

export default connect(null, { changeContent })(StepType);
