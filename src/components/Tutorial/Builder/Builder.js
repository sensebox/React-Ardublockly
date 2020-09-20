import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { checkError, readJSON, jsonString, progress, resetTutorial } from '../../../actions/tutorialBuilderActions';

import { saveAs } from 'file-saver';

import { detectWhitespacesAndReturnReadableResult } from '../../../helpers/whitespace';

import Breadcrumbs from '../../Breadcrumbs';
import Id from './Id';
import Textfield from './Textfield';
import Step from './Step';
import Dialog from '../../Dialog';

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
    this.state = {
      open: false,
      title: '',
      content: '',
      string: false
    };
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
      this.props.progress(false);
      this.setState({ open: true, string: false, title: 'Unzulässiger Dateityp', content: 'Die übergebene Datei entspricht nicht dem geforderten Format. Es sind nur JSON-Dateien zulässig.'});
    }
    else {
      var reader = new FileReader();
      reader.readAsText(jsonFile);
      reader.onloadend = () => {
        this.readJson(reader.result, true);
      };
    }
  }

  uploadJsonString = () => {
    this.setState({ open: true, string: true, title: 'JSON-String einfügen', content: ''});
  }

  readJson = (jsonString, isFile) => {
    try {
      var result = JSON.parse(jsonString);
      if(!this.checkSteps(result.steps)){
        result.steps = [{}];
      }
      this.props.readJSON(result);
    } catch(err){
      console.log(err);
      this.props.progress(false);
      this.props.jsonString('');
      this.setState({ open: true, string: false, title: 'Ungültiges JSON-Format', content: `${isFile ? 'Die übergebene Datei' : 'Der übergebene String'} enthält nicht valides JSON. Bitte überprüfe ${isFile ? 'die JSON-Datei' : 'den JSON-String'} und versuche es erneut.`});
    }
  }

  checkSteps = (steps) => {
    if(!(steps && steps.length > 0)){
      return false;
    }
    return true;
  }

  toggle = () => {
    this.setState({ open: !this.state });
  }


  render() {
    return (
      <div>
        <Breadcrumbs content={[{link: '/tutorial', title: 'Tutorial'}, {link: '/tutorial/builder', title: 'Builder'}]}/>

        <h1>Tutorial-Builder</h1>

        {/*upload JSON*/}
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
          <Button style={{marginRight: '10px', marginBottom: '10px'}} variant='contained' color='primary' onClick={() => this.uploadJsonString()}>String laden</Button>
        </div>
        <Divider variant='fullWidth' style={{margin: '10px 0 30px 0'}}/>

        {/*Tutorial-Builder-Form*/}
        <Id error={this.props.error.id} value={this.props.id}/>
        <Textfield value={this.props.title} property={'title'} label={'Titel'} error={this.props.error.title}/>

        {this.props.steps.map((step, i) =>
          <Step step={step} index={i} />
        )}

        {/*submit or reset*/}
        <Divider variant='fullWidth' style={{margin: '30px 0 10px 0'}}/>
        <Button style={{marginRight: '10px', marginTop: '10px'}} variant='contained' color='primary' onClick={() => this.submit()}>Tutorial-Vorlage erstellen</Button>
        <Button style={{marginTop: '10px'}} variant='contained' onClick={() => this.reset()}>Zurücksetzen</Button>

        <Backdrop className={this.props.classes.backdrop} open={this.props.isProgress}>
          <CircularProgress color="inherit" />
        </Backdrop>

        <Dialog
          open={this.state.open}
          maxWidth={this.state.string ? 'md' : 'sm'}
          fullWidth={this.state.string}
          title={this.state.title}
          content={this.state.content}
          onClose={this.toggle}
          onClick={this.toggle}
          button={'Schließen'}
          actions={
            this.state.string ?
            <div>
              <Button disabled={this.props.error.json || this.props.json === ''} variant='contained' onClick={() => {this.toggle(); this.props.progress(true); this.readJson(this.props.json, false);}} color="primary">Bestätigen</Button>
              <Button onClick={() => {this.toggle(); this.props.jsonString('');}} color="primary">Abbrechen</Button>
            </div>
            : null
          }
        >
          {this.state.string ?
            <Textfield value={this.props.json} property={'json'} label={'JSON'} multiline error={this.props.error.json}/>
          : null}
        </Dialog>

      </div>
    );
  };
}

Builder.propTypes = {
  checkError: PropTypes.func.isRequired,
  readJSON: PropTypes.func.isRequired,
  jsonString: PropTypes.func.isRequired,
  progress: PropTypes.func.isRequired,
  resetTutorial: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  steps: PropTypes.array.isRequired,
  change: PropTypes.number.isRequired,
  error: PropTypes.object.isRequired,
  json: PropTypes.string.isRequired,
  isProgress: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  title: state.builder.title,
  id: state.builder.id,
  steps: state.builder.steps,
  change: state.builder.change,
  error: state.builder.error,
  json: state.builder.json,
  isProgress: state.builder.progress
});

export default connect(mapStateToProps, { checkError, readJSON, jsonString, progress, resetTutorial })(withStyles(styles, {withTheme: true})(Builder));
