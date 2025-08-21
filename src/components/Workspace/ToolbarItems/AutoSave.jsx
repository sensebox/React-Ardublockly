import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { workspaceName } from "../../../actions/workspaceActions";
import SaveIcon from "@/components/Pages/CodeEditor/SaveIcon";

const resetTimeout = (id, newID) => {
  clearTimeout(id);
  return newID;
};

class AutoSave extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeout: null,
      value: "",
      saved: false,
      autosave: false,
    };
  }

  editValue = (value) => {
    this.setState({
      timeout: resetTimeout(
        this.state.timeout,
        setTimeout(this.saveValue, 400),
      ),
      value: value,
    });
  };

  saveValue = () => {
    this.setState({ ...this.state, saved: true });
    localStorage.setItem("autoSaveXML", this.props.xml);
    setTimeout(() => this.setState({ ...this.state, saved: false }), 1000);
  };

  componentDidMount() {}

  componentDidUpdate(prevProps) {
    if (prevProps.xml !== this.props.xml) {
      this.editValue(this.props.xml);
    }
  }

  render() {
    return (
      <div>
        <SaveIcon loading={this.state.saved} />
      </div>
    );
  }
}

AutoSave.propTypes = {
  xml: PropTypes.string.isRequired,
  name: PropTypes.string,
  workspaceName: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  xml: state.workspace.code.xml,
  name: state.workspace.name,
});

export default connect(mapStateToProps, { workspaceName })(AutoSave);
