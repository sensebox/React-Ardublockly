import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../actions/authActions';

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
import LinearProgress from '@material-ui/core/LinearProgress';

import { faBars, faChevronLeft, faLayerGroup, faSignInAlt, faSignOutAlt, faCertificate, faUserCircle, faCog, faChalkboardTeacher, faTools, faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Blockly from 'blockly'


const styles = (theme) => ({
  drawerWidth: {
    // color: theme.palette.primary.main,
    width: window.innerWidth < 600 ? '100%' : '240px',
    borderRight: `1px solid ${theme.palette.primary.main}`
  },
  appBarColor: {
    backgroundColor: theme.palette.primary.main
  }
});


class Navbar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  toggleDrawer = () => {
    this.setState({ open: !this.state.open });
  }

  render() {
    return (
      <div>
        <AppBar
          position="relative"
          style={{ height: '50px', marginBottom: this.props.tutorialIsLoading || this.props.projectIsLoading ? '0px' : '30px', boxShadow: this.props.tutorialIsLoading || this.props.projectIsLoading ? 'none' : '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)' }}
          classes={{ root: this.props.classes.appBarColor }}
        >
          <Toolbar style={{ height: '50px', minHeight: '50px', padding: 0, color: 'white' }}>
            <IconButton
              color="inherit"
              onClick={this.toggleDrawer}
              style={{ margin: '0 10px' }}
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
                {Blockly.Msg.navbar_menu}
              </Typography>
              <div style={{ float: 'right' }}>
                <FontAwesomeIcon icon={faChevronLeft} />
              </div>
            </div>
          </div>
          <List>
            {[{ text: Blockly.Msg.navbar_tutorials, icon: faChalkboardTeacher, link: "/tutorial" },
            { text: Blockly.Msg.navbar_tutorialbuilder, icon: faTools, link: "/tutorial/builder", restriction: this.props.user && this.props.user.blocklyRole !== 'user' && this.props.isAuthenticated },
            { text: Blockly.Msg.navbar_gallery, icon: faLightbulb, link: "/gallery" },
            { text: Blockly.Msg.navbar_projects, icon: faLayerGroup, link: "/project", restriction: this.props.isAuthenticated }].map((item, index) => {
              if (item.restriction || Object.keys(item).filter(attribute => attribute === 'restriction').length === 0) {
                return (
                  <Link to={item.link} key={index} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <ListItem button onClick={this.toggleDrawer}>
                      <ListItemIcon><FontAwesomeIcon icon={item.icon} /></ListItemIcon>
                      <ListItemText primary={item.text} />
                    </ListItem>
                  </Link>
                );
              }
            }
            )}
          </List>
          <Divider classes={{ root: this.props.classes.appBarColor }} style={{ marginTop: 'auto' }} />
          <List>
            {[{ text: Blockly.Msg.navbar_login, icon: faSignInAlt, link: '/user/login', restriction: !this.props.isAuthenticated },
            { text: Blockly.Msg.navbar_account, icon: faUserCircle, link: '/user', restriction: this.props.isAuthenticated },
            { text: Blockly.Msg.navbar_mybadges, icon: faCertificate, link: '/user/badge', restriction: this.props.isAuthenticated },
            { text: Blockly.Msg.navbar_logout, icon: faSignOutAlt, function: this.props.logout, restriction: this.props.isAuthenticated },
            { text: Blockly.Msg.navbar_settings, icon: faCog, link: "/settings" }].map((item, index) => {
              if (item.restriction || Object.keys(item).filter(attribute => attribute === 'restriction').length === 0) {
                return (
                  <Link to={item.link} key={index} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <ListItem button onClick={item.function ? () => { item.function(); this.toggleDrawer(); } : this.toggleDrawer}>
                      <ListItemIcon><FontAwesomeIcon icon={item.icon} /></ListItemIcon>
                      <ListItemText primary={item.text} />
                    </ListItem>
                  </Link>
                );
              }
            }
            )}
          </List>
        </Drawer>
        {this.props.tutorialIsLoading || this.props.projectIsLoading ?
          <LinearProgress style={{ marginBottom: '30px', boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)' }} />
          : null}
      </div>
    );
  }
}

Navbar.propTypes = {
  tutorialIsLoading: PropTypes.bool.isRequired,
  projectIsLoading: PropTypes.bool.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  user: PropTypes.object
};

const mapStateToProps = state => ({
  tutorialIsLoading: state.tutorial.progress,
  projectIsLoading: state.project.progress,
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user
});

export default connect(mapStateToProps, { logout })(withStyles(styles, { withTheme: true })(withRouter(Navbar)));
