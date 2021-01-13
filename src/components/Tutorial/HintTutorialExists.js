import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dialog from '../Dialog';

import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import * as Blockly from 'blockly'
import ReactMarkdown from 'react-markdown';

const styles = (theme) => ({
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      color: theme.palette.primary.main,
      textDecoration: `underline`
    }
  },
  label: {
    fontSize: '0.9rem',
    color: 'grey'
  }
});

class HintTutorialExists extends Component {

  constructor(props) {
    var previousPageWasAnotherDomain = props.pageVisits === 0;
    var userDoNotWantToSeeNews = window.localStorage.getItem('news') ? true : false;
    super(props);
    this.state = {
      open: userDoNotWantToSeeNews ? !userDoNotWantToSeeNews : previousPageWasAnotherDomain
    };
  }

  toggleDialog = () => {
    this.setState({ open: !this.state });
  }

  onChange = (e) => {
    if (e.target.checked) {
      window.localStorage.setItem('news', e.target.checked);
    }
    else {
      window.localStorage.removeItem('news');
    }
  }

  render() {
    return (
      <Dialog
        style={{ zIndex: 9999999 }}
        fullWidth
        maxWidth={'sm'}
        open={this.state.open}
        title={Blockly.Msg.messages_newblockly_head}
        content={''}
        onClose={this.toggleDialog}
        onClick={this.toggleDialog}
        button={Blockly.Msg.button_close}
      >
        <div>
          <ReactMarkdown linkTarget="_blank">{Blockly.Msg.messages_newblockly_text}</ReactMarkdown>
        </div>
        <FormControlLabel
          style={{ marginTop: '20px' }}
          classes={{ label: this.props.classes.label }}
          control={
            <Checkbox
              size={'small'}
              value={true}
              checked={this.state.checked}
              onChange={(e) => this.onChange(e)}
              name="dialog"
              color="primary"
            />
          }
          label={Blockly.Msg.labels_donotshowagain}
        />
      </Dialog>
    );
  };
}

HintTutorialExists.propTypes = {
  pageVisits: PropTypes.number.isRequired
};

const mapStateToProps = state => ({
  pageVisits: state.general.pageVisits
});

export default connect(mapStateToProps, null)(withStyles(styles, { withTheme: true })(HintTutorialExists));
