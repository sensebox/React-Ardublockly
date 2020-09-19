import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { checkError } from '../../../actions/tutorialBuilderActions';

import Breadcrumbs from '../../Breadcrumbs';
import Id from './Id';
import Title from './Textfield';
import Step from './Step';

import Button from '@material-ui/core/Button';

class Builder extends Component {


  render() {
    return (
      <div>
        <Breadcrumbs content={[{link: '/', title: 'Home'},{link: '/tutorial', title: 'Tutorial'}, {link: '/tutorial/builder', title: 'Builder'}]}/>

        <h1>Tutorial-Builder</h1>

        <Id error={this.props.error} value={this.props.id}/>
        <Title value={this.props.title} property={'title'} label={'Titel'} error={this.props.error}/>

        {this.props.steps.map((step, i) =>
          <Step step={step} index={i} />

        )}


        <Button variant='contained' color='primary' onClick={() => {var error = this.props.checkError(); alert(error);}}>Tutorial-Vorlage erstellen</Button>


      </div>
      /*<div style={{borderRadius: '25px', background: 'yellow', textAlign: 'center'}}>
        <Typography variant='h4'>Tutorial-Builder</Typography>
      </div>
      */
    );
  };
}

Builder.propTypes = {
  checkError: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  steps: PropTypes.array.isRequired,
  change: PropTypes.number.isRequired,
  error: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  title: state.builder.title,
  id: state.builder.id,
  steps: state.builder.steps,
  change: state.builder.change,
  error: state.builder.error
});

export default connect(mapStateToProps, { checkError })(Builder);
