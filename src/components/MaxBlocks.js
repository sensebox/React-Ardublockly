import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { workspaceChange } from '../actions/workspaceActions';

import * as Blockly from 'blockly/core';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

class MaxBlocks extends Component {

  state = {
    max: 1,
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value});
  }

  setMaxBlocks = () => {
    const workspace = Blockly.getMainWorkspace();
    workspace.options.maxBlocks = this.state.max;
    this.props.workspaceChange();
  }

  render() {
    return (
      <div style={{display: 'inline', marginLeft: '10px'}}>
        <TextField
          style={{width: '50px', marginRight: '5px'}}
          name="max"
          type="number"
          onChange={this.onChange}
          value={this.state.max}
        />
        <Button style={{marginRight: '10px', color: 'white'}} variant="contained" color="primary" onClick={this.setMaxBlocks}>
          Maximale Blöcke
        </Button>
      </div>
    );
  };
}

MaxBlocks.propTypes = {
  workspaceChange: PropTypes.func.isRequired
};

export default connect(null, { workspaceChange })(MaxBlocks);
