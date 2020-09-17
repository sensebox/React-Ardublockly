import React, { Component } from 'react';

import Breadcrumbs from './Breadcrumbs';

import { withRouter } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

class NotFound extends Component {
  render() {
    return (
      <div>
        <Breadcrumbs content={[{link: this.props.location.pathname, title: 'Error'}]}/>
        <Typography variant='h4' style={{marginBottom: '5px'}}>Die von Ihnen angeforderte Seite kann nicht gefunden werden.</Typography>
        <Typography variant='body1'>Die gesuchte Seite wurde möglicherweise entfernt, ihr Name wurde geändert oder sie ist vorübergehend nicht verfügbar.</Typography>
        {this.props.button ?
          <Button
            style={{marginTop: '20px'}}
            variant="contained"
            color="primary"
            onClick={() => {this.props.history.push(this.props.button.link)}}
          >
            {this.props.button.title}
          </Button>
        :
          <Button
            style={{marginTop: '20px'}}
            variant="contained"
            color="primary"
            onClick={() => {this.props.history.push('/')}}
          >
            Zurück zur Startseite
          </Button>
        }
      </div>
    );
  };
}

export default withRouter(NotFound);
