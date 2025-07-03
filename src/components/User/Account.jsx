import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";
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
    // Check if the user is a social login user
    const isSocialAccount = localStorage.getItem("isSocialAccount") === "true";

    // If the user data is already available in Redux or the user is a social user, avoid fetching again
    if (isSocialAccount && this.state.userData) {
      console.log("Social login user detected, no need to fetch user data.");
      this.setState({ loading: false });
      return;
    }

    // If the user is not a social login user and no user data is available, fetch user data
    if (!this.state.userData) {
      const token = localStorage.getItem("token");

      if (token) {
        // Fetch user data from backend if not already available
        axios
          .get("http://localhost:8080/user/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            this.setState({ userData: response.data.user, loading: false });
          })
          .catch((error) => {
            console.error("Error fetching user data:", error);
            this.setState({ error: "Failed to load user data", loading: false });
            localStorage.removeItem("token");

            // Redirect to login page on error (e.g., token expired or invalid)
            this.props.history.push("/user/login");
          });
      } else {
        this.setState({ error: "No token found", loading: false });
        this.props.history.push("/user/login"); // Redirect if no token is found
      }
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

        {userData && (
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
                <ListItemText primary={`Name: ${userData.email}`} />
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
