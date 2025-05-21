import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import api from "../../utils/axiosConfig";
import { withRouter } from "react-router-dom"; // To handle redirects
import Breadcrumbs from "../Breadcrumbs";
import Alert from "../Alert";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Link from "@mui/material/Link";

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: props.user || null, // Set initial user data from props if available
      loading: !props.user, // Only set loading to true if there's no user in Redux
      error: null,
    };
  }

  componentDidMount() {
    if (!this.state.userData) {
      api
        .get("http://localhost:8080/user/")
        .then((response) => {
          this.setState({ userData: response.data.user, loading: false });
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          // No token removal or redirect here — handled in interceptor
          this.setState({ error: "Failed to load user data", loading: false });
        });
    }
  }

  render() {
    const { userData, loading, error } = this.state;
    const { classroomUser } = this.props;

    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>{error}</div>;
    }

    return (
      <div>
        <Breadcrumbs content={[{ link: "/user", title: "Account" }]} />

        <h1>Account</h1>

        {userData.accountType === "osem" && (
          <Alert>
            Your information is managed by{" "}
            <Link
              color="primary"
              rel="noreferrer"
              target="_blank"
              href={"https://opensensemap.org/"}
              underline="hover"
            >
              openSenseMap
            </Link>{" "}
            and can be managed there.
          </Alert>
        )}

        {classroomUser && <Alert>Classroom User</Alert>}

        <Paper style={{ width: "max-content", maxWidth: "100%" }}>
          <List>
            <ListItem>
              <Tooltip title="Username">
                <ListItemIcon>
                  <FontAwesomeIcon icon={faUser} />
                </ListItemIcon>
              </Tooltip>
              {userData ? (
                <div>
                  <ListItemText primary={`Name: ${userData.email}`} />
                  <ListItemText
                    primary={`Account Type: ${userData.accountType}`}
                  />
                  <ListItemText primary={`User ID: ${userData._id}`} />
                </div>
              ) : classroomUser ? (
                <ListItemText primary={`Name: ${classroomUser.name}`} />
              ) : null}
            </ListItem>
          </List>
        </Paper>
      </div>
    );
  }
}

Account.propTypes = {
  user: PropTypes.object, // From Redux
  classroomUser: PropTypes.object, // From Redux (if applicable)
  history: PropTypes.object.isRequired, // From withRouter
};

const mapStateToProps = (state) => ({
  user: state.auth.user, // Redux state for logged-in user
  classroomUser: state.classroomAuth.classroomUser, // Redux state for classroom users, if any
});

export default connect(mapStateToProps)(withRouter(Account));
