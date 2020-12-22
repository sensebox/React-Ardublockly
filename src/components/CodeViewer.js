import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Prism from "prismjs";
import "prismjs/themes/prism.css";
import "prismjs/plugins/line-numbers/prism-line-numbers";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";

import withWidth from '@material-ui/core/withWidth';
import { withStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import { Card } from '@material-ui/core';
import * as Blockly from 'blockly'


const Accordion = withStyles((theme) => ({
  root: {
    border: `1px solid ${theme.palette.secondary.main}`,
    boxShadow: 'none',
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
}))(MuiAccordion);

const AccordionSummary = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.secondary.main,
    borderBottom: `1px solid white`,
    marginBottom: '-1px',
    minHeight: '50px',
    '&$expanded': {
      minHeight: '50px',
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
}))(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiAccordionDetails);


class CodeViewer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      expanded: true,
      componentHeight: null
    };
    this.myDiv = React.createRef();
  }

  componentDidMount() {
    Prism.highlightAll();
    this.setState({ componentHeight: this.myDiv.current.offsetHeight + 'px' });
  }

  componentDidUpdate(props, state) {
    if (this.myDiv.current && this.myDiv.current.offsetHeight + 'px' !== this.state.componentHeight) {
      this.setState({ componentHeight: this.myDiv.current.offsetHeight + 'px' });
    }
    Prism.highlightAll();
  }

  onChange = () => {
    this.setState({ expanded: !this.state.expanded });

  }

  render() {
    var curlyBrackets = '{ }';
    var unequal = '<>';
    return (
      <Card style={{ height: '100%', maxHeight: '60vH' }} ref={this.myDiv}>
        <Accordion
          square={true}
          style={{ margin: 0 }}
          expanded={this.state.expanded}
          onChange={this.onChange}
        >
          <AccordionSummary>
            <b style={{ fontSize: '20px', marginRight: '5px', width: '35px' }}>{curlyBrackets}</b>
            <div style={{ margin: 'auto 5px 2px 0px' }}>{Blockly.Msg.codeviewer_arduino}</div>
          </AccordionSummary>
          <AccordionDetails style={{ padding: 0, height: `calc(${this.state.componentHeight} - 50px - 50px)`, backgroundColor: 'white' }}>
            <pre className="line-numbers" style={{ paddingBottom: 0, width: '100%', overflow: 'auto', scrollbarWidth: 'thin', height: 'calc(100% - 30px)', margin: '15px 0', paddingTop: 0, whiteSpace: 'pre-wrap', backgroundColor: 'white' }}>
              <code className="language-clike">
                {this.props.arduino}
              </code>
            </pre>
          </AccordionDetails>
        </Accordion>
        <Accordion
          square={true}
          style={{ margin: 0 }}
          expanded={!this.state.expanded}
          onChange={this.onChange}
        >
          <AccordionSummary>
            <b style={{ fontSize: '20px', marginRight: '5px', width: '35px' }}>{unequal}</b>
            <div style={{ margin: 'auto 5px 2px 0px' }}>{Blockly.Msg.codeviewer_xml}</div>
          </AccordionSummary>
          <AccordionDetails style={{ padding: 0, height: `calc(${this.state.componentHeight} - 50px - 50px)`, backgroundColor: 'white' }}>
            <pre className="line-numbers" style={{ paddingBottom: 0, width: '100%', overflow: 'auto', scrollbarWidth: 'thin', height: 'calc(100% - 30px)', margin: '15px 0', paddingTop: 0, whiteSpace: 'pre-wrap', backgroundColor: 'white' }}>
              <code className="language-xml">
                {`${this.props.xml}`}
              </code>
            </pre>
          </AccordionDetails>
        </Accordion>
      </Card>
    );
  };
}

CodeViewer.propTypes = {
  arduino: PropTypes.string.isRequired,
  xml: PropTypes.string.isRequired,
  tooltip: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  arduino: state.workspace.code.arduino,
  xml: state.workspace.code.xml,
  tooltip: state.workspace.code.tooltip
});

export default connect(mapStateToProps, null)(withWidth()(CodeViewer));
