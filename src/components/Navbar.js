import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

const styles = (theme) => ({
  drawerWidth: {
    // color: theme.palette.primary.main,
    width: window.innerWidth < 600 ? '100%' : '220px',
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

  render(){
    return (
      <div>
        <AppBar
          position="relative"
          style={{height: '50px', marginBottom: '30px'}}
          classes={{root: this.props.classes.appBarColor}}
        >
          <Toolbar style={{height: '50px', minHeight: '50px', padding: 0}}>
            <IconButton
              color="inherit"
              onClick={this.toggleDrawer}
              style={{margin: '0 10px'}}
            >
              <MenuIcon />
            </IconButton>
            <Link to={"/"} style={{textDecoration: 'none', color: 'inherit'}}>
              <Typography variant="h6" noWrap>
                senseBox Blockly
              </Typography>
            </Link>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="temporary"
          anchor="left"
          onClose={this.toggleDrawer}
          open={this.state.open}
          classes={{paper: this.props.classes.drawerWidth}}
          ModalProps={{keepMounted: true}} // Better open performance on mobile.
        >
          <div style={{height: '50px', cursor: 'pointer', color: 'white', padding: '0 22px'}} className={this.props.classes.appBarColor} onClick={this.toggleDrawer}>
            <div style={{display:' table-cell', verticalAlign: 'middle', height: 'inherit', width: '0.1%'}}>
              <Typography variant="h6" style={{display:'inline'}}>
                Menü
              </Typography>
              <div style={{float: 'right'}}>
                <ChevronLeftIcon style={{verticalAlign: 'middle'}}/>
              </div>
            </div>
          </div>
          <List>
            {[{text: 'Tutorials', icon: <InboxIcon />}, {text: 'Einstellungen', icon: <InboxIcon />}].map((item, index) => (
              <ListItem button key={index} onClick={this.toggleDrawer}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
          <Divider classes={{root: this.props.classes.appBarColor}} style={{marginTop: 'auto'}}/>
          <List>
            {[{text: 'Über uns', icon: <InboxIcon />},{text: 'Kontakt', icon: <MailIcon />}, {text: 'Impressum', icon: <InboxIcon />}].map((item, index) => (
              <ListItem button key={index} onClick={this.toggleDrawer}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Drawer>
      </div>
    );
  }
}

export default withStyles(styles, {withTheme: true})(Navbar);
