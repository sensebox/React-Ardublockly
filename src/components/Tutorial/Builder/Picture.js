import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { changeContent, deleteProperty, setError, deleteError } from '../../../actions/tutorialBuilderActions';

import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Button from '@material-ui/core/Button';

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

class Picture extends Component {

  constructor(props){
    super(props);
    this.state={
      checked: props.value ? true : false,
      error: false
    };
  }

  componentDidUpdate(props){
    if(props.value !== this.props.value){
      this.setState({ checked: this.props.value ? true : false });
    }
  }

  onChange = (value) => {
    var oldValue = this.state.checked;
    this.setState({checked: value});
    if(oldValue !== value){
      if(value){
        this.props.setError(this.props.index, 'picture');
      } else {
        this.props.deleteError(this.props.index, 'picture');
        this.props.deleteProperty(this.props.index, 'picture');
        this.props.deleteProperty(this.props.index, 'url');
        this.setState({ error: false});
      }
    }
  }

  uploadPicture = (pic) => {
    if(!(/^image\/.*/.test(pic.type))){
      this.props.setError(this.props.index, 'picture');
      this.setState({ error: true });
      this.props.deleteProperty(this.props.index, 'url');
    }
    else {
      this.props.deleteError(this.props.index, 'picture');
      this.setState({ error: false });
      this.props.changeContent(this.props.index, 'url', URL.createObjectURL(pic));
    }
    this.props.changeContent(this.props.index, 'picture', pic.name);
  }

  render() {
    return (
      <div style={{marginBottom: '10px', padding: '18.5px 14px', borderRadius: '25px', border: '1px solid lightgrey', width: 'calc(100% - 28px)'}}>
        <FormControlLabel
          labelPlacement="end"
          label={"Bild"}
          control={
            <Switch
              checked={this.state.checked}
              onChange={(e) => this.onChange(e.target.checked)}
              color="primary"
            />
          }
        />
        {this.state.checked ?
          <div>
            {!this.props.error ?
              <div>
                <FormHelperText style={{lineHeight: 'initial', marginBottom: '10px'}}>{`Beachte, dass das Foto zusätzlich in den Ordner public/media/tutorial unter dem Namen '${this.props.value}' abgespeichert werden muss.`}</FormHelperText>
                <img src={this.props.url ? this.props.url : `/media/tutorial/${this.props.value}`} alt={this.props.url ? '' : `Das Bild '${this.props.value}' konnte nicht im Ordner public/media/tutorial gefunden werden und kann daher nicht angezeigt werden.`} style={{maxHeight: '180px', maxWidth: '360px', marginBottom: '5px'}}/>
              </div>
            : <div
                style={{height: '150px', maxWidth: '250px', marginBottom: '5px', justifyContent: "center", alignItems: "center", display:"flex", padding: '20px'}}
                className={this.props.error ? this.props.classes.errorBorder : null} >
                {this.props.error ?
                  this.state.error ?
                    <FormHelperText style={{lineHeight: 'initial', textAlign: 'center'}} className={this.props.classes.errorColor}>{`Die übergebene Datei entspricht nicht dem geforderten Bild-Format. Überprüfe, ob es sich um ein Bild handelt und versuche es nochmal.`}</FormHelperText>
                  : <FormHelperText style={{lineHeight: 'initial', textAlign: 'center'}} className={this.props.classes.errorColor}>{`Wähle ein Bild aus.`}</FormHelperText>
                : null}
              </div>}
            {/*upload picture*/}
            <div ref={this.inputRef}>
              <input
                style={{display: 'none'}}
                accept="image/*"
                onChange={(e) => {this.uploadPicture(e.target.files[0])}}
                id="picture"
                type="file"
              />
              <label htmlFor="picture">
                <Button component="span" className={this.props.error ? this.props.classes.errorButton : null} style={{marginRight: '10px', marginBottom: '10px'}} variant='contained' color='primary'>Bild auswählen</Button>
              </label>
            </div>
          </div>
        : null}
      </div>
    );
  };
}

Picture.propTypes = {
  changeContent: PropTypes.func.isRequired,
  deleteProperty: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
  deleteError: PropTypes.func.isRequired,
};


export default connect(null, { changeContent, deleteProperty, setError, deleteError })(withStyles(styles, {withTheme: true})(Picture));
