import React, { Component } from "react";

import Breadcrumbs from "@/components/ui/Breadcrumbs";

import { withRouter } from "react-router-dom";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import * as Blockly from "blockly";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import Container from "@mui/material/Container";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FaqQuestions } from "../../data/faq";

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
                <Accordion
                  expanded={panel === `panel${i}`}
                  onChange={() => this.handleChange(`panel${i}`)}
                >
                  <AccordionSummary
                    expandIcon={<FontAwesomeIcon icon={faChevronDown} />}
                  >
                    <Typography variant="h6">{object.question}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      <ReactMarkdown
                        children={object.answer}
                        rehypePlugins={[rehypeRaw]}
                      ></ReactMarkdown>
                    </Typography>
                  </AccordionDetails>
                </Accordion>
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
