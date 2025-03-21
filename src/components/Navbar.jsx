import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../actions/authActions";

import senseboxLogo from "./sensebox_logo.svg";

import { withRouter } from "react-router-dom";

import withStyles from "@mui/styles/withStyles";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LinearProgress from "@mui/material/LinearProgress";
import Tour from "reactour";
import { Badge } from "@mui/material";
import { home, assessment } from "./Tour";
import {
  faBars,
  faChevronLeft,
  faLayerGroup,
  faSignInAlt,
  faSignOutAlt,
  faUserCircle,
  faQuestionCircle,
  faCog,
  faChalkboardTeacher,
  faTools,
  faLightbulb,
  faCode,
  faPuzzlePiece,
  faUser,
  faMicrochip,
  faEarthEurope,
  faEarthAmericas,
  faCaretDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Blockly from "blockly";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { setLanguage } from "../actions/generalActions";
import { setBoard } from "../actions/boardAction";
import { Button } from "@mui/material";

const styles = (theme) => ({
  drawerWidth: {
    // color: theme.palette.primary.main,
    width: window.innerWidth < 600 ? "100%" : "240px",
    borderRight: `1px solid ${theme.palette.primary.main}`,
  },
  appBarColor: {
    backgroundColor: theme.palette.primary.main,
  },
  tourButton: {
    marginleft: "auto",
    marginright: "30px",
  },
});

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.langRef = React.createRef();
    this.mcuRef = React.createRef();
    this.state = {
      open: false,
      isTourOpen: false,
      anchorElLang: null,
      anchorElBoard: null,
      anchorElUser: null,
    };
  }

  toggleDrawer = () => {
    this.setState({ open: !this.state.open });
  };

  openTour = () => {
    this.setState({ isTourOpen: true });
  };

  closeTour = () => {
    this.setState({ isTourOpen: false });
  };

  componentDidMount() {
    const { location } = this.props;
    const query = new URLSearchParams(location.search, [location.search]);
    const tour = query.get("tour");

    if (!this.state.isTourOpen && tour) {
      this.openTour();
    }
  }

  render() {
    var isHome = /^\/(\/.*$|$)/g.test(this.props.location.pathname);
    var isAssessment =
      /^\/tutorial\/.{1,}$/g.test(this.props.location.pathname) &&
      !this.props.tutorialIsLoading &&
      this.props.tutorial &&
      this.props.tutorial.steps[this.props.activeStep].type === "task";
    return (
      <div>
        <AppBar
          position="relative"
          style={{
            height: "50px",
            marginBottom:
              this.props.tutorialIsLoading || this.props.projectIsLoading
                ? "0px"
                : "30px",
            boxShadow:
              this.props.tutorialIsLoading || this.props.projectIsLoading
                ? "none"
                : "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
          }}
          classes={{ root: this.props.classes.appBarColor }}
        >
          <Toolbar
            style={{
              height: "50px",
              minHeight: "50px",
              padding: 0,
              color: "white",
            }}
          >
            <IconButton
              color="inherit"
              onClick={this.toggleDrawer}
              style={{ margin: "0 10px" }}
              className="MenuButton"
              size="large"
            >
              <FontAwesomeIcon icon={faBars} />
            </IconButton>
            <Link to={"/"} style={{ textDecoration: "none", color: "inherit" }}>
              <Typography variant="h6" noWrap>
                senseBox Blockly
              </Typography>
            </Link>
            <Link to={"/"} style={{ marginLeft: "10px" }}>
              <img
                src={senseboxLogo}
                alt="senseBox-Logo"
                style={{ width: "35px", height: "auto" }}
              />
            </Link>

            <div
              style={{
                margin: "0 0 0 auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isHome ? (
                <div style={{ display: "flex" }}>
                  <div style={{ padding: "12px" }}>
                    <Button
                      style={{
                        textTransform: "none",
                        cursor: "pointer",
                        alignItems: "center",
                        alignContent: "center",
                        background: "transparent",
                        color: "inherit",
                        fontWeight: "bold",
                        border: "2px solid white",
                        borderRadius: "25px",
                      }}
                      ref={this.mcuRef}
                      onClick={() => {
                        this.setState({
                          anchorElBoard: this.mcuRef.current,
                        });
                      }}
                      startIcon={<FontAwesomeIcon icon={faMicrochip} />}
                      endIcon={<FontAwesomeIcon icon={faCaretDown} />}
                      sx={{
                        display: {
                          xs: "none",
                          sm: "none",
                          md: "flex",
                        },
                      }}
                    >
                      {this.props.selectedBoard === "mcu"
                        ? "MCU"
                        : this.props.selectedBoard === "mini"
                          ? "MCU:mini"
                          : "MCU-S2"}
                    </Button>
                    <Menu
                      anchorEl={this.state.anchorElBoard}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "center",
                      }}
                      open={Boolean(this.state.anchorElBoard)}
                      onClose={() => {
                        this.setState({
                          anchorElBoard: null,
                        });
                      }}
                    >
                      <MenuItem
                        value="mcu"
                        onClick={(event) => {
                          this.props.setBoard(
                            event.currentTarget.getAttribute("value"),
                          );
                          this.setState({
                            anchorElBoard: null,
                          });
                        }}
                      >
                        MCU
                      </MenuItem>
                      <MenuItem
                        value="mini"
                        onClick={(event) => {
                          this.props.setBoard(
                            event.currentTarget.getAttribute("value"),
                          );
                          this.setState({
                            anchorElBoard: null,
                          });
                        }}
                      >
                        MCU:mini
                      </MenuItem>
                      <MenuItem
                        value="esp32"
                        onClick={(event) => {
                          this.props.setBoard(
                            event.currentTarget.getAttribute("value"),
                          );
                          this.setState({
                            anchorElBoard: null,
                          });
                        }}
                      >
                        MCU-S2
                      </MenuItem>
                    </Menu>
                  </div>
                  <div style={{ padding: "12px" }}>
                    {this.props.language === "en_US" ? (
                      <Button
                        style={{
                          textTransform: "none",
                          cursor: "pointer",
                          alignItems: "center",
                          alignContent: "center",
                          background: "transparent",
                          color: "inherit",
                          fontWeight: "bold",
                          border: "2px solid white",
                          borderRadius: "25px",
                        }}
                        ref={this.langRef}
                        onClick={() => {
                          this.setState({
                            anchorElLang: this.langRef.current,
                          });
                        }}
                        startIcon={<FontAwesomeIcon icon={faEarthAmericas} />}
                        endIcon={<FontAwesomeIcon icon={faCaretDown} />}
                        sx={{
                          display: {
                            xs: "none",
                            sm: "none",
                            md: "flex",
                          },
                        }}
                      >
                        English
                      </Button>
                    ) : (
                      <Button
                        style={{
                          textTransform: "none",
                          cursor: "pointer",
                          alignItems: "center",
                          alignContent: "center",
                          background: "transparent",
                          color: "inherit",
                          fontWeight: "bold",
                          border: "2px solid white",
                          borderRadius: "25px",
                        }}
                        ref={this.langRef}
                        onClick={() => {
                          this.setState({
                            anchorElLang: this.langRef.current,
                          });
                        }}
                        startIcon={<FontAwesomeIcon icon={faEarthEurope} />}
                        endIcon={<FontAwesomeIcon icon={faCaretDown} />}
                        sx={{
                          display: {
                            xs: "none",
                            sm: "none",
                            md: "flex",
                          },
                        }}
                      >
                        Deutsch
                      </Button>
                    )}
                    <Menu
                      anchorEl={this.state.anchorElLang}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "center",
                      }}
                      open={Boolean(this.state.anchorElLang)}
                      onClose={() => {
                        this.setState({
                          anchorElLang: null,
                        });
                      }}
                    >
                      <MenuItem
                        value="de_DE"
                        onClick={(event) => {
                          this.props.setLanguage(
                            event.currentTarget.getAttribute("value"),
                          );
                          this.setState({
                            anchorElLang: null,
                          });
                        }}
                      >
                        Deutsch
                      </MenuItem>
                      <MenuItem
                        value="en_US"
                        onClick={(event) => {
                          this.props.setLanguage(
                            event.currentTarget.getAttribute("value"),
                          );
                          this.setState({
                            anchorElLang: null,
                          });
                        }}
                      >
                        English
                      </MenuItem>
                    </Menu>
                  </div>
                </div>
              ) : null}
              {isHome ? (
                <Tooltip title={"Start Tour"} arrow>
                  <IconButton
                    color="inherit"
                    className={`openTour ${this.props.classes.button}`}
                    onClick={() => {
                      this.openTour();
                    }}
                    size="large"
                  >
                    <FontAwesomeIcon icon={faQuestionCircle} />
                  </IconButton>
                </Tooltip>
              ) : null}
              {isAssessment ? (
                <Tooltip title={"Start tour"} arrow>
                  <IconButton
                    color="inherit"
                    className={`openTour ${this.props.classes.button}`}
                    onClick={() => {
                      this.openTour();
                    }}
                    size="large"
                  >
                    <FontAwesomeIcon icon={faQuestionCircle} />
                  </IconButton>
                </Tooltip>
              ) : null}
              <Tour
                steps={isHome ? home() : assessment()}
                isOpen={this.state.isTourOpen}
                onRequestClose={() => {
                  this.closeTour();
                }}
              />
              {this.props.user ? (
                <div>
                  <IconButton
                    color="inherit"
                    onClick={(event) => {
                      this.setState({
                        anchorElUser: event.target,
                      });
                    }}
                    style={{ margin: "0 30px 0 0" }}
                    size="large"
                  >
                    <FontAwesomeIcon icon={faUser} />
                  </IconButton>
                  <Menu
                    anchorEl={this.state.anchorElUser}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "center",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "center",
                    }}
                    open={Boolean(this.state.anchorElUser)}
                    onClose={() => {
                      this.setState({
                        anchorElUser: null,
                      });
                    }}
                  >
                    <div
                      className=""
                      style={{
                        paddingLeft: "16px",
                        paddingRight: "16px",
                        paddingTop: "16px",
                      }}
                    >
                      <p
                        style={{
                          fontWeight: "bold",
                          margin: "0px",
                        }}
                      >
                        {this.props.user.name}
                      </p>
                      <p
                        style={{
                          marginTop: "0px",
                          color: "#696969",
                        }}
                      >
                        {this.props.user.email}
                      </p>
                    </div>
                    <hr
                      style={{
                        borderTop: "3px solid #bbb",
                        marginLeft: "5px",
                        marginRight: "5px",
                      }}
                    />
                    <MenuItem>
                      <Link
                        to={"/user"}
                        style={{
                          textDecoration: "none",
                          color: "black",
                        }}
                      >
                        {Blockly.Msg.navbar_account}
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link
                        to={"/settings"}
                        style={{
                          textDecoration: "none",
                          color: "black",
                        }}
                      >
                        {Blockly.Msg.navbar_settings}
                      </Link>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        this.props.logout();
                      }}
                    >
                      {Blockly.Msg.navbar_logout}
                    </MenuItem>
                  </Menu>
                </div>
              ) : (
                <Link
                  to={"/user/login"}
                  style={{
                    textDecoration: "none",
                    color: "white",
                  }}
                >
                  <IconButton
                    color="inherit"
                    style={{ margin: "0 30px 0 auto" }}
                  >
                    <FontAwesomeIcon icon={faUser} />
                  </IconButton>
                </Link>
              )}
            </div>
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
          <div
            style={{
              height: "50px",
              cursor: "pointer",
              color: "white",
              padding: "0 22px",
            }}
            className={this.props.classes.appBarColor}
            onClick={this.toggleDrawer}
          >
            <div
              style={{
                display: " table-cell",
                verticalAlign: "middle",
                height: "inherit",
                width: "0.1%",
              }}
            >
              <Typography variant="h6" style={{ display: "inline" }}>
                {Blockly.Msg.navbar_menu}
              </Typography>
              <div style={{ float: "right" }}>
                <FontAwesomeIcon icon={faChevronLeft} />
              </div>
            </div>
          </div>
          <List>
            {[
              {
                text: Blockly.Msg.navbar_blockly,
                icon: faPuzzlePiece,
                link: "/",
              },
              {
                text: Blockly.Msg.navbar_tutorials,
                icon: faChalkboardTeacher,
                link: "/tutorial",
              },
              {
                text: Blockly.Msg.navbar_tutorialbuilder,
                icon: faTools,
                link: "/tutorial/builder",
                restriction:
                  this.props.user &&
                  this.props.user.blocklyRole !== "user" &&
                  this.props.isAuthenticated,
              },
              {
                text: Blockly.Msg.navbar_gallery,
                icon: faLightbulb,
                link: "/gallery",
              },
              {
                text: Blockly.Msg.navbar_projects,
                icon: faLayerGroup,
                link: "/project",
                restriction: this.props.isAuthenticated,
              },
              {
                text: "Code Editor",
                icon: faCode,
                link: "/codeeditor",
              },
            ].map((item, index) => {
              if (
                item.restriction ||
                Object.keys(item).filter(
                  (attribute) => attribute === "restriction",
                ).length === 0
              ) {
                return (
                  <Link
                    to={item.link}
                    key={index}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    <ListItem button onClick={this.toggleDrawer}>
                      <ListItemIcon>
                        <FontAwesomeIcon icon={item.icon} />
                      </ListItemIcon>
                      {item.text === "Code Editor" ? (
                        <ListItemText primary={item.text} />
                      ) : (
                        <ListItemText primary={item.text} />
                      )}
                    </ListItem>
                  </Link>
                );
              } else {
                return null;
              }
            })}
          </List>
          <Divider
            classes={{ root: this.props.classes.appBarColor }}
            style={{ marginTop: "auto" }}
          />
          <List>
            {[
              {
                text: Blockly.Msg.navbar_login,
                icon: faSignInAlt,
                link: "/user/login",
                restriction: !this.props.isAuthenticated,
              },
              {
                text: Blockly.Msg.navbar_account,
                icon: faUserCircle,
                link: "/user",
                restriction: this.props.isAuthenticated,
              },
              {
                text: Blockly.Msg.navbar_logout,
                icon: faSignOutAlt,
                function: this.props.logout,
                restriction: this.props.isAuthenticated,
              },
              {
                text: "FAQ",
                icon: faQuestionCircle,
                link: "/faq",
              },
              {
                text: Blockly.Msg.navbar_settings,
                icon: faCog,
                link: "/settings",
              },
            ].map((item, index) => {
              if (
                item.restriction ||
                Object.keys(item).filter(
                  (attribute) => attribute === "restriction",
                ).length === 0
              ) {
                return (
                  <Link
                    to={item.link}
                    key={index}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    <ListItem
                      button
                      onClick={
                        item.function
                          ? () => {
                              item.function();
                              this.toggleDrawer();
                            }
                          : this.toggleDrawer
                      }
                    >
                      <ListItemIcon>
                        <FontAwesomeIcon icon={item.icon} />
                      </ListItemIcon>
                      <ListItemText primary={item.text} />
                    </ListItem>
                  </Link>
                );
              } else {
                return null;
              }
            })}
          </List>
        </Drawer>
        {this.props.tutorialIsLoading || this.props.projectIsLoading ? (
          <LinearProgress
            style={{
              marginBottom: "30px",
              boxShadow:
                "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
            }}
          />
        ) : null}
      </div>
    );
  }
}

Navbar.propTypes = {
  tutorialIsLoading: PropTypes.bool.isRequired,
  projectIsLoading: PropTypes.bool.isRequired,
  isAuthenticated: PropTypes.bool,
  user: PropTypes.object,
  tutorial: PropTypes.object,
  activeStep: PropTypes.number.isRequired,
  setLanguage: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  setBoard: PropTypes.func.isRequired,
  selectedBoard: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  tutorialIsLoading: state.tutorial.progress,
  projectIsLoading: state.project.progress,
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  tutorial: state.tutorial.tutorials[0],
  activeStep: state.tutorial.activeStep,
  language: state.general.language,
  selectedBoard: state.board.board,
});

export default connect(mapStateToProps, { logout, setLanguage, setBoard })(
  withStyles(styles, { withTheme: true })(withRouter(Navbar)),
);
