import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { checkError } from '../../../actions/tutorialBuilderActions';

import { saveAs } from 'file-saver';

import { detectWhitespacesAndReturnReadableResult } from '../../../helpers/whitespace';

import Breadcrumbs from '../../Breadcrumbs';
import Id from './Id';
import Title from './Textfield';
import Step from './Step';

import Button from '@material-ui/core/Button';

class Builder extends Component {

  submit = () => {
    var isError = this.props.checkError();
    if(isError){
      alert('Error');
    }
    else{
      var tutorial = {
        id: this.props.id,
        title: this.props.title,
        steps: this.props.steps
      }
      var blob = new Blob([JSON.stringify(tutorial)], { type: 'text/json' });
      saveAs(blob, `${detectWhitespacesAndReturnReadableResult(tutorial.title)}.json`);
    }
  }


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


        <Button variant='contained' color='primary' onClick={() => this.submit()}>Tutorial-Vorlage erstellen</Button>


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
