import React, { Component } from 'react';

import Dialog from '../Dialog';

import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpandAlt } from "@fortawesome/free-solid-svg-icons";

const styles = theme => ({
  expand: {
    '&:hover': {
      color: theme.palette.primary.main,
    },
    '&:active': {
      color: theme.palette.primary.main,
    },
    color: theme.palette.text.primary
  },
  multiGridListTile: {
    background: fade(theme.palette.secondary.main, 0.5),
    height: '30px'
  },
  multiGridListTileTitle: {
    color: theme.palette.text.primary
  }
});


class Hardware extends Component {

  state = {
    open: false,
    title: '',
    url: ''
  };

  handleClickOpen = (title, url) => {
    this.setState({open: true, title, url});
  };

  handleClose = () => {
    this.setState({open: false, title: '', url: ''});
  };

  render() {
    var cols = isWidthDown('md', this.props.width) ? isWidthDown('sm', this.props.width) ? isWidthDown('xs', this.props.width) ? 2 : 3 : 4 : 6;
    return (
      <div style={{marginTop: '10px', marginBottom: '5px'}}>
        <Typography>Für die Umsetzung benötigst du folgende Hardware:</Typography>

        <GridList cellHeight={100} cols={cols} spacing={10}>
        {this.props.picture.map((picture,i) => (
          <GridListTile key={i}>
            <div style={{margin: 'auto', width: 'max-content'}}>
              <img src={`/media/hardware/${picture}.png`} alt={picture} height={100} style={{cursor: 'pointer'}} onClick={() => this.handleClickOpen(picture, `/media/hardware/${picture}.png`)}/>
            </div>
            <GridListTileBar
              classes={{root: this.props.classes.multiGridListTile}}
              title={
                <div style={{overflow: 'hidden', textOverflow: 'ellipsis'}} className={this.props.classes.multiGridListTileTitle}>
                  {picture}
                </div>
              }
              actionIcon={
                <IconButton className={this.props.classes.expand} aria-label='Vollbild' onClick={() => this.handleClickOpen(picture, `/media/hardware/${picture}.png`)}>
                  <FontAwesomeIcon icon={faExpandAlt} size="xs"/>
                </IconButton>
              }
            />
          </GridListTile>
        ))}
        </GridList>

        <Dialog
          style={{zIndex: 1500}}
          open={this.state.open}
          title={`Hardware: ${this.state.title}`}
          content={this.state.content}
          onClose={this.handleClose}
          onClick={this.handleClose}
          button={'Schließen'}
        >
          <img src={this.state.url} width="100%" alt={this.state.title}/>
        </Dialog>

      </div>
    );
  };
}

export default withWidth()(withStyles(styles, { withTheme: true })(Hardware));
