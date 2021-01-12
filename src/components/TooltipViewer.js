import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import withWidth from '@material-ui/core/withWidth';

import { Card } from '@material-ui/core';
import * as Blockly from 'blockly'
import CardContent from '@material-ui/core/CardContent';

import Typography from '@material-ui/core/Typography';
import ReactMarkdown from 'react-markdown';

class TooltipViewer extends Component {


  render() {

    return (
      <Card className="tooltipViewer" style={{ height: '100%', margin: '1vH 0 0 0', maxHeight: '19vH', overflow: 'auto' }} ref={this.myDiv}>
        <CardContent>
          <Typography variant="h5" component="h2">
            {Blockly.Msg.tooltip_viewer}
          </Typography>
          <Typography variant="body2" component="p">
            <ReactMarkdown linkTarget="_blank">{this.props.tooltip}</ReactMarkdown>

            {this.props.helpurl !== '' ? <ReactMarkdown>{`${Blockly.Msg.tooltip_moreInformation} [${Blockly.Msg.labels_here}](${this.props.helpurl})`}</ReactMarkdown> : null}

          </Typography>
        </CardContent>
      </Card>
    );
  };
}

TooltipViewer.propTypes = {
  tooltip: PropTypes.string.isRequired,
  helpurl: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  tooltip: state.workspace.code.tooltip,
  helpurl: state.workspace.code.helpurl
});

export default connect(mapStateToProps, null)(withWidth()(TooltipViewer));
