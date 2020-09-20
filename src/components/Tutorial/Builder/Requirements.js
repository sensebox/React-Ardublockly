import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { changeContent } from '../../../actions/tutorialBuilderActions';

import tutorials from '../tutorials.json';

import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';

class Requirements extends Component {

  onChange = (e) => {
    var requirements = this.props.value;
    var value = parseInt(e.target.value)
    if(e.target.checked){
      requirements.push(value);
    }
    else {
      requirements = requirements.filter(requirement => requirement !== value);
    }
    this.props.changeContent(this.props.index, 'requirements', requirements);
  }

  render() {
    return (
      <FormControl style={{marginBottom: '10px', padding: '18.5px 14px', borderRadius: '25px', border: '1px solid lightgrey', width: 'calc(100% - 28px)'}}>
        <FormLabel style={{color: 'black'}}>Voraussetzungen</FormLabel>
        <FormHelperText style={{marginTop: '5px'}}>Beachte, dass die Reihenfolge des Anhakens maßgebend ist.</FormHelperText>
        <FormGroup>
          {tutorials.map((tutorial, i) =>
            <FormControlLabel
              key={i}
              control={
                <Checkbox
                  value={tutorial.id}
                  checked={this.props.value.filter(id => id === tutorial.id).length > 0}
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
  changeContent: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  change: state.builder.change
});

export default connect(mapStateToProps, { changeContent })(Requirements);
