import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Prism from "prismjs";
import "prismjs/themes/prism.css";
import "prismjs/plugins/line-numbers/prism-line-numbers";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";


class CodeViewer extends Component {

  componentDidMount() {
    Prism.highlightAll();
  }

  componentDidUpdate() {
    Prism.highlightAll();
  }

  render() {
    return (
      <div style={{height: '500px', border: '1px solid black', overflow: 'auto', scrollbarWidth: 'thin'}}>
        <pre className="line-numbers" style={{whiteSpace: 'pre-wrap', backgroundColor: 'white'}}>
          <code className="language-clike">
            {this.props.arduino}
          </code>
        </pre>
        <pre className="line-numbers" style={{whiteSpace: 'pre-wrap', backgroundColor: 'white'}}>
          <code className="language-xml">
            {`${this.props.xml}`}
          </code>
        </pre>
      </div>
    );
  };
}

CodeViewer.propTypes = {
  arduino: PropTypes.string.isRequired,
  xml: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  arduino: state.workspace.code.arduino,
  xml: state.workspace.code.xml
});

export default connect(mapStateToProps, null)(CodeViewer);
