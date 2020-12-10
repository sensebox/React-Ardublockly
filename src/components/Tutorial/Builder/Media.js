import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { changeContent, deleteProperty, setError, deleteError } from '../../../actions/tutorialBuilderActions';

import Textfield from './Textfield';

import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
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

class Media extends Component {

  constructor(props){
    super(props);
    this.state={
      checked: props.value ? true : false,
      error: false,
      radioValue: !props.picture && !props.youtube ? 'picture' : props.picture ? 'picture' : 'youtube'
    };
  }

  componentDidUpdate(props){
    if(props.value !== this.props.value){
      this.setState({ checked: this.props.value ? true : false });
    }
  }

  onChangeSwitch = (value) => {
    var oldValue = this.state.checked;
    this.setState({checked: value});
    if(oldValue !== value){
      if(value){
        this.props.setError(this.props.index, 'media');
      } else {
        this.props.deleteError(this.props.index, 'media');
        this.props.deleteProperty(this.props.index, 'media');
        this.props.deleteProperty(this.props.index, 'url');
        this.setState({ error: false});
      }
    }
  }

  onChangeRadio = (value) => {
    this.props.setError(this.props.index, 'media');
    var oldValue = this.state.radioValue;
    this.setState({radioValue: value, error: false});
    // delete property 'oldValue', so that all old media files are reset
    this.props.deleteProperty(this.props.index, 'media', oldValue);
    if(oldValue === 'picture'){
      this.props.deleteProperty(this.props.index, 'url');
    }
  }

  uploadPicture = (pic) => {
    if(!(/^image\/.*/.test(pic.type))){
      this.props.setError(this.props.index, 'media');
      this.setState({ error: true });
      this.props.deleteProperty(this.props.index, 'url');
    }
    else {
      this.props.deleteError(this.props.index, 'media');
      this.setState({ error: false });
      this.props.changeContent(URL.createObjectURL(pic), this.props.index, 'url');
    }
    this.props.changeContent(pic, this.props.index, 'media', 'picture');
  }

  render() {
    return (
      <div style={{marginBottom: '10px', padding: '18.5px 14px', borderRadius: '25px', border: '1px solid lightgrey', width: 'calc(100% - 28px)'}}>
        <FormControlLabel
          labelPlacement="end"
          label={"Medien"}
          control={
            <Switch
              checked={this.state.checked}
              onChange={(e) => this.onChangeSwitch(e.target.checked)}
              color="primary"
            />
          }
        />
        {this.state.checked ?
          <div>
            <RadioGroup row value={this.state.radioValue} onChange={(e) => {this.onChangeRadio(e.target.value);}}>
              <FormControlLabel style={{color: 'black'}}
                value="picture"
                control={<Radio color="primary" />}
                label="Bild"
                labelPlacement="end"
              />
              <FormControlLabel style={{color: 'black'}}
                value="youtube"
                control={<Radio color="primary" />}
                label="Youtube-Video"
                labelPlacement="end"
              />
            </RadioGroup>
            {this.state.radioValue === 'picture' ?
              <div>
                {!this.props.error ?
                  <div>
                    <img src={this.props.url ? this.props.url : this.props.picture ? `${process.env.REACT_APP_BLOCKLY_API}/media/${this.props.picture.path}` : ''} alt={''} style={{maxHeight: '180px', maxWidth: '360px', marginBottom: '5px'}}/>
                  </div>
                : <div
                    style={{height: '150px', maxWidth: '250px', marginBottom: '5px', justifyContent: "center", alignItems: "center", display:"flex", padding: '20px'}}
                    className={this.props.error ? this.props.classes.errorBorder : null} >
                    {this.state.error ?
                        <FormHelperText style={{lineHeight: 'initial', textAlign: 'center'}} className={this.props.classes.errorColor}>{`Die übergebene Datei entspricht nicht dem geforderten Bild-Format. Überprüfe, ob es sich um ein Bild handelt und versuche es nochmal.`}</FormHelperText>
                      : <FormHelperText style={{lineHeight: 'initial', textAlign: 'center'}} className={this.props.classes.errorColor}>{`Wähle ein Bild aus.`}</FormHelperText>
                    }
                  </div>}
                {/*upload picture*/}
                <div>
                  <input
                    style={{display: 'none'}}
                    accept="image/*"
                    onChange={(e) => {this.uploadPicture(e.target.files[0]);}}
                    id={`picture ${this.props.index}`}
                    type="file"
                  />
                  <label htmlFor={`picture ${this.props.index}`}>
                    <Button component="span" className={this.props.error ? this.props.classes.errorButton : null} style={{marginRight: '10px', marginBottom: '10px'}} variant='contained' color='primary'>Bild auswählen</Button>
                  </label>
                </div>
              </div>
            :
              /*youtube-video*/
              <div>
                <Textfield value={this.props.value && this.props.value.youtube} property={'media'} property2={'youtube'} label={'Youtube-ID'} index={this.props.index} error={this.props.error} errorText={`Gib eine Youtube-ID ein.`}/>
                {this.props.youtube && !this.props.error ?
                  /*16:9; width: 800px; height: width/16*9=450px*/
                  <div style={{maxWidth: '800px'}}>
                    <FormHelperText style={{lineHeight: 'initial', margin: '0 25px 10px 25px'}}>{`Stelle sicher, dass das unten angezeigte Youtube-Video funktioniert, andernfalls überprüfe die Youtube-ID.`}</FormHelperText>
                    <div style={{position: 'relative', height: 0, paddingBottom: 'calc(100% / 16 * 9)'}}>
                      <iframe title={this.props.youtube} style={{borderRadius: '25px', position: 'absolute', top: '0', left: '0', width: '100%', maxWidth: '800px', height: '100%', maxHeight: '450px'}} src={`https://www.youtube.com/embed/${this.props.youtube}`} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                    </div>
                  </div>
                : null}
              </div>
            }
          </div>
        : null}
      </div>
    );
  };
}

Media.propTypes = {
  changeContent: PropTypes.func.isRequired,
  deleteProperty: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
  deleteError: PropTypes.func.isRequired,
};


export default connect(null, { changeContent, deleteProperty, setError, deleteError })(withStyles(styles, {withTheme: true})(Media));
