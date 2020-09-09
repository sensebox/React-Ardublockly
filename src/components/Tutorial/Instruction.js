import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as Blockly from 'blockly/core';

import BlocklyWindow from '../Blockly/BlocklyWindow';

import { tutorials } from './tutorials';

import Grid from '@material-ui/core/Grid';


class Instruction extends Component {

  render() {
    var currentTutorialId = this.props.currentTutorialId;
    console.log(currentTutorialId);
    return (
      tutorials[currentTutorialId].instruction ?
        <div>
          <p>{tutorials[currentTutorialId].instruction.description}</p>
          {tutorials[currentTutorialId].instruction.xml ?
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <BlocklyWindow
                trashcan={false}
                readOnly={true}
                zoomControls={false}
                grid={false}
                move={false}
                blocklyCSS={{minHeight: '300px'}}
                initialXml={tutorials[this.props.currentTutorialId].instruction.xml}
              />
            </Grid>
          </Grid>
          : null }
        </div>
      : null
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
