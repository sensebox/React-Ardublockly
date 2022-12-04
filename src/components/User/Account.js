import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Breadcrumbs from '../Breadcrumbs';
import Alert from '../Alert';

import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';

import { faUser, faAt, faMapMarkerAlt, faCloudSunRain, faBox, faUserTag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export class Account extends Component {

  render() {
    const { user } = this.props;
    return (
      <div>
        <Breadcrumbs content={[{ link: '/user', title: 'Account' }]} />

        <h1>Account</h1>
        <Alert>
          Alle Angaben stammen von <Link
          color='primary'
          rel="noreferrer"
          target="_blank"
          href={'https://opensensemap.org/'}
          underline="hover">openSenseMap</Link> und können dort verwaltet werden.
        </Alert>
        <Paper style={{ width: 'max-content', maxWidth: '100%' }}>
          <List>
            <ListItem>
              <Tooltip title='Nutzername'>
                <ListItemIcon>
                  <FontAwesomeIcon icon={faUser} />
                </ListItemIcon>
              </Tooltip>
              <ListItemText primary={`Name: ${user.name}`} />
            </ListItem>
            <ListItem>
              <Tooltip title='Email'>
                <ListItemIcon>
                  <FontAwesomeIcon icon={faAt} />
                </ListItemIcon>
              </Tooltip>
              <ListItemText primary={`Email: ${user.email}`} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <FontAwesomeIcon icon={faUserTag} />
              </ListItemIcon>
              <ListItemText primary={`Userrolle: ${user.blocklyRole}`} />
            </ListItem>
          </List>
        </Paper>
        <Divider style={{ marginBottom: '16px', marginTop: '16px' }} />
        <div style={{ marginBottom: '8px' }}>
          {this.props.user.boxes.length < 1 ?
            <Typography>
              Du hast noch keine senseBox registriert. Besuche <Link
              color='primary'
              rel="noreferrer"
              target="_blank"
              href={'https://opensensemap.org/'}
              underline="hover">openSenseMap</Link> um eine senseBox zu registrieren.
            </Typography>
            : <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
              Du hast {this.props.user.boxes.length} {this.props.user.boxes.length === 1 ? 'senseBox' : 'senseBoxen'} registriert:
          </Typography>}
        </div>
        <Grid container spacing={2}>
          {this.props.user.boxes.map((box, i) => {
            var sensors = box.sensors.map(sensor => sensor.title);
            return (
              <Grid item xs={12} sm={6} md={4} xl={3} key={i}>
                <Link
                  rel="noreferrer"
                  target="_blank"
                  href={`https://opensensemap.org/explore/${box._id}`}
                  color="primary"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                  underline="hover">
                  <Paper>
                    <List>
                      <ListItem>
                        <Typography style={{ fontWeight: 'bold', fontSize: '1.6rem' }}>{box.name}</Typography>
                      </ListItem>
                      <ListItem>
                        <Tooltip title='Modell'>
                          <ListItemIcon>
                            <FontAwesomeIcon icon={faBox} />
                          </ListItemIcon>
                        </Tooltip>
                        <div>
                          <Typography style={{ fontWeight: 'bold', marginRight: '4px' }}>Modell: </Typography>
                          <Typography>{box.model}</Typography>
                        </div>
                      </ListItem>
                      <ListItem>
                        <Tooltip title='Standort'>
                          <ListItemIcon>
                            <FontAwesomeIcon icon={faMapMarkerAlt} />
                          </ListItemIcon>
                        </Tooltip>
                        <div>
                          <Typography style={{ fontWeight: 'bold', marginRight: '4px' }}>Standort: </Typography>
                          <Typography>{`${box.exposure} (lon: ${box.currentLocation.coordinates[0]}, lat: ${box.currentLocation.coordinates[1]})`}</Typography>
                        </div>
                      </ListItem>
                      <ListItem>
                        <Tooltip title='Sensoren'>
                          <ListItemIcon>
                            <FontAwesomeIcon icon={faCloudSunRain} />
                          </ListItemIcon>
                        </Tooltip>
                        <div>
                          <Typography style={{ fontWeight: 'bold', marginRight: '4px' }}>Sensoren: </Typography>
                          <Typography>{sensors.join(', ')}</Typography>
                        </div>
                      </ListItem>
                    </List>
                  </Paper>
                </Link>
              </Grid>
            );
          })}
        </Grid>
      </div>
    );
  }
}

Account.propTypes = {
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(mapStateToProps, null)(Account);
