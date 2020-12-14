import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { changeContent } from '../../../actions/tutorialBuilderActions';

import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import * as Blockly from 'blockly'
class Requirements extends Component {

  onChange = (e) => {
    var requirements = this.props.value;
    var value = e.target.value;
    if (e.target.checked) {
      requirements.push(value);
    }
    else {
      requirements = requirements.filter(requirement => requirement !== value);
    }
    this.props.changeContent(requirements, this.props.index, 'requirements');
  }

  render() {
    return (
      <FormControl style={{ marginBottom: '10px', padding: '18.5px 14px', borderRadius: '25px', border: '1px solid lightgrey', width: 'calc(100% - 28px)' }}>
        <FormLabel style={{ color: 'black' }}>{Blockly.Msg.builder_requirements_head}</FormLabel>
        <FormHelperText style={{ marginTop: '5px' }}>{Blockly.Msg.builder_requirements_order}</FormHelperText>
        <FormGroup>
          {this.props.tutorials.filter(tutorial => tutorial._id !== this.props.id).map((tutorial, i) =>
            <FormControlLabel
              key={i}
              control={
                <Checkbox
                  value={tutorial._id}
                  checked={this.props.value.filter(id => id === tutorial._id).length > 0}
                  onChange={(e) => this.onChange(e)}
                  name="requirements"
                  color="primary"
                />
              }
              label={tutorial.title}
            />
          )}
        </FormGroup>
      </FormControl>
    );
  };
}

Requirements.propTypes = {
  changeContent: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  tutorials: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  change: state.builder.change,
  id: state.builder.id,
  tutorials: state.tutorial.tutorials
});

export default connect(mapStateToProps, { changeContent })(Requirements);
