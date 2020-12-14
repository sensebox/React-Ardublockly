import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setLanguage } from '../../actions/generalActions';

import * as Blockly from 'blockly/core';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import FormHelperText from '@material-ui/core/FormHelperText';

class LanguageSelector extends Component {

  componentDidMount(){
    // Ensure that Blockly.setLocale is adopted in the component.
    // Otherwise, the text will not be displayed until the next update of the component.
    this.forceUpdate();
  }

  handleChange = (event) => {
    this.props.setLanguage(event.target.value);
  }

  render(){
    return(
      <div>
        <Typography style={{fontWeight: 'bold'}}>{Blockly.Msg.settings_language}</Typography>
        <FormHelperText style={{color: 'black', lineHeight: 1.3, marginBottom: '8px'}}>{Blockly.Msg.settings_language_text}</FormHelperText>
        <FormControl>
          <InputLabel id="demo-simple-select-label">{Blockly.Msg.settings_language}</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={this.props.language}
            onChange={this.handleChange}
          >
            <MenuItem value={'de_DE'}>{Blockly.Msg.settings_language_de}</MenuItem>
            <MenuItem value={'en_US'}>{Blockly.Msg.settings_language_en}</MenuItem>
          </Select>
        </FormControl>
      </div>
    );
  }
}

LanguageSelector.propTypes = {
  setLanguage: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  language: state.general.language
});

export default connect(mapStateToProps, { setLanguage })(LanguageSelector);
