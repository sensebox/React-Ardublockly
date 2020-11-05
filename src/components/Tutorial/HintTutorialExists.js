import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';

import Dialog from '../Dialog';

import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

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
      window.localStorage.deleteItem('news');
    }
  }

  render() {
    return (
      <Dialog
        style={{ zIndex: 9999999 }}
        fullWidth
        maxWidth={'sm'}
        open={this.state.open}
        title={'Neuigkeiten'}
        content={''}
        onClose={this.toggleDialog}
        onClick={this.toggleDialog}
        button={'Schließen'}
      >
        <div>
          Es gibt ab jetzt Tutorials zu verschiedenen Themen. Schau mal <Link to="/tutorial" className={this.props.classes.link}>hier</Link> vorbei.
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
            label={'Dialog nicht mehr anzeigen'}
          />
        </div>
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
