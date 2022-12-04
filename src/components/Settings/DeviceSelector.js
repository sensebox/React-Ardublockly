import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setBoard } from '../../actions/boardAction';

import * as Blockly from 'blockly/core';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import FormHelperText from '@mui/material/FormHelperText';

class DeviceSelector extends Component {

  componentDidMount(){
    // Ensure that Blockly.setLocale is adopted in the component.
    // Otherwise, the text will not be displayed until the next update of the component.
    this.forceUpdate();
  }


  render(){
    return (
      <div>
        <Typography style={{fontWeight: 'bold'}}>{Blockly.Msg.settings_board}</Typography>
        <FormHelperText style={{color: 'black', lineHeight: 1.3, marginBottom: '8px'}}>{Blockly.Msg.settings_board_text}</FormHelperText>
        <FormControl variant="standard">
          <InputLabel id="demo-simple-select-label">{Blockly.Msg.settings_board}</InputLabel>
          <Select
            variant="standard"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={this.props.selectedBoard}
            onChange={(e) => this.props.setBoard(e.target.value)}>
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
