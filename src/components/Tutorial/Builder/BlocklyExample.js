import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { changeContent, deleteProperty } from '../../../actions/tutorialBuilderActions';

import moment from 'moment';
import localization from 'moment/locale/de';

import BlocklyWindow from '../../Blockly/BlocklyWindow';

import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
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

  componentDidUpdate(props){
    if(props.task !== this.props.task || props.value !== this.props.value){
      this.setState({checked: this.props.task ? this.props.task : this.props.value ? true : false});
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
        {this.state.checked ? !this.props.value  ?
          <FormLabel className={this.props.classes.errorColor}>Es ist noch keine Eingabe gemacht worden.</FormLabel>
        : <FormLabel>Die letzte Einreichung erfolgte um {this.state.input} Uhr.</FormLabel>
        : null}
        {this.state.checked ?
          <div>
            <Grid container className={!this.props.value ? this.props.classes.errorBorder : null}>
              <Grid item xs={12}>
                <BlocklyWindow initialXml={this.props.value}/>
              </Grid>
            </Grid>
            <Button
              className={!this.props.value ? this.props.classes.errorButton : null }
              style={{marginTop: '5px', height: '40px'}}
              variant='contained'
              color='primary'
              onClick={() => {this.props.changeContent(this.props.index, 'xml', this.props.xml); this.setState({input: moment(Date.now()).format('LTS')})}}
            >
              {this.props.task ? 'Musterlösung einreichen' : 'Beispiel einreichen'}
            </Button>
          </div>
        : null}
      </div>
    );
  };
}

BlocklyExample.propTypes = {
  changeContent: PropTypes.func.isRequired,
  deleteProperty: PropTypes.func.isRequired,
  xml: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  xml: state.workspace.code.xml
});


export default connect(mapStateToProps, { changeContent, deleteProperty })(withStyles(styles, {withTheme: true})(BlocklyExample));
