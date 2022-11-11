import React, { Component } from "react";

import Breadcrumbs from "./Breadcrumbs";

import { withRouter } from "react-router-dom";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import * as Blockly from "blockly";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import Container from "@material-ui/core/Container";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FaqQuestions } from "../data/faq";

class Faq extends Component {
  state = {
    panel: "",
    expanded: false,
  };

  handleChange = (panel) => {
    this.setState({ panel: this.state.panel === panel ? "" : panel });
  };

  componentDidMount() {
    // Ensure that Blockly.setLocale is adopted in the component.
    // Otherwise, the text will not be displayed until the next update of the component.

    window.scrollTo(0, 0);
    this.forceUpdate();
  }

  render() {
    const { panel } = this.state;
    return (
      <div>
        <Breadcrumbs
          content={[{ link: this.props.location.pathname, title: "FAQ" }]}
        />
        <Container fixed>
          <div style={{ margin: "0px 24px 0px 24px" }}>
            <h1>FAQ</h1>
            {FaqQuestions().map((object, i) => {
              return (
                <ExpansionPanel
                  expanded={panel === `panel${i}`}
                  onChange={() => this.handleChange(`panel${i}`)}
                >
                  <ExpansionPanelSummary
                    expandIcon={<FontAwesomeIcon icon={faChevronDown} />}
                  >
                    <Typography variant="h6">{object.question}</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Typography>
                      <ReactMarkdown
                        className="news"
                        allowDangerousHtml="true"
                        children={object.answer}
                        rehypePlugins={[rehypeRaw]}
                      ></ReactMarkdown>
                    </Typography>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              );
            })}
            {this.props.button ? (
              <Button
                style={{ marginTop: "20px" }}
                variant="contained"
                color="primary"
                onClick={() => {
                  this.props.history.push(this.props.button.link);
                }}
              >
                {this.props.button.title}
              </Button>
            ) : (
              <Button
                style={{ marginTop: "20px" }}
                variant="contained"
                color="primary"
                onClick={() => {
                  this.props.history.push("/");
                }}
              >
                {Blockly.Msg.button_back}
              </Button>
            )}
          </div>
        </Container>
      </div>
    );
  }
}

export default withRouter(Faq);
