import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import BlocklyWindow from '../Blockly/BlocklyWindow';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

class Instruction extends Component {

  render() {
    var step = this.props.step;
    var isHardware = step.hardware && step.hardware.length > 0;
    var areRequirements = step.requirements && step.requirements.length > 0;
    return (
      <div>
        <Typography variant='h4' style={{marginBottom: '5px'}}>{step.headline}</Typography>
        <Typography style={isHardware ? {} : {marginBottom: '5px'}}>{step.text1}</Typography>
        {isHardware ?
          <Typography style={areRequirements ? {} : {marginBottom: '5px'}}>Hardware: todo</Typography> : null}
        {areRequirements > 0 ?
          <Typography style={{marginBottom: '5px'}}>Voraussetzungen: todo</Typography> : null}
        {step.xml ?
        <Grid container spacing={2} style={{marginBottom: '5px'}}>
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