import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { workspaceName } from "@/actions/workspaceActions";
import { getProject, resetProject } from "@/actions/projectActions";
import { clearMessages, returnErrors } from "@/actions/messageActions";

import { withRouter } from "react-router-dom";

import Home from "@/components/Pages/Home";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

class Project extends Component {
  componentDidMount() {
    this.props.resetProject();
    this.getProject();
  }

  componentDidUpdate(props) {
    if (
      props.location.pathname !== this.props.location.pathname ||
      props.match.params[`${this.props.type}Id`] !==
        this.props.match.params[`${this.props.type}Id`]
    ) {
      if (this.props.message.msg) {
        this.props.clearMessages();
      }
      this.getProject();
    }
    if (this.props.message !== props.message) {
      if (
        this.props.message.id === "PROJECT_EMPTY" ||
        this.props.message.id === "GET_PROJECT_FAIL"
      ) {
        if (this.props.type !== "share") {
          this.props.returnErrors("", 404, "GET_PROJECT_FAIL");
          this.props.history.push(`/${this.props.type}`);
        } else {
          this.props.history.push("/");
          this.props.returnErrors("", 404, "GET_SHARE_FAIL");
        }
      } else if (this.props.message.id === "GET_PROJECT_SUCCESS") {
        this.props.workspaceName(this.props.project.title);
      } else if (
        this.props.message.id === "PROJECT_DELETE_SUCCESS" ||
        this.props.message.id === "GALLERY_DELETE_SUCCESS"
      ) {
        this.props.history.push(`/${this.props.type}`);
      }
    }
  }

  componentWillUnmount() {
    this.props.resetProject();
    this.props.workspaceName(null);
  }

  getProject = () => {
    var id = this.props.location.pathname.replace(/\/[a-z]{1,}\//, "");
    var param = this.props.location.pathname
      .replace(`/${id}`, "")
      .replace("/", "");
    this.props.getProject(param, id);
  };

  render() {
    var data = this.props.type === "project" ? "Projekte" : "Galerie";
    return this.props.progress ? (
      <Backdrop open invisible>
        <CircularProgress color="primary" />
      </Backdrop>
    ) : this.props.project ? (
      <div>
        {this.props.type !== "share" ? (
          <Breadcrumbs
            content={[
              { link: `/${this.props.type}`, title: data },
              {
                link: this.props.location.pathname,
                title: this.props.project.title,
              },
            ]}
          />
        ) : null}
        <Home project={this.props.project} projectType={this.props.type} />
      </div>
    ) : null;
  }
}

Project.propTypes = {
  workspaceName: PropTypes.func.isRequired,
  getProject: PropTypes.func.isRequired,
  resetProject: PropTypes.func.isRequired,
  clearMessages: PropTypes.func.isRequired,
  returnErrors: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  message: PropTypes.object.isRequired,
  progress: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  project: state.project.projects[0],
  progress: state.project.progress,
  type: state.project.type,
  message: state.message,
});

export default connect(mapStateToProps, {
  workspaceName,
  getProject,
  resetProject,
  clearMessages,
  returnErrors,
})(withRouter(Project));
