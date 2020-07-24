import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


class CodeViewer extends Component {

  render() {
    return (
      <div style={{height: '500px', border: '1px solid black'}}>
        {this.props.arduino}
        <p>{this.props.xml}</p>
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
