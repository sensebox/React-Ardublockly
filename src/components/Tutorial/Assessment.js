import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { workspaceName } from '../../actions/workspaceActions';

import BlocklyWindow from '../Blockly/BlocklyWindow';
import SolutionCheck from './SolutionCheck';
import CodeViewer from '../CodeViewer';
import WorkspaceFunc from '../WorkspaceFunc';

import withWidth, { isWidthDown } from '@material-ui/core/withWidth';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';

class Assessment extends Component {

  componentDidMount(){
    // alert(this.props.name);
    this.props.workspaceName(this.props.name);
  }

  componentDidUpdate(props){
    if(props.name !== this.props.name){
      // alert(this.props.name);
      this.props.workspaceName(this.props.name);
    }
  }

  render() {
    var tutorialId = this.props.currentTutorialId;
    var currentTask = this.props.step;
    var status = this.props.status.filter(status => status.id === tutorialId)[0];
    var taskIndex = status.tasks.findIndex(task => task.id === currentTask.id);
    var statusTask = status.tasks[taskIndex];

    return (
      <div style={{width: '100%'}}>
        <Typography variant='h4' style={{float: 'left', marginBottom: '5px', height: '40px', display: 'table'}}>{currentTask.headline}</Typography>
        <div style={{float: 'right', height: '40px'}}><WorkspaceFunc solutionCheck/></div>
        <Grid container spacing={2} style={{marginBottom: '5px'}}>
          <Grid item xs={12} md={6} lg={8}>
            <BlocklyWindow initialXml={statusTask ? statusTask.xml ? statusTask.xml : null : null}/>
          </Grid>
          <Grid item xs={12} md={6} lg={4} style={isWidthDown('sm', this.props.width) ? {height: 'max-content'} : {}}>
            <Card style={{height: 'calc(50% - 30px)', padding: '10px', marginBottom: '10px'}}>
              <Typography variant='h5'>Arbeitsauftrag</Typography>
              <Typography>{currentTask.text1}</Typography>
            </Card>
            <div style={isWidthDown('sm', this.props.width) ? {height: '500px'} : {height: '50%'}}>
              <CodeViewer />
            </div>
          </Grid>
        </Grid>
      </div>
    );
  };
}

Assessment.propTypes = {
  currentTutorialId: PropTypes.number,
  status: PropTypes.array.isRequired,
  change: PropTypes.number.isRequired,
  workspaceName: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  change: state.tutorial.change,
  status: state.tutorial.status,
  currentTutorialId: state.tutorial.currentId
});

export default connect(mapStateToProps, { workspaceName })(withWidth()(Assessment));
