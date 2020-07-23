import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setWorkspace } from '../actions/workspaceActions';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

class MaxBlocks extends Component {

  state = {
    max: 1,
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value});
  }

  render() {
    // var blockLeft = Object.keys(this.props.newWorkspace).length > 0 ? <p>{this.props.newWorkspace.remainingCapacity()} verbleibende Blöcke möglich</p> : null
    // var error = this.state.error ? <div>{this.state.error}</div> : null;
    return (
      <div style={{display: 'inline', marginLeft: '10px'}}>
        <TextField
          style={{width: '50px'}}
          name="max"
          type="number"
          onChange={this.onChange}
          value={this.state.max}
          variant='filled'
        />
        <Button style={{marginRight: '10px'}} variant="contained" color="primary" onClick={() => {this.props.newWorkspace.options.maxBlocks = this.state.max; this.props.setWorkspace(this.props.newWorkspace)}}>
          Maximale Blöcke
        </Button>
      </div>
    );
  };
}

MaxBlocks.propTypes = {
  newWorkspace: PropTypes.object.isRequired,
  setWorkspace: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  newWorkspace: state.workspace.new
});

export default connect(mapStateToProps, { setWorkspace })(MaxBlocks);
