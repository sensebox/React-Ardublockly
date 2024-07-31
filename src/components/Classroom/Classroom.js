import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addStudent, getClassroom, getClassrooms } from '../../actions/classroomActions';
import { withRouter } from "react-router-dom";
import Breadcrumbs from '../Breadcrumbs';
import StudentTable from './StudentTable';
import Dialog from "../Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Item from '@mui/material/Grid';
import ProjectList from './ProjectList';
import { Tabs, Tab, Typography } from '@mui/material';
import TabPanel from './TabPanel';



class Classroom extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      student: {
        name: '',
        nickname: '',
        projects: []
      },
      tabIndex: 0,
    };

  }

  toggleDialog = () => {
    this.setState({ open: !this.state.open });
  };

  handleNameChange = (event) => {
    this.setState({
      student: {
        ...this.state.student,
        name: event.target.value
      }
    });
  };

  handleNicknameChange = (event) => {
    this.setState({
      student: {
        ...this.state.student,
        nickname: event.target.value
      }
    });
    console.log(this.state.student);
  };

  submitStudent = () => {
    this.props.addStudent(this.props.classroom._id, this.state.student);
    this.toggleDialog();
    this.setState({
      student: {
        name: '',
        nickname: '',
        projects: []
      }
    });
  }

  handleTabChange = (event, newValue) => {
    this.setState({ tabIndex: newValue });
  };

  componentDidMount() {
    //  console.log(this.props.location.pathname.slice(11));
    //   console.log(this.props);
    //   this.props.getClassrooms();
    //   console.log(this.props.classrooms);
    //   this.props.getClassroom(this.props.location.pathname.slice(11));
    if (!this.props.progress) {
      console.log(this.props);
      this.props.getClassroom(this.props.location.pathname.slice(11));
    }
  }

  componentDidUpdate(prevProps) {
    console.log(this.props.message)
    const classroomId = this.props.location.pathname.slice(11);
    if (prevProps.message.id !== this.props.message.id) {
      if (this.props.message.id === "ADD_STUDENT_SUCCESS") {
        this.props.getClassroom(classroomId);
      }
    }
  }

  render() {
    const { classroom } = this.props;
    const sortedStudents = classroom?.students.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    //const projects = classroom?.students.flatMap(student => student.projects);
    const projects = classroom?.students.flatMap(student => 
      student.projects.map(project => ({ ...project, author: student.name }))
    );
    const { tabIndex } = this.state;
    const breadcrumbContent = [
      { title: 'Classroom', link: '/classroom' },
      { title: classroom?.title || 'Loading...', link: `/classroom/` },
    ];
    // console.log(classroom);
    return (
      <div>
        {classroom ? (
          <div>
            <Breadcrumbs content={breadcrumbContent} />
            <h1>Classroom {classroom.title}</h1>
            <Tabs value={tabIndex} onChange={this.handleTabChange}>
              <Tab label="Students" />
              <Tab label="Projects" />
              <Tab label="Settings" />
            </Tabs>
            <TabPanel value={tabIndex} index={0}>
              <h2>Students: {classroom.students.length}</h2>

              <Grid container spacing={2}>
                <Button
                  label="Mehr"
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    this.toggleDialog();
                  }}
                >
                  Add Student
                </Button>
                <Dialog
                  open={this.state.open}
                  keepMounted
                  aria-describedby="alert-dialog-slide-description"
                  onClose={() => {
                    this.toggleDialog();
                  }}
                  maxWidth={"md"}
                  fullWidth={true}
                >
                  <DialogContent>
                    <DialogContentText>
                      Bitte geben Sie den Namen und den Spitznamen des neuen Studenten ein.
                    </DialogContentText>
                    <TextField
                      autoFocus
                      margin="dense"
                      label="Name"
                      type="text"
                      fullWidth
                      variant="standard"
                      value={this.state.student.name}
                      onChange={(e) => this.handleNameChange(e)}
                    />
                    <TextField
                      margin="dense"
                      label="Spitzname"
                      type="text"
                      fullWidth
                      variant="standard"
                      value={this.state.student.nickname}
                      onChange={(e) => this.handleNicknameChange(e)}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={this.submitStudent} color="primary">Hinzufügen</Button>
                    <Button onClick={() => {
                      this.toggleDialog();
                    }}>Close</Button>
                  </DialogActions>
                </Dialog>
                <Grid item xs={12} sm={12} md={12} xl={12}>
                  <Item>
                    <StudentTable students={sortedStudents} classroomId={classroom._id} />
                  </Item>

                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
              <div>
                <ProjectList projects={projects} />
              </div>
            </TabPanel>
            <TabPanel value={tabIndex} index={2}>
              <Typography variant="h6">Settings</Typography>
              <p>Hier können die Einstellungen für das Klassenzimmer vorgenommen werden.</p>
            </TabPanel>


          </div>) : null}

      </div>
    );
  }
}

Classroom.propTypes = {
  getClassroom: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  classroom: PropTypes.object.isRequired,
  getClassrooms: PropTypes.func.isRequired,
  addStudent: PropTypes.func.isRequired,
  progress: PropTypes.bool.isRequired,
  message: PropTypes.object.isRequired,

};

const mapStateToProps = state => ({
  user: state.auth.user,
  classroom: state.classroom.classroom,
  classrooms: state.classroom.classrooms,
  progress: state.auth.progress,
  message: state.message
});

export default connect(mapStateToProps, { getClassroom, getClassrooms, addStudent })(withRouter(Classroom));
