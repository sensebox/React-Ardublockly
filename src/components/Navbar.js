import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import senseboxLogo from './sensebox_logo.svg';

import { withRouter } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';
import Tour from 'reactour'
import * as steps from './Tour';

import { faBars, faChevronLeft, faCog, faChalkboardTeacher, faTools, faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const styles = (theme) => ({
  drawerWidth: {
    // color: theme.palette.primary.main,
    width: window.innerWidth < 600 ? '100%' : '240px',
    borderRight: `1px solid ${theme.palette.primary.main}`
  },
  appBarColor: {
    backgroundColor: theme.palette.primary.main
  },
  tourButton: {
    marginleft: 'auto',
    marginright: '30px',
  }

});


class Navbar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      isTourOpen: false
    };
  }

  toggleDrawer = () => {
    this.setState({ open: !this.state.open });
  }

  openTour = () => {
    this.setState({ isTourOpen: true });

  }

  closeTour = () => {
    this.setState({ isTourOpen: false });
  }

  render() {
    return (
      <div>
        <AppBar
          position="relative"
          style={{ height: '50px', marginBottom: '30px' }}
          classes={{ root: this.props.classes.appBarColor }}
        >
          <Toolbar style={{ height: '50px', minHeight: '50px', padding: 0, color: 'white' }}>
            <IconButton
              color="inherit"
              onClick={this.toggleDrawer}
              style={{ margin: '0 10px' }}
              className="MenuButton"
            >
              <FontAwesomeIcon icon={faBars} />
            </IconButton>
            <Link to={"/"} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Typography variant="h6" noWrap>
                senseBox Blockly
              </Typography>
            </Link>
            <Link to={"/"} style={{ marginLeft: '10px' }}>
              <img src={senseboxLogo} alt="senseBox-Logo" width="30" />
            </Link>
            {/^\/tutorial(\/.*$|$)/g.test(this.props.location.pathname) ?
              <Link to={"/tutorial"} style={{ textDecoration: 'none', color: 'inherit', marginLeft: '10px' }}>
                <Typography variant="h6" noWrap>
                  Tutorial
                </Typography>
              </Link> : null}

            <Tooltip title='Hilfe starten' arrow>
              <IconButton
                color="inherit"
                className={`openTour ${this.props.classes.button}`}
                onClick={() => { this.openTour(); }}
                style={{ margin: '0 30px 0 auto' }}
              >
                <FontAwesomeIcon icon={faQuestionCircle} size="s" />
              </IconButton>
            </Tooltip>
            <Tour
              steps={steps.steps}
              isOpen={this.state.isTourOpen}
              onRequestClose={() => { this.closeTour(); }}
            />
          </Toolbar>

        </AppBar>
        <Drawer
          variant="temporary"
          anchor="left"
          onClose={this.toggleDrawer}
          open={this.state.open}
          classes={{ paper: this.props.classes.drawerWidth }}
          ModalProps={{ keepMounted: true }} // Better open performance on mobile.
        >
          <div style={{ height: '50px', cursor: 'pointer', color: 'white', padding: '0 22px' }} className={this.props.classes.appBarColor} onClick={this.toggleDrawer}>
            <div style={{ display: ' table-cell', verticalAlign: 'middle', height: 'inherit', width: '0.1%' }}>
              <Typography variant="h6" style={{ display: 'inline' }}>
                Menü
              </Typography>
              <div style={{ float: 'right' }}>
                <FontAwesomeIcon icon={faChevronLeft} />
              </div>
            </div>
          </div>
          <List>
            {[{ text: 'Tutorials', icon: faChalkboardTeacher, link: "/tutorial" }, { text: 'Tutorial-Builder', icon: faTools, link: "/tutorial/builder" }, { text: 'Gallery', icon: faLightbulb, link: "/gallery" }, { text: 'Einstellungen', icon: faCog, link: "/settings" }].map((item, index) => (
              <Link to={item.link} key={index} style={{ textDecoration: 'none', color: 'inherit' }}>
                <ListItem button onClick={this.toggleDrawer}>
                  <ListItemIcon><FontAwesomeIcon icon={item.icon} /></ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              </Link>
            ))}
          </List>
          <Divider classes={{ root: this.props.classes.appBarColor }} style={{ marginTop: 'auto' }} />
          {/* <List>
            {[{ text: 'Über uns', icon: faBuilding }, { text: 'Kontakt', icon: faEnvelope }, { text: 'Impressum', icon: faIdCard }].map((item, index) => (
              <ListItem button key={index} onClick={this.toggleDrawer}>
                <ListItemIcon><FontAwesomeIcon icon={item.icon} /></ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List> */}
        </Drawer>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(withRouter(Navbar));
