import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  getClassrooms,
  createClassroom,
  deleteClassroom,
} from "../../actions/classroomActions";

import Breadcrumbs from "../Breadcrumbs";
import Alert from "../Alert";

import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "../Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { IconButton } from "@mui/material";
import {
  faAt,
  faInfo,
  faRandom,
  faCode,
  faUserTag,
  faPlus,
  faUser,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createCustomId } from "mnemonic-id";
import InputAdornment from "@mui/material/InputAdornment";

export class ClassroomHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      classroom: {
        title: "",
        creator: this.props.user.email,
        classroomCode: "",
        description: "",
        students: [],
      },
    };
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  addDescription = (e) => {
    this.setState({
      classroom: {
        ...this.state.classroom,
        description: e.target.value,
      },
    });
  };

  addTitle = (e) => {
    console.log(e.target.value);
    this.setState({
      classroom: {
        ...this.state.classroom,
        title: e.target.value,
      },
    });
  };

  generateClassroomCode = () => {
    const classroomCode = createCustomId({
      subject: true,
      numberSuffix: 2,
      idSuffix: 3,
      delimiter: "-",
      capitalize: true,
    });
    this.setState({
      classroom: {
        ...this.state.classroom,
        classroomCode: classroomCode.toUpperCase(),
      },
    });
    console.log(JSON.stringify(this.state.classroom));
  };

  postClassroom = () => {
    console.log(this.state.classroom);
    this.props.createClassroom(this.state.classroom);
    this.handleClose();
  };

  componentDidMount() {
    this.props.getClassrooms();
    localStorage.setItem("classrooms", this.props.classrooms);
  }

  render() {
    const { user } = this.props;
    console.log(user);
    const { classrooms } = this.props;
    console.log(classrooms);
    return (
      <div>
        <Breadcrumbs content={[{ link: "/user", title: "Account" }]} />

        <h1>Account</h1>
        <Alert>
          Alle Angaben stammen von{" "}
          <Link color="primary" rel="noreferrer" href={``} underline="hover">
            openSenseMap
          </Link>{" "}
          und können dort verwaltet werden.
        </Alert>
        <Paper style={{ width: "max-content", maxWidth: "100%" }}>
          <List>
            <ListItem>
              <Tooltip title="Nutzername">
                <ListItemIcon>
                  <FontAwesomeIcon icon={faUser} />
                </ListItemIcon>
              </Tooltip>
              <ListItemText primary={`Name: ${user.name}`} />
            </ListItem>
            <ListItem>
              <Tooltip title="Email">
                <ListItemIcon>
                  <FontAwesomeIcon icon={faAt} />
                </ListItemIcon>
              </Tooltip>
              <ListItemText primary={`Email: ${user.email}`} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <FontAwesomeIcon icon={faUserTag} />
              </ListItemIcon>
              <ListItemText primary={`Userrolle: ${user.blocklyRole}`} />
            </ListItem>
          </List>
        </Paper>
        <Divider style={{ marginBottom: "16px", marginTop: "16px" }} />
        <div style={{ marginBottom: "8px" }}>
          {classrooms.length < 1 ? (
            <Typography>
              Du hast noch keinen Klassenraum erstellt. Erstelle einen
              Klassenraum, um deine SuS zu organisieren.
            </Typography>
          ) : (
            <Typography style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
              Du hast {classrooms.length}{" "}
              {classrooms.length === 1 ? "Klassenraum" : "Klassenräume"}{" "}
              erstellt:
            </Typography>
          )}
        </div>
        <Grid container spacing={2}>
          {classrooms.map((classroom, i) => {
            return (
              <Grid item xs={12} sm={6} md={4} xl={3} key={i}>
                <Paper>
                  <List>
                    <Link
                      el="noreferrer"
                      href={`/classroom/${classroom._id}`}
                      color="primary"
                      style={{ textDecoration: "none", color: "inherit" }}
                      underline="hover"
                    >
                      <ListItem>
                        <Typography
                          style={{ fontWeight: "bold", fontSize: "1.6rem" }}
                        >
                          {classroom.title}
                        </Typography>
                      </ListItem>
                    </Link>
                    <ListItem>
                      <Tooltip title="Nutzername">
                        <ListItemIcon>
                          <FontAwesomeIcon icon={faCode} />
                        </ListItemIcon>
                      </Tooltip>
                      <ListItemText
                        primary={`Klassencode: ${classroom.classroomCode}`}
                      />
                    </ListItem>
                    <ListItem>
                      <Tooltip title="Nutzername">
                        <ListItemIcon>
                          <FontAwesomeIcon icon={faUser} />
                        </ListItemIcon>
                      </Tooltip>
                      <ListItemText
                        primary={`Anzahl: ${classroom.students.length}`}
                      />
                    </ListItem>
                    <ListItem>
                      <Tooltip title="Nutzername">
                        <ListItemIcon>
                          <FontAwesomeIcon icon={faInfo} />
                        </ListItemIcon>
                      </Tooltip>
                      <ListItemText primary={`${classroom.description}`} />
                    </ListItem>
                    <ListItem>
                      <Tooltip title="Klassenraum löschen">
                        <IconButton
                          onClick={() =>
                            this.props.deleteClassroom(classroom._id)
                          }
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </IconButton>
                      </Tooltip>
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
            );
          })}
          <Grid item xs={12} sm={6} md={4} xl={3}>
            <Paper style={{ textAlign: "center", padding: "20px" }}>
              <Typography
                style={{
                  fontWeight: "bold",
                  fontSize: "1.6rem",
                  marginBottom: "20px",
                }}
              >
                Erstelle neuen Klassenraum
              </Typography>
              <Tooltip title="Modell">
                <IconButton
                  onClick={this.handleClickOpen}
                  style={{ fontSize: "4rem" }}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </IconButton>
              </Tooltip>
            </Paper>
            <Dialog
              open={this.state.open}
              keepMounted
              aria-describedby="alert-dialog-slide-description"
              onClose={() => {
                this.handleClose();
              }}
              maxWidth={"md"}
              fullWidth={true}
            >
              <DialogContent>
                <DialogContentText>
                  Erstellen jetzt einen neuen Klassenraum.
                </DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Name"
                  type="text"
                  fullWidth
                  variant="standard"
                  value={this.state.classroom.title}
                  onChange={(e) => this.addTitle(e)}
                />
                <TextField
                  margin="dense"
                  label="Beschreibung"
                  type="text"
                  fullWidth
                  variant="standard"
                  value={this.state.classroom.desription}
                  onChange={(e) => this.addDescription(e)}
                />
                <TextField
                  margin="dense"
                  label="Classroom Code"
                  disabled={true}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={this.generateClassroomCode}
                          edge="end"
                          size="large"
                        >
                          <FontAwesomeIcon size="xs" icon={faRandom} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  type="text"
                  fullWidth
                  variant="standard"
                  value={this.state.classroom.classroomCode}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={this.postClassroom} color="primary">
                  Erstellen
                </Button>
                <Button
                  onClick={() => {
                    this.handleClose();
                  }}
                >
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>
        </Grid>
      </div>
    );
  }
}

ClassroomHome.propTypes = {
  user: PropTypes.object.isRequired,
  classrooms: PropTypes.array.isRequired,
  getClassrooms: PropTypes.func.isRequired,
  createClassroom: PropTypes.func.isRequired,
  deleteClassroom: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.auth?.user,
  classrooms: state.classroom?.classrooms,
});

export default connect(mapStateToProps, {
  getClassrooms,
  createClassroom,
  deleteClassroom,
})(ClassroomHome);
