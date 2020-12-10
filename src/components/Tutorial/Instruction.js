import React, { Component } from 'react';

import Hardware from './Hardware';
import Requirement from './Requirement';
import BlocklyWindow from '../Blockly/BlocklyWindow';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ReactMarkdown from 'react-markdown'


class Instruction extends Component {

  render() {
    var step = this.props.step;
    var isHardware = step.hardware && step.hardware.length > 0;
    var areRequirements = step.requirements && step.requirements.length > 0;
    return (
      <div>
        <Typography variant='h4' style={{ marginBottom: '5px' }}>{step.headline}</Typography>
        <Typography style={isHardware ? {} : { marginBottom: '5px' }}><ReactMarkdown className={'tutorial'} linkTarget={'_blank'} skipHtml={false}>{step.text}</ReactMarkdown></Typography>
        {isHardware ?
          <Hardware picture={step.hardware} /> : null}
        {areRequirements > 0 ?
          <Requirement requirements={step.requirements} /> : null}
        {step.media ?
          step.media.picture ?
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '5px' }}>
              <img src={`${process.env.REACT_APP_BLOCKLY_API}/media/${step.media.picture.path}`} alt='' style={{ maxHeight: '40vH', maxWidth: '100%' }} />
            </div>
            : step.media.youtube ?
              /*16:9; width: 800px; height: width/16*9=450px*/
              <div style={{ maxWidth: '800px', margin: 'auto' }}>
                <div style={{ position: 'relative', height: 0, paddingBottom: 'calc(100% / 16 * 9)' }}>
                  <iframe title={step.media.youtube} style={{ position: 'absolute', top: '0', left: '0', width: '100%', maxWidth: '800px', height: '100%', maxHeight: '450px' }} src={`https://www.youtube.com/embed/${step.media.youtube}`} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                </div>
              </div>
              : null
          : null}
        {step.xml ?
          <Grid container spacing={2} style={{ marginBottom: '5px' }}>
            <Grid item xs={12} style={{display: 'flex', justifyContent: 'center'}}>
              <BlocklyWindow
                svg
                blockDisabled
                initialXml={step.xml}
              />
            </Grid>
          </Grid>
          : null}
      </div>
    );
  };
}


export default Instruction;
