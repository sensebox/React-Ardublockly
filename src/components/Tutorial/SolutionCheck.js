import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { tutorialCheck, tutorialStep } from '../../actions/tutorialActions';

import { withRouter } from 'react-router-dom';

import Compile from '../Compile';
import Dialog from '../Dialog';

import { checkXml } from '../../helpers/compareXml';

import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';

import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const styles = (theme) => ({
  compile: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    }
  }
});

class SolutionCheck extends Component {

  state = {
    open: false,
    msg: ''
  }

  toggleDialog = () => {
    if (this.state.open) {
      this.setState({ open: false, msg: '' });
    }
    else {
      this.setState({ open: !this.state });
    }
  }

  check = () => {
    const tutorial = this.props.tutorial;
    const step = tutorial.steps[this.props.activeStep];
    var msg = checkXml(step.xml, this.props.xml);
    this.props.tutorialCheck(msg.type, step);
    this.setState({ msg, open: true });
  }

  render() {
    const steps = this.props.tutorial.steps;
    return (
      <div>
        <Tooltip title='Lösung kontrollieren' arrow>
          <IconButton
            className={this.props.classes.compile}
            style={{ width: '40px', height: '40px', marginRight: '5px' }}
            onClick={() => this.check()}
          >
            <FontAwesomeIcon icon={faPlay} size="xs" />
          </IconButton>
        </Tooltip>

        <Dialog
          style={{ zIndex: 9999999 }}
          fullWidth
          maxWidth={'sm'}
          open={this.state.open}
          title={this.state.msg.type === 'error' ? 'Fehler' : 'Erfolg'}
          content={this.state.msg.text}
          onClose={this.toggleDialog}
          onClick={this.toggleDialog}
          button={'Schließen'}
        >
          {this.state.msg.type === 'success' ?
            <div style={{ marginTop: '20px', display: 'flex' }}>
              <Compile />
              {this.props.activeStep === steps.length - 1 ?
                <Button
                  style={{ marginLeft: '10px' }}
                  variant="contained"
                  color="primary"
                  onClick={() => { this.toggleDialog(); this.props.history.push(`/tutorial/`) }}
                >
                  Tutorials-Übersicht
                </Button>
                :
                <Button
                  style={{ marginLeft: '10px' }}
                  variant="contained"
                  color="primary"
                  onClick={() => { this.toggleDialog(); this.props.tutorialStep(this.props.activeStep + 1) }}
                >
                  nächster Schritt
                </Button>
              }
            </div>
            : null}
        </Dialog>

      </div>
    );
  };
}


SolutionCheck.propTypes = {
  tutorialCheck: PropTypes.func.isRequired,
  tutorialStep: PropTypes.func.isRequired,
  activeStep: PropTypes.number.isRequired,
  xml: PropTypes.string.isRequired,
  tutorial: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  activeStep: state.tutorial.activeStep,
  xml: state.workspace.code.xml,
  tutorial: state.tutorial.tutorials[0]
});

export default connect(mapStateToProps, { tutorialCheck, tutorialStep })(withStyles(styles, { withTheme: true })(withRouter(SolutionCheck)));
