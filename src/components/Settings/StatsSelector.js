import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setStatistics } from '../../actions/generalActions';

import * as Blockly from 'blockly/core'

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import FormHelperText from '@material-ui/core/FormHelperText';

class StatsSelector extends Component {

  componentDidMount(){
    // Ensure that Blockly.setLocale is adopted in the component.
    // Otherwise, the text will not be displayed until the next update of the component.
    this.forceUpdate();
  }

  render(){
    return (
      <div>
        <Typography style={{fontWeight: 'bold'}}>{Blockly.Msg.settings_statistics}</Typography>
        <FormHelperText style={{color: 'black', lineHeight: 1.3, marginBottom: '8px'}}>{Blockly.Msg.settings_statistics_text}</FormHelperText>
        <FormControl>
          <InputLabel id="demo-simple-select-label">{Blockly.Msg.settings_statistics}</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={this.props.statistics}
            onChange={(e) => this.props.setStatistics(e.target.value)}
          >
            <MenuItem value={true}>{Blockly.Msg.settings_statistics_on}</MenuItem>
            <MenuItem value={false}>{Blockly.Msg.settings_statistics_off}</MenuItem>
          </Select>
        </FormControl>
      </div>
    );
  }
}

StatsSelector.propTypes = {
  setStatistics: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  statistics: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  statistics: state.general.statistics,
  language: state.general.language
});

export default connect(mapStateToProps, { setStatistics })(StatsSelector);
