import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, withRouter } from "react-router-dom";
import { logout } from "../actions/authActions";
import senseboxLogo from "@/sensebox_logo.svg";

import { makeStyles } from "@mui/styles";
import {
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";

import Tour from "reactour";
import { home, assessment } from "./Tour";

import * as Blockly from "blockly";
import Tooltip from "@mui/material/Tooltip";

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

import { setLanguage } from "../actions/generalActions";
import { setBoard } from "../actions/boardAction";
import { De } from "./Blockly/msg/de";
import { En } from "./Blockly/msg/en";

const useStyles = makeStyles((theme) => ({
  drawerWidth: {
    width: window.innerWidth < 600 ? "100%" : "240px",
    borderRight: `1px solid ${theme.palette.primary.main}`,
  },
  appBarColor: {
    backgroundColor: theme.palette.primary.main,
  },
  tourButton: {
    marginLeft: "auto",
    marginRight: "30px",
  },
}));

const Navbar = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const location = useLocation();

  // Redux state
  const tutorialIsLoading = useSelector((s) => s.tutorial.progress);
  const projectIsLoading = useSelector((s) => s.project.progress);
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);
  const user = useSelector((s) => s.auth.user);
  const tutorial = useSelector((s) => s.tutorial.tutorials[0]);
  const activeStep = useSelector((s) => s.tutorial.activeStep);
  const language = useSelector((s) => s.general.language);
  const selectedBoard = useSelector((s) => s.board.board);

  // Local state
  const [open, setOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const langRef = useRef(null);
  const mcuRef = useRef(null);
  const [anchorElLang, setAnchorElLang] = useState(null);
  const [anchorElBoard, setAnchorElBoard] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  // on mount: handle ?tour
  useEffect(() => {
    const tour = new URLSearchParams(location.search).get("tour");
    if (tour) setIsTourOpen(true);
  }, [location.search]);

  const toggleDrawer = () => setOpen((o) => !o);
  const openTour = () => setIsTourOpen(true);
  const closeTour = () => setIsTourOpen(false);

  const handleLangOpen = () => setAnchorElLang(langRef.current);
  const handleLangClose = () => setAnchorElLang(null);
  const handleBoardOpen = () => setAnchorElBoard(mcuRef.current);
  const handleBoardClose = () => setAnchorElBoard(null);
  const handleUserOpen = (e) => setAnchorElUser(e.currentTarget);
  const handleUserClose = () => setAnchorElUser(null);

  const changeLanguage = (val) => {
    dispatch(setLanguage(val));
    if (val === "de_DE") {
      Blockly.setLocale(De);
    } else if (val === "en_US") {
      Blockly.setLocale(En);
    }
    handleLangClose();
  };
  const changeBoard = (val) => {
    dispatch(setBoard(val));
    handleBoardClose();
  };
  const handleLogout = () => {
    dispatch(logout());
    handleUserClose();
  };

  const isHome = location.pathname === "/";
  const isAssessment =
    /^\/tutorial\/.{1,}$/.test(location.pathname) &&
    !tutorialIsLoading &&
    tutorial?.steps[activeStep]?.type === "task";

  return (
    <div>
      <AppBar
        position="relative"
        classes={{ root: classes.appBarColor }}
        style={{
          height: "50px",
          marginBottom: tutorialIsLoading || projectIsLoading ? "0px" : "5px",
          boxShadow:
            tutorialIsLoading || projectIsLoading
              ? "none"
              : "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
        }}
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
            onClick={toggleDrawer}
            style={{ margin: "0 10px" }}
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
            {isHome && (
              <>
                <div style={{ padding: "12px" }}>
                  <Button
                    id="navbar-selected-board" // 👈 eindeutig für Cypress
                    ref={mcuRef}
                    onClick={handleBoardOpen}
                    startIcon={<FontAwesomeIcon icon={faMicrochip} />}
                    endIcon={<FontAwesomeIcon icon={faCaretDown} />}
                    sx={{
                      display: { xs: "none", sm: "none", md: "flex" },
                    }}
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
                  >
                    {selectedBoard === "MCU:MINI" ? "MCU:mini" : selectedBoard}
                  </Button>
                  <Menu
                    id="navbarBoardSelect"
                    anchorEl={anchorElBoard}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                    transformOrigin={{ vertical: "top", horizontal: "center" }}
                    open={Boolean(anchorElBoard)}
                    onClose={handleBoardClose}
                  >
                    {["MCU", "MCU:MINI", "MCU-S2"].map((b) => (
                      <MenuItem
                        key={b}
                        value={b}
                        onClick={() => changeBoard(b)}
                      >
                        {b === "MCU:MINI" ? "MCU:mini" : b}
                      </MenuItem>
                    ))}
                  </Menu>
                </div>

                <div style={{ padding: "12px" }}>
                  <Button
                    ref={langRef}
                    onClick={handleLangOpen}
                    id="navbar-language-select"
                    startIcon={
                      <FontAwesomeIcon
                        icon={
                          language === "en_US" ? faEarthAmericas : faEarthEurope
                        }
                      />
                    }
                    endIcon={<FontAwesomeIcon icon={faCaretDown} />}
                    sx={{
                      display: { xs: "none", sm: "none", md: "flex" },
                    }}
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
                  >
                    {language === "en_US" ? "English" : "Deutsch"}
                  </Button>
                  <Menu
                    anchorEl={anchorElLang}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                    transformOrigin={{ vertical: "top", horizontal: "center" }}
                    open={Boolean(anchorElLang)}
                    onClose={handleLangClose}
                  >
                    <MenuItem
                      id="navbar-language-select-de"
                      onClick={() => changeLanguage("de_DE")}
                    >
                      Deutsch
                    </MenuItem>
                    <MenuItem
                      id="navbar-language-select-en"
                      onClick={() => changeLanguage("en_US")}
                    >
                      English
                    </MenuItem>
                  </Menu>
                </div>
              </>
            )}

            {(isHome || isAssessment) && (
              <Tooltip title={"Start Tour"} arrow>
                <IconButton
                  color="inherit"
                  onClick={openTour}
                  className={classes.tourButton}
                  size="large"
                >
                  <FontAwesomeIcon icon={faQuestionCircle} />
                </IconButton>
              </Tooltip>
            )}

            {user ? (
              <>
                <IconButton
                  color="inherit"
                  onClick={handleUserOpen}
                  style={{ margin: "0 30px 0 0" }}
                  size="large"
                >
                  <FontAwesomeIcon icon={faUser} />
                </IconButton>
                <Menu
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleUserClose}
                >
                  <div
                    style={{
                      paddingLeft: "16px",
                      paddingRight: "16px",
                      paddingTop: "16px",
                    }}
                  >
                    <p style={{ fontWeight: "bold", margin: 0 }}>{user.name}</p>
                    <p style={{ marginTop: 0, color: "#696969" }}>
                      {user.email}
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
                      style={{ textDecoration: "none", color: "black" }}
                    >
                      {Blockly.Msg.navbar_account}
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link
                      to={"/settings"}
                      style={{ textDecoration: "none", color: "black" }}
                    >
                      {Blockly.Msg.navbar_settings}
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    {Blockly.Msg.navbar_logout}
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Link
                to={"/user/login"}
                style={{ textDecoration: "none", color: "white" }}
              >
                <IconButton
                  color="inherit"
                  size="large"
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
        onClose={toggleDrawer}
        open={open}
        classes={{ paper: classes.drawerWidth }}
        ModalProps={{ keepMounted: true }}
      >
        <div
          className={classes.appBarColor}
          style={{
            height: "50px",
            cursor: "pointer",
            color: "white",
            padding: "0 22px",
          }}
          onClick={toggleDrawer}
        >
          <div
            style={{
              display: "table-cell",
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
              restriction: user,
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
              restriction: isAuthenticated,
            },
            { text: "Code Editor", icon: faCode, link: "/codeeditor" },
          ].map((item, i) =>
            item.restriction || !("restriction" in item) ? (
              <Link
                to={item.link}
                key={i}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItem button onClick={toggleDrawer}>
                  <ListItemIcon>
                    <FontAwesomeIcon icon={item.icon} />
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              </Link>
            ) : null,
          )}
        </List>

        <Divider
          classes={{ root: classes.appBarColor }}
          style={{ marginTop: "auto" }}
        />

        <List>
          {[
            {
              text: Blockly.Msg.navbar_login,
              icon: faSignInAlt,
              link: "/user/login",
              restriction: !isAuthenticated,
            },
            {
              text: Blockly.Msg.navbar_account,
              icon: faUserCircle,
              link: "/user",
              restriction: isAuthenticated,
            },
            {
              text: Blockly.Msg.navbar_logout,
              icon: faSignOutAlt,
              action: handleLogout,
              restriction: isAuthenticated,
            },
            { text: "FAQ", icon: faQuestionCircle, link: "/faq" },
            {
              text: Blockly.Msg.navbar_settings,
              icon: faCog,
              link: "/settings",
            },
          ].map((item, i) =>
            item.restriction || !("restriction" in item) ? (
              <Link
                to={item.link || "#"}
                key={i}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItem
                  button
                  onClick={() => {
                    if (item.action) item.action();
                    toggleDrawer();
                  }}
                >
                  <ListItemIcon>
                    <FontAwesomeIcon icon={item.icon} />
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              </Link>
            ) : null,
          )}
        </List>
      </Drawer>
      <Tour
        steps={isHome ? home() : assessment()}
        isOpen={isTourOpen}
        onRequestClose={closeTour}
      />
    </div>
  );
};

Navbar.propTypes = {
  tutorialIsLoading: PropTypes.bool,
  projectIsLoading: PropTypes.bool,
  isAuthenticated: PropTypes.bool,
  user: PropTypes.object,
  language: PropTypes.string,
  selectedBoard: PropTypes.string,
};

export default withRouter(Navbar);
