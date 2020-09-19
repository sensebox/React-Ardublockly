import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { changeContent, deleteProperty, setError, deleteError } from '../../../actions/tutorialBuilderActions';

import moment from 'moment';
import localization from 'moment/locale/de';
import * as Blockly from 'blockly/core';

import { parseXml } from '../../../helpers/compareXml';
import BlocklyWindow from '../../Blockly/BlocklyWindow';

import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

const styles = (theme) => ({
  errorColor: {
    color: theme.palette.error.dark
  },
  errorBorder: {
    border: `1px solid ${theme.palette.error.dark}`
  },
  errorButton: {
    marginTop: '5px',
    height: '40px',
    backgroundColor: theme.palette.error.dark,
    '&:hover':{
      backgroundColor: theme.palette.error.dark
    }
  }
});

class BlocklyExample extends Component {

  constructor(props){
    super(props);
    this.state={
      checked: props.task ? props.task : props.value ? true : false,
      input: null,
    };
  }

  componentDidMount(){
    if(this.props.task){
      this.props.setError(this.props.index, 'xml');
    }
  }

  componentDidUpdate(props, state){
    if(props.task !== this.props.task || props.value !== this.props.value){
      this.setState({checked: this.props.task ? this.props.task : this.props.value ? true : false},
        () => this.isError()
      );
    }
    if(state.checked !== this.state.checked){
      this.isError();
    }
  }

  isError = () => {
    if(this.state.checked && !this.props.value){
      this.props.setError(this.props.index, 'xml');
    }
    else {
      this.props.deleteError(this.props.index, 'xml');
    }
  }

  onChange = (value) => {
    var oldValue = this.state.checked;
    this.setState({checked: value});
    console.log(!value);
    if(oldValue !== value && !value){
      this.props.deleteProperty(this.props.index, 'xml');
    }
  }

  render() {
    moment.locale('de', localization);
    return (
      <div style={{marginBottom: '10px'}}>
        <FormControlLabel
          style={{margin: 0}}
          labelPlacement="start"
          label={this.props.task ? "Musterlösung" : "Blockly Beispiel"}
          control={
            <Switch
              disabled={this.props.task}
              checked={this.state.checked}
              onChange={(e) => this.onChange(e.target.checked)}
              color="primary"
            />
          }
        />
        {this.state.checked ? !this.props.value || this.props.error.steps[this.props.index].xml ?
          <FormHelperText style={{lineHeight: 'initial', marginBottom: '10px'}} className={this.props.classes.errorColor}>Reiche deine Blöcke ein, indem du auf den rot gefärbten Button klickst.</FormHelperText>
        : <FormHelperText style={{lineHeight: 'initial', marginBottom: '10px'}}>Die letzte Einreichung erfolgte um {this.state.input} Uhr.</FormHelperText>
        : null}
        {this.state.checked ? () => {
          var initialXml = this.props.value;
          // check if value is valid xml;
          try{
            Blockly.Xml.textToDom(initialXml);
          }
          catch(err){
            initialXml = null;
            this.props.setError(this.props.index, 'xml');
          }
          return(
            <div>
              <Grid container className={!this.props.value ? this.props.classes.errorBorder : null}>
                <Grid item xs={12}>
                  <BlocklyWindow initialXml={initialXml}/>
                </Grid>
              </Grid>
              <Button
                className={!this.props.value || this.props.error.steps[this.props.index].xml ? this.props.classes.errorButton : null }
                style={{marginTop: '5px', height: '40px'}}
                variant='contained'
                color='primary'
                onClick={() => {this.props.changeContent(this.props.index, 'xml', this.props.xml); this.setState({input: moment(Date.now()).format('LTS')})}}
              >
                {this.props.task ? 'Musterlösung einreichen' : 'Beispiel einreichen'}
              </Button>
            </div>
          )}
        : null}
      </div>
    );
  };
}

BlocklyExample.propTypes = {
  changeContent: PropTypes.func.isRequired,
  deleteProperty: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
  deleteError: PropTypes.func.isRequired,
  xml: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  xml: state.workspace.code.xml
});


export default connect(mapStateToProps, { changeContent, deleteProperty, setError, deleteError })(withStyles(styles, {withTheme: true})(BlocklyExample));
