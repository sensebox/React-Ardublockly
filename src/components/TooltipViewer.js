import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import withWidth from '@material-ui/core/withWidth';

import { Card } from '@material-ui/core';
import * as Blockly from 'blockly'
import CardContent from '@material-ui/core/CardContent';

import Typography from '@material-ui/core/Typography';
import ReactMarkdown from 'react-markdown';
import Link from '@material-ui/core/Link'
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';

class TooltipViewer extends Component {


  render() {

    return (
      <Card style={{ height: '100%', margin: '1vH 0 0 0', maxHeight: '19vH' }} ref={this.myDiv}>
        <CardContent>
          <Typography variant="h5" component="h2">
            Hilfe
        </Typography>
          <Typography variant="body1" component="p">
            <ReactMarkdown>{this.props.tooltip}</ReactMarkdown>
          </Typography>
        </CardContent>
      </Card>
    );
  };
}

TooltipViewer.propTypes = {
  tooltip: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  tooltip: state.workspace.code.tooltip
});

export default connect(mapStateToProps, null)(withWidth()(TooltipViewer));
