import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { assigneBadge } from '../../actions/tutorialActions';

import Dialog from '../Dialog';

class Badge extends Component {

  state = {
    open: false,
    title: '',
    content: ''
  };

  componentDidUpdate(props){
    if(this.props.tutorial.badge){
      if(this.isSuccess()){
      // is connected to MyBadges?
        if(this.props.isAuthenticated && this.props.user && this.props.user.badge){
          // if(!this.props.user.badges.include(this.props.tutorial.badge)){
            this.props.assigneBadge(this.props.tutorial.badge);
          }
        // }
      }
    }
    if(props.message !== this.props.message){
      if(this.props.message.id === 'ASSIGNE_BADGE_SUCCESS'){
        alert('Badge '+props.message.msg.name);
        this.setState({title: '', content: '', open: true});
      }
    }
  }

  isSuccess = () => {
    var tutorialId = this.props.tutorial._id;
    var status = this.props.status.filter(status => status._id === tutorialId)[0];
    var tasks = status.tasks;
    var success = tasks.filter(task => task.type === 'success').length / tasks.length;
    if(success===1){
      return true;
    }
    return false;
  }

  toggleDialog = () => {
    this.setState({ open: !this.state, title: '', content: '' });
  }

  render() {
    return (
      <Dialog
        open={this.state.open}
        title={this.state.title}
        content={this.state.content}
        onClose={() => {this.toggleDialog();}}
        onClick={() => {this.toggleDialog();}}
        button={'Schließen'}
      >
        <div style={{ marginTop: '10px' }}>

        </div>
      </Dialog>
    );
  };
}

Badge.propTypes = {
  assigneBadge: PropTypes.func.isRequired,
  status: PropTypes.array.isRequired,
  change: PropTypes.number.isRequired,
  tutorial: PropTypes.object.isRequired,
  user: PropTypes.object,
  isAuthenticated: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  change: state.tutorial.change,
  status: state.tutorial.status,
  tutorial: state.tutorial.tutorials[0],
  user: state.auth.user,
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { assigneBadge })(Badge);
