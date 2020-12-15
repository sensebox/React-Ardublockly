import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { workspaceName } from '../../actions/workspaceActions';

import BlocklyWindow from '../Blockly/BlocklyWindow';
import CodeViewer from '../CodeViewer';
import WorkspaceFunc from '../Workspace/WorkspaceFunc';

import withWidth, { isWidthDown } from '@material-ui/core/withWidth';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import * as Blockly from 'blockly'

class Assessment extends Component {

  componentDidMount() {
    this.props.workspaceName(this.props.name);
  }

  componentDidUpdate(props) {
    if (props.name !== this.props.name) {
      this.props.workspaceName(this.props.name);
    }
  }

  render() {
    var tutorialId = this.props.tutorial._id;
    var currentTask = this.props.step;
    var status = this.props.status.filter(status => status._id === tutorialId)[0];
    var taskIndex = status.tasks.findIndex(task => task._id === currentTask._id);
    var statusTask = status.tasks[taskIndex];

    return (
      <div className="assessmentDiv" style={{ width: '100%' }}>
        <Typography variant='h4' style={{ float: 'left', marginBottom: '5px', height: '40px', display: 'table' }}>{currentTask.headline}</Typography>
        <div style={{ float: 'right', height: '40px' }}><WorkspaceFunc assessment /></div>
        <Grid container spacing={2} style={{ marginBottom: '5px' }}>
          <Grid item xs={12} md={6} lg={8}>
            <BlocklyWindow
              initialXml={statusTask ? statusTask.xml ? statusTask.xml : null : null}
              blockDisabled
              blocklyCSS={{ height: '65vH' }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4} style={isWidthDown('sm', this.props.width) ? { height: 'max-content' } : {}}>
            <Card style={{ height: 'calc(50% - 30px)', padding: '10px', marginBottom: '10px' }}>
              <Typography variant='h5'>{Blockly.Msg.tutorials_assessment_task}</Typography>
              <Typography>{currentTask.text}</Typography>
            </Card>
            <div style={isWidthDown('sm', this.props.width) ? { height: '500px' } : { height: '50%' }}>
              <CodeViewer />
            </div>
          </Grid>
        </Grid>
      </div>
    );
  };
}

Assessment.propTypes = {
  status: PropTypes.array.isRequired,
  change: PropTypes.number.isRequired,
  workspaceName: PropTypes.func.isRequired,
  tutorial: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  change: state.tutorial.change,
  status: state.tutorial.status,
  tutorial: state.tutorial.tutorials[0]
});

export default connect(mapStateToProps, { workspaceName })(withWidth()(Assessment));
