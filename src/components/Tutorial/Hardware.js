import React, { Component } from 'react';

import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

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
                <img src={`/media/hardware/${picture}.png`} height={100} alt={picture} style={{cursor: 'pointer'}} onClick={() => this.handleClickOpen(picture, `/media/hardware/${picture}.png`)}/>
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
          fullWidth={true}
          open={this.state.open}
          onClose={this.handleClose}
        >
          <DialogTitle style={{padding: "10px 24px"}}>Hardware: {this.state.title}</DialogTitle>
          <DialogContent style={{padding: "0px"}}>
            <img src={this.state.url} width="100%" alt={this.state.title}/>
          </DialogContent>
          <DialogActions style={{padding: "10px 24px"}}>
            <Button onClick={this.handleClose} color="primary">
              Schließen
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  };
}

export default withWidth()(withStyles(styles, { withTheme: true })(Hardware));
