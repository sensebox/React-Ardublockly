import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { changeContent, setError, deleteError } from '../../../actions/tutorialBuilderActions';

import hardware from '../../../data/hardware.json';

import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';
import * as Blockly from 'blockly'


const styles = theme => ({
  multiGridListTile: {
    background: theme.palette.primary.main,
    opacity: 0.9,
    height: '30px'
  },
  multiGridListTileTitle: {
    color: theme.palette.text.primary
  },
  border: {
    cursor: 'pointer',
    '&:hover': {
      width: 'calc(100% - 4px)',
      height: 'calc(100% - 4px)',
      border: `2px solid ${theme.palette.primary.main}`
    }
  },
  active: {
    cursor: 'pointer',
    width: 'calc(100% - 4px)',
    height: 'calc(100% - 4px)',
    border: `2px solid ${theme.palette.primary.main}`
  },
  errorColor: {
    color: theme.palette.error.dark,
    lineHeight: 'initial',
    marginBottom: '10px'
  }
});

class Requirements extends Component {

  onChange = (hardware) => {
    var hardwareArray = this.props.value;
    if (hardwareArray.filter(value => value === hardware).length > 0) {
      hardwareArray = hardwareArray.filter(value => value !== hardware);
    }
    else {
      hardwareArray.push(hardware);
      if (this.props.error) {
        this.props.deleteError(this.props.index, 'hardware');
      }
    }
    this.props.changeContent(hardwareArray, this.props.index, 'hardware');
    if (hardwareArray.length === 0) {
      this.props.setError(this.props.index, 'hardware');
    }
  }

  render() {
    var cols = isWidthDown('md', this.props.width) ? isWidthDown('sm', this.props.width) ? isWidthDown('xs', this.props.width) ? 2 : 3 : 4 : 6;
    return (
      <div style={{ marginBottom: '10px', padding: '18.5px 14px', borderRadius: '25px', border: '1px solid lightgrey', width: 'calc(100% - 28px)' }}>
        <FormLabel style={{ color: 'black' }}>Hardware</FormLabel>
        <FormHelperText style={this.props.error ? { lineHeight: 'initial', marginTop: '5px' } : { marginTop: '5px', lineHeight: 'initial', marginBottom: '10px' }}>{Blockly.Msg.builder_hardware_order}</FormHelperText>
        {this.props.error ? <FormHelperText className={this.props.classes.errorColor}>{Blockly.Msg.builder_hardware_helper}</FormHelperText> : null}
        <GridList cellHeight={100} cols={cols} spacing={10}>
          {hardware.map((picture, i) => (
            <GridListTile key={i} onClick={() => this.onChange(picture.id)} classes={{ tile: this.props.value.filter(value => value === picture.id).length > 0 ? this.props.classes.active : this.props.classes.border }}>
              <div style={{ margin: 'auto', width: 'max-content' }}>
                <img src={`/media/hardware/${picture.src}`} alt={picture.name} height={100} />
              </div>
              <GridListTileBar
                classes={{ root: this.props.classes.multiGridListTile }}
                title={
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }} className={this.props.classes.multiGridListTileTitle}>
                    {picture.name}
                  </div>
                }
              />
            </GridListTile>
          ))}
        </GridList>
      </div>
    );
  };
}

Requirements.propTypes = {
  changeContent: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
  deleteError: PropTypes.func.isRequired,
  change: PropTypes.number.isRequired
};

const mapStateToProps = state => ({
  change: state.builder.change
});

export default connect(mapStateToProps, { changeContent, setError, deleteError })(withStyles(styles, { withTheme: true })(withWidth()(Requirements)));
