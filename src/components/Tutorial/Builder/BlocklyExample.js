import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { changeContent, deleteProperty, setError, deleteError } from '../../../actions/tutorialBuilderActions';

import moment from 'moment';
import localization from 'moment/locale/de';
import * as Blockly from 'blockly/core';

import { initialXml } from '../../Blockly//initialXml.js';
import BlocklyWindow from '../../Blockly/BlocklyWindow';

import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
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
    '&:hover': {
      backgroundColor: theme.palette.error.dark
    }
  }
});

class BlocklyExample extends Component {

  constructor(props) {
    super(props);
    this.state = {
      checked: props.task ? props.task : props.value ? true : false,
      input: null,
      disabled: false
    };
  }

  componentDidMount() {
    moment.updateLocale('de', localization);
    this.isError();
    // if(this.props.task){
    //   this.props.setError(this.props.index, 'xml');
    // }
  }

  componentDidUpdate(props, state) {
    if (props.task !== this.props.task || props.value !== this.props.value) {
      this.setState({ checked: this.props.task ? this.props.task : this.props.value ? true : false },
        () => this.isError()
      );
    }
    if (state.checked !== this.state.checked && this.state.checked) {
      this.isError();
    }
    if (props.xml !== this.props.xml) {
      // check if there is at least one block, otherwise the workspace cannot be submitted
      var workspace = Blockly.getMainWorkspace();
      var areBlocks = workspace.getAllBlocks().length > 0;
      this.setState({ disabled: !areBlocks });
    }
  }

  isError = () => {
    if (this.state.checked) {
      var xml = this.props.value;
      // check if value is valid xml;
      try {
        Blockly.Xml.textToDom(xml);
        this.props.deleteError(this.props.index, 'xml');
      }
      catch (err) {
        xml = initialXml;
        // not valid xml, throw error in redux store
        this.props.setError(this.props.index, 'xml');
      }
      if (!this.props.task) {
        // instruction can also display only one block, which does not necessarily
        // have to be the initial block
        xml = xml.replace('deletable="false"', 'deletable="true"');
      }
      this.setState({ xml: xml });
    }
    else {
      this.props.deleteError(this.props.index, 'xml');
    }
  }

  onChange = (value) => {
    var oldValue = this.state.checked;
    this.setState({ checked: value });
    if (oldValue !== value && !value) {
      this.props.deleteError(this.props.index, 'xml');
      this.props.deleteProperty(this.props.index, 'xml');
    }
  }

  setXml = () => {
    var xml = this.props.xml;
    this.props.changeContent(xml, this.props.index, 'xml');
    this.setState({ input: moment(Date.now()).format('LTS') });
  }

  render() {
    return (
      <div style={{ marginBottom: '10px', padding: '18.5px 14px', borderRadius: '25px', border: '1px solid lightgrey', width: 'calc(100% - 28px)' }}>
        {!this.props.task ?
          <FormControlLabel
            labelPlacement="end"
            label={"Blockly Beispiel"}
            control={
              <Switch
                checked={this.state.checked}
                onChange={(e) => this.onChange(e.target.checked)}
                color="primary"
              />
            }
          />
          : <FormLabel style={{ color: 'black' }}>{Blockly.Msg.builder_solution}</FormLabel>}
        {this.state.checked ? !this.props.value || this.props.error ?
          <FormHelperText style={{ lineHeight: 'initial' }} className={this.props.classes.errorColor}>{`Reiche deine Blöcke ein, indem du auf den '${this.props.task ? Blockly.Msg.builder_solution_submit : Blockly.Msg.builder_example_submit}'-Button klickst.`}</FormHelperText>
          : this.state.input ? <FormHelperText style={{ lineHeight: 'initial' }}>Die letzte Einreichung erfolgte um {this.state.input} Uhr.</FormHelperText> : null
          : null}
        {this.state.checked && !this.props.task ?
          <FormHelperText style={{ lineHeight: 'initial' }}>{Blockly.Msg.builder_comment}</FormHelperText>
          : null}
        {/* ensure that the correct xml-file is displayed in the workspace */}
        {this.state.checked && this.state.xml ? (() => {
          return (
            <div style={{ marginTop: '10px' }}>
              <Grid container className={!this.props.value || this.props.error ? this.props.classes.errorBorder : null}>
                <Grid item xs={12}>
                  <BlocklyWindow
                    blockDisabled={this.props.task}
                    trashcan={false}
                    initialXml={this.state.xml}
                    blocklyCSS={{ height: '500px' }}
                  />
                </Grid>
              </Grid>
              <Button
                className={!this.props.value || this.props.error ? this.props.classes.errorButton : null}
                style={{ marginTop: '5px', height: '40px' }}
                variant='contained'
                color='primary'
                disabled={this.state.disabled}
                onClick={() => this.setXml()}
              >
                {this.props.task ? Blockly.Msg.builder_solution_submit : Blockly.Msg.builder_example_submit}
              </Button>
            </div>
          )
        })()
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


export default connect(mapStateToProps, { changeContent, deleteProperty, setError, deleteError })(withStyles(styles, { withTheme: true })(BlocklyExample));
