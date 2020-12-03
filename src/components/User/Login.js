import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { login } from '../../actions/authActions'
import { clearMessages } from '../../actions/messageActions'

import { withRouter } from 'react-router-dom';

import Snackbar from '../Snackbar';
import Breadcrumbs from '../Breadcrumbs';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import InputAdornment from '@material-ui/core/InputAdornment';
import CircularProgress from '@material-ui/core/CircularProgress';
import Link from '@material-ui/core/Link';


export class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      snackbar: false,
      type: '',
      key: '',
      message: '',
      showPassword: false
    };
  }

  componentDidUpdate(props){
    const { message } = this.props;
    if (message !== props.message) {
      if(message.id === 'LOGIN_SUCCESS'){
        this.props.history.goBack();
      }
      // Check for login error
      else if(message.id === 'LOGIN_FAIL'){
        this.setState({ email: '', password: '', snackbar: true, key: Date.now(), message: 'Der Benutzername oder das Passwort ist nicht korrekt.', type: 'error' });
      }
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    const {email, password} = this.state;
    if(email !== '' && password !== ''){
      // create user object
      const user = {
        email,
        password
      };
      this.props.login(user);
    } else {
      this.setState({ snackbar: true, key: Date.now(), message: 'Gib sowohl ein Benutzername als auch ein Passwort ein.', type: 'error' });
    }
  };

  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  render(){
    return(
      <div>
        <Breadcrumbs content={[{ link: '/user/login', title: 'Anmelden' }]} />

        <div style={{maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto'}}>
          <h1>Anmelden</h1>
          <Snackbar
            open={this.state.snackbar}
            message={this.state.message}
            type={this.state.type}
            key={this.state.key}
          />
          <TextField
            style={{marginBottom: '10px'}}
            // variant='outlined'
            type='text'
            label='E-Mail oder Nutzername'
            name='email'
            value={this.state.email}
            onChange={this.onChange}
            fullWidth={true}
          />
          <TextField
            // variant='outlined'
            type={this.state.showPassword ? 'text' : 'password'}
            label='Passwort'
            name='password'
            value={this.state.password}
            InputProps={{
              endAdornment:
                <InputAdornment
                  position="end"
                >
                  <IconButton
                    onClick={this.handleClickShowPassword}
                    onMouseDown={this.handleMouseDownPassword}
                    edge="end"
                  >
                    <FontAwesomeIcon size='xs' icon={this.state.showPassword ? faEyeSlash : faEye} />
                  </IconButton>
                </InputAdornment>
            }}
            onChange={this.onChange}
            fullWidth={true}
          />
          <p>
            <Button color="primary" variant='contained' onClick={this.onSubmit} style={{width: '100%'}}>
              {this.props.progress ?
                <div style={{height: '24.5px'}}><CircularProgress color="inherit" size={20}/></div>
              : 'Anmelden'}
            </Button>
          </p>
          <p style={{textAlign: 'center', fontSize: '0.8rem'}}>
            <Link rel="noreferrer" target="_blank" href={'https://opensensemap.org/'} color="primary">Passwort vergessen?</Link>
          </p>
          <Divider variant='fullWidth'/>
          <p style={{textAlign: 'center', paddingRight: "34px", paddingLeft: "34px"}}>
            Du hast noch kein Konto? <Link rel="noreferrer" target="_blank" href={'https://opensensemap.org/'}>Registrieren</Link>
          </p>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  message: PropTypes.object.isRequired,
  login: PropTypes.func.isRequired,
  clearMessages: PropTypes.func.isRequired,
  message: PropTypes.object.isRequired,
  progress: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  message: state.message,
  progress: state.auth.progress
});

export default connect(mapStateToProps, { login, clearMessages })(withRouter(Login));
