import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { connectMyBadges, disconnectMyBadges } from '../../actions/authActions';

import axios from 'axios';
import { withRouter } from 'react-router-dom';

import Breadcrumbs from '../Breadcrumbs';
import Alert from '../Alert';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import InputAdornment from '@material-ui/core/InputAdornment';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const styles = (theme) => ({
  root: {
    '& label.Mui-focused': {
      color: '#aed9c8'
    },
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: '#aed9c8'
      },
      borderRadius: '0.75rem'
    }
  },
  text: {
    fontFamily: [
      '"Open Sans"',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    fontSize: 16
  }
});

export class MyBadges extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      showPassword: false,
      msg: '',
      badges: [],
      progress: false
    };
  }

  componentDidMount(){
    if(this.props.user.badge){
      this.getBadges();
    }
  }

  componentDidUpdate(props){
    const { message } = this.props;
    if (message !== props.message) {
      // Check for login error
      if(message.id === 'MYBADGES_CONNECT_FAIL'){
        this.setState({msg: 'Der Benutzername oder das Passwort ist nicht korrekt.', username: '', password: '', showPassword: false});
      }
      else if(message.id === 'MYBADGES_CONNECT_SUCCESS'){
        this.getBadges();
      }
      else if(message.id === 'MYBADGES_DISCONNECT_SUCCESS' || message.id === 'MYBADGES_DISCONNECT_FAIL'){
        this.setState({progress: false});
      }
      else {
        this.setState({msg: null});
      }
    }
  }

  getBadges = () => {
    this.setState({progress: true});
    const config = {
      success: res => {
        this.setState({badges: res.data.badges, progress: false});
      },
      error: err => {
        this.setState({progress: false});
      }
    };
    axios.get(`${process.env.REACT_APP_BLOCKLY_API}/user/badge`, config)
    .then(res => {
      res.config.success(res);
    })
    .catch(err => {
      err.config.error(err);
    });
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value, msg: '' });
  };

  onSubmit = e => {
    e.preventDefault();
    const {username, password} = this.state;
    // create user object
    const user = {
      username,
      password
    };
    this.props.connectMyBadges(user);
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
        <Breadcrumbs content={[{ link: '/user/badge', title: 'MyBadges' }]} />

        <Grid container spacing={2}>
          <Grid item xs={12} style={{margin: '4px'}}>
            {!this.props.user.badge ?
              <Alert>
                Du kannst dein Blockly-Konto mit deinem <Link href={`${process.env.REACT_APP_MYBADGES}`}>MyBadges</Link>-Konto verknüpfen, um Badges erwerben zu können.
              </Alert>
            : null}
            <Paper style={{background: '#fffbf5'}}>
              <div style={{display: 'flex', flexDirection: 'row', alignSelf: 'center', justifyContent: 'center', flexWrap: 'wrap'}}>
                <div style={!this.props.user.badge ? {margin: '15px 15px 0px 15px'} : {margin: '15px'}}>
                  <img src={`${process.env.REACT_APP_MYBADGES}/static/media/Logo.d1c71fdf.png`} alt="My Badges" style={{maxWidth: '200px', maxHeight: '200px'}}></img>
                </div>
                {!this.props.user.badge ?
                  <div style={{maxWidth: '500px', alignSelf: 'center', textAlign: 'center', margin: '15px'}}>
                    {this.state.msg ?
                      <div style={{lineHeight: 1.43, borderRadius: '0.75rem', padding: '14px 16px', marginBottom: '10px', color: 'rgb(97, 26, 21)', backgroundColor: 'rgb(253, 236, 234)', fontFamily: `"Open Sans",BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"`}}>
                        {this.state.msg}
                      </div> : null
                    }
                    <TextField
                      style={{marginBottom: '10px'}}
                      classes={{root: this.props.classes.root}}
                      variant='outlined'
                      type='text'
                      label='Nutzername'
                      name='username'
                      value={this.state.username}
                      onChange={this.onChange}
                      fullWidth={true}
                    />
                    <TextField
                      classes={{root: this.props.classes.root}}
                      variant='outlined'
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
                      <Button variant='contained' onClick={this.onSubmit} className={this.props.classes.text} style={{background: '#aed9c8', borderRadius: '0.75rem', width: '100%'}}>
                        Anmelden
                      </Button>
                    </p>
                    <p className={this.props.classes.text} style={{textAlign: 'center', fontSize: '0.8rem'}}>
                      <Link style={{color: '#aed9c8'}} href={`${process.env.REACT_APP_MYBADGES}/user/password`}>Passwort vergessen?</Link>
                    </p>
                    <Divider variant='fullWidth'/>
                    <p className={this.props.classes.text} style={{textAlign: 'center', paddingRight: "34px", paddingLeft: "34px"}}>
                      Du hast noch kein Konto? <Link style={{color: '#aed9c8'}} href={`${process.env.REACT_APP_MYBADGES}/register`}>Registrieren</Link>
                    </p>
                  </div>
                : <div style={{margin: '15px', alignSelf: 'center'}}>
                    <Typography style={{fontWeight: 'bold', fontSize: '1.1rem'}}>MyBadges-Konto ist erfolgreich verknüpft.</Typography>
                    <Button variant='outlined' style={{borderColor: '#aed9c8'}} onClick={() => {this.props.disconnectMyBadges(); this.setState({badges: [], progress: true});}}>Konto trennen</Button>
                  </div>}
              </div>
            </Paper>
          </Grid>

          {this.props.user.badge && !this.state.progress ?
            <Grid container item>
              <Grid item style={{margin: '4px'}}>
              {this.state.badges && this.state.badges.length > 0 ?
                <Typography style={{fontWeight: 'bold'}}>
                  Du hast {this.state.badges.length} {this.state.badges.length === 1 ? 'Badge' : 'Badges'} im Kontext Blockly for senseBox erreicht.
                </Typography>
               : null}
              </Grid>
              <Grid container item>
                {this.state.badges && this.state.badges.length > 0 ?
                  this.state.badges.map(badge => (
                    <Grid item xs={12} sm={6} md={4}>
                      <Paper style={{margin: '4px', textAlign: 'center'}}>
                        {badge.image && badge.image.path ?
                          <Avatar src={`${process.env.REACT_APP_MYBADGES}/media/${badge.image.path}`} style={{width: '200px', height: '200px', marginLeft: 'auto', marginRight: 'auto'}}/>
                        : <Avatar style={{width: '200px', height: '200px', marginLeft: 'auto', marginRight: 'auto'}}></Avatar>}
                        <Typography variant='h6' style={{display: 'flex', cursor: 'default', paddingBottom: '6px'}}>
                          <div style={{flexGrow:1, marginLeft: '10px', marginRight: '10px'}}>{badge.name}</div>
                        </Typography>
                      </Paper>
                    </Grid>
                  ))
                :
                  <Grid item style={{margin: '4px'}}>
                    <Typography style={{fontWeight: 'bold'}}>
                      Du hast noch keine Badges im Kontext senseBox for Blockly erreicht.
                    </Typography>
                  </Grid>}
              </Grid>
            </Grid>
          : null}
        </Grid>
      </div>
    );
  }
}

MyBadges.propTypes = {
  connectMyBadges: PropTypes.func.isRequired,
  disconnectMyBadges: PropTypes.func.isRequired,
  message: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  message: state.message,
  user: state.auth.user
});

export default connect(mapStateToProps, { connectMyBadges, disconnectMyBadges })(withStyles(styles, { withTheme: true })(withRouter(MyBadges)));
