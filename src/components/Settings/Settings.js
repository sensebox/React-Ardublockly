import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withRouter } from 'react-router-dom';

import * as Blockly from 'blockly/core';

import Breadcrumbs from '../Breadcrumbs';
import LanguageSelector from './LanguageSelector';
import RenderSelector from './RenderSelector';
import StatsSelector from './StatsSelector';

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

class Settings extends Component {

  componentDidMount(){
    // Ensure that Blockly.setLocale is adopted in the component.
    // Otherwise, the text will not be displayed until the next update of the component.
    this.forceUpdate();
  }

  render() {
    return (
      <div>
        <Breadcrumbs content={[{ link: this.props.location.pathname, title: Blockly.Msg.settings_head }]} />

        <h1>{Blockly.Msg.settings_head}</h1>

        <Paper style={{margin: '10px 0px', padding: '10px'}}>
          <LanguageSelector />
        </Paper>
        <Paper style={{margin: '10px 0px', padding: '10px'}}>
          <RenderSelector />
        </Paper>
        <Paper style={{margin: '10px 0px', padding: '10px'}}>
          <StatsSelector />
        </Paper>

        <Button
          style={{ marginTop: '10px' }}
          variant="contained"
          color="primary"
          onClick={this.props.pageVisits > 0 ? () => this.props.history.goBack() : () => this.props.history.push('/')}
        >
          {Blockly.Msg.button_back}
        </Button>
      </div>
    );
  };
}

Settings.propTypes = {
  language: PropTypes.string.isRequired,
  pageVisits: PropTypes.number.isRequired
};

const mapStateToProps = state => ({
  language: state.general.language,
  pageVisits: state.general.pageVisits
});

export default connect(mapStateToProps, null)(withRouter(Settings));
