import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import * as Blockly from "blockly/core";
import { De } from "./Blockly/msg/de";
import { En } from "./Blockly/msg/en";

import Navbar from "./Navbar";
import Footer from "./Footer";
import Routes from "./Route/Routes";
import Cookies from "./Cookies";
import { setBoard } from "./Blockly/helpers/board";

class Content extends Component {
  componentDidMount() {
    if (this.props.language === "de_DE") {
      Blockly.setLocale(De);
    } else if (this.props.language === "en_US") {
      Blockly.setLocale(En);
    }
    setBoard(this.props.board);
  }

  componentDidUpdate(props) {
    if (props.language !== this.props.language) {
      if (this.props.language === "de_DE") {
        Blockly.setLocale(De);
      } else if (this.props.language === "en_US") {
        Blockly.setLocale(En);
      }
    }
    setBoard(this.props.board);
  }

  render() {
    const { location } = this.props;
    if (location && location.pathname === "/minimal") {
      return <Routes />;
    }
    return (
      <div className="wrapper">
        <Navbar />
        <Routes />
        <Cookies />
        <Footer />
      </div>
    );
  }
}

Content.propTypes = {
  language: PropTypes.string.isRequired,
  minimal: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  language: state.general.language,
  board: state.board.board,
});

export default connect(mapStateToProps, null)(withRouter(Content));
