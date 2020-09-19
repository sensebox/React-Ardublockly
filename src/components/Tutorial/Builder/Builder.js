import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { checkError, readJSON, progress, resetTutorial } from '../../../actions/tutorialBuilderActions';

import { saveAs } from 'file-saver';

import data from '../../../data/hardware.json';
import { detectWhitespacesAndReturnReadableResult } from '../../../helpers/whitespace';

import Breadcrumbs from '../../Breadcrumbs';
import Id from './Id';
import Title from './Textfield';
import Step from './Step';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';

const styles = (theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  }
});

class Builder extends Component {

  constructor(props){
    super(props);
    this.inputRef = React.createRef();
  }

  submit = () => {
    var isError = this.props.checkError();
    if(isError){
      window.scrollTo(0, 0);
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

  reset = () => {
    this.props.resetTutorial();
    window.scrollTo(0, 0);
  }

  uploadJsonFile = (jsonFile) => {
    this.props.progress(true);
    if(jsonFile.type !== 'application/json'){
      alert('falscher Dateityp');
      this.props.progress(false);
      this.setState({ open: true, file: false, title: 'Unzulässiger Dateityp', content: 'Die übergebene Datei entsprach nicht dem geforderten Format. Es sind nur JSON-Dateien zulässig.' });
    }
    else {
      var reader = new FileReader();
      reader.readAsText(jsonFile);
      reader.onloadend = () => {
        try {
          var result = JSON.parse(reader.result);
          if(this.checkSteps(result.steps)){
            alert('Hier');
            this.props.readJSON(result);
          }
          else{
            this.props.progress(false);
            alert('die JSON-Datei hat nicht die richtige Form');
          }
        } catch(err){
          this.props.progress(false);
          alert('ungültige JSON-Datei');
          this.setState({ open: true, file: false, title: 'Ungültige XML', content: 'Die XML-Datei konnte nicht in Blöcke zerlegt werden. Bitte überprüfe den XML-Code und versuche es erneut.' });
        }
      };
    }
  }

  checkSteps = (steps) => {
    if(!(steps && steps.length > 0)){
      alert(1);
      return false;
    }
    steps.map((step, i) => {
      if(i === 0){
        if(!(step.requirements &&
             step.requirements.length > 0 &&
             step.requirements.filter(requirement => typeof(requirement) === 'number').length === step.requirements.length)){
          alert(3);
          return false;
        }
        var hardwareIds = data.map(hardware => hardware.id);
        if(!(step.hardware &&
             step.hardware.length > 0 &&
             step.hardware.filter(hardware => typeof(hardware) === 'string' && hardwareIds.includes(hardware)).length === step.hardware.length)){
          alert(4);
          return false;
        }
      }
      if(!(step.headline && typeof(step.headline)==='string')){
        alert(5);
        return false;
      }
      if(!(step.text && typeof(step.text)==='string')){
        alert(6);
        return false;
      }
    });
    return true;
  }


  render() {
    return (
      <div>
        <Breadcrumbs content={[{link: '/', title: 'Home'},{link: '/tutorial', title: 'Tutorial'}, {link: '/tutorial/builder', title: 'Builder'}]}/>

        <h1>Tutorial-Builder</h1>

        <div ref={this.inputRef}>
          <input
            style={{display: 'none'}}
            accept="application/json"
            onChange={(e) => {this.uploadJsonFile(e.target.files[0])}}
            id="open-json"
            type="file"
          />
          <label htmlFor="open-json">
            <Button component="span" style={{marginRight: '10px', marginBottom: '10px'}} variant='contained' color='primary'>Datei laden</Button>
          </label>
        </div>
        <Divider variant='fullWidth' style={{margin: '10px 0 30px 0'}}/>

        <Id error={this.props.error} value={this.props.id}/>
        <Title value={this.props.title} property={'title'} label={'Titel'} error={this.props.error}/>

        {this.props.steps.map((step, i) =>
          <Step step={step} index={i} />

        )}


        <Button style={{marginRight: '10px'}} variant='contained' color='primary' onClick={() => this.submit()}>Tutorial-Vorlage erstellen</Button>
        <Button variant='contained' onClick={() => this.reset()}>Zurücksetzen</Button>
        <Backdrop className={this.props.classes.backdrop} open={this.props.isProgress}>
          <CircularProgress color="inherit" />
        </Backdrop>


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
  readJSON: PropTypes.func.isRequired,
  progress: PropTypes.func.isRequired,
  resetTutorial: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  steps: PropTypes.array.isRequired,
  change: PropTypes.number.isRequired,
  error: PropTypes.object.isRequired,
  isProgress: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  title: state.builder.title,
  id: state.builder.id,
  steps: state.builder.steps,
  change: state.builder.change,
  error: state.builder.error,
  isProgress: state.builder.progress
});

export default connect(mapStateToProps, { checkError, readJSON, progress, resetTutorial })(withStyles(styles, {withTheme: true})(Builder));
