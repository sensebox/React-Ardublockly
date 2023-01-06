import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setBoard } from '../../actions/boardActions';

import * as Blockly from 'blockly/core';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import FormHelperText from '@material-ui/core/FormHelperText';

class DeviceSelector extends Component {

  componentDidMount(){
    // Ensure that Blockly.setLocale is adopted in the component.
    // Otherwise, the text will not be displayed until the next update of the component.
    this.forceUpdate();
  }


  render(){
    return(
      <div>
        <Typography style={{fontWeight: 'bold'}}>{Blockly.Msg.settings_board}</Typography>
        <FormHelperText style={{color: 'black', lineHeight: 1.3, marginBottom: '8px'}}>{Blockly.Msg.settings_board_text}</FormHelperText>
        <FormControl>
          <InputLabel id="demo-simple-select-label">{Blockly.Msg.settings_board}</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={this.props.selectedBoard}
            onChange={(e) => this.props.setBoard(e.target.value)}
          >
            <MenuItem value="mcu">senseBox MCU</MenuItem>
            <MenuItem value="mini">senseBox MCU mini</MenuItem>
          </Select>
        </FormControl>
      </div>
    );
  }
}

DeviceSelector.propTypes = {
  setBoard: PropTypes.func.isRequired,
  selectedBoard: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  selectedBoard: state.board.board
});

export default connect(mapStateToProps, { setBoard })(DeviceSelector);
