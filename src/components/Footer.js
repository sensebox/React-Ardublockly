import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import Typography from '@material-ui/core/Typography';

class Footer extends Component {
  render() {
    return (
      <footer style={{position:'absolute', bottom: '0', width: '100%'}}>
        <div style={{minHeight:'30px', backgroundColor:'#DDDDDD', textAlign: 'center', paddingTop: '2px'}}>
          <div style={{color: 'grey', height: '100%'}}>
            <Link to={"/impressum"} style={{textDecoration: 'none', color: 'inherit'}}>Impressum</Link>
            <Typography style={{margin: '0px 10px 0px 10px', display: 'initial', fontSize: '1rem'}}>|</Typography>
            <Link to={"/ueberuns"} style={{textDecoration: 'none', color: 'inherit'}}>Über uns</Link>
            <Typography style={{margin: '0px 10px 0px 10px', display: 'initial', fontSize: '1rem'}}>|</Typography>
            <Link to={"/faq"} style={{textDecoration: 'none', color: 'inherit'}}>FAQ</Link>
          </div>
        </div>
      </footer>
    );
  };
}

export default Footer;
