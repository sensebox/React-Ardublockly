import React, { Component } from 'react';

import Breadcrumbs from './Breadcrumbs';

import { withRouter } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import * as Blockly from 'blockly'

class NotFound extends Component {

  componentDidMount(){
    // Ensure that Blockly.setLocale is adopted in the component.
    // Otherwise, the text will not be displayed until the next update of the component.
    this.forceUpdate();
  }

  render() {
    return (
      <div>
        <Breadcrumbs content={[{ link: this.props.location.pathname, title: 'Error' }]} />
        <Typography variant='h4' style={{ marginBottom: '5px' }}>{Blockly.Msg.notfound_head}</Typography>
        <Typography variant='body1'>{Blockly.Msg.notfound_text}</Typography>
        {this.props.button ?
          <Button
            style={{ marginTop: '20px' }}
            variant="contained"
            color="primary"
            onClick={() => { this.props.history.push(this.props.button.link) }}
          >
            {this.props.button.title}
          </Button>
          :
          <Button
            style={{ marginTop: '20px' }}
            variant="contained"
            color="primary"
            onClick={() => { this.props.history.push('/') }}
          >
            {Blockly.Msg.button_back}
          </Button>
        }
      </div>
    );
  };
}

export default withRouter(NotFound);
