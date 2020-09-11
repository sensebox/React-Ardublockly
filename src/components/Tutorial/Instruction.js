import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import BlocklyWindow from '../Blockly/BlocklyWindow';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

class Instruction extends Component {

  render() {
    var step = this.props.step;
    return (
      <div>
        <Typography variant='h4' style={{marginBottom: '5px'}}>{step.headline}</Typography>
        <Typography style={{marginBottom: '5px'}}>{step.text1}</Typography>
        {step.hardware && step.hardware.length > 0 ? 'Hardware: todo' : null}
        {step.requirements && step.requirements.length > 0 ? 'Voraussetzungen: todo' : null}
        {step.xml ?
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <BlocklyWindow
              trashcan={false}
              readOnly={true}
              zoomControls={false}
              grid={false}
              move={false}
              blocklyCSS={{minHeight: '300px'}}
              initialXml={step.xml}
            />
          </Grid>
        </Grid>
        : null }
      </div>
    );
  };
}

Instruction.propTypes = {
  currentTutorialId: PropTypes.number,
};

const mapStateToProps = state => ({
  currentTutorialId: state.tutorial.currentId
});

export default connect(mapStateToProps, null)(Instruction);
