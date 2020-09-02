import React, { Component } from 'react';

import Breadcrumbs from '../Breadcrumbs';

import tutorials from './tutorials.json';

import { Link } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

class TutorialHome extends Component {
  render() {
    return (
      <div>
        <Breadcrumbs content={[{link: '/', title: 'Home'},{link: '/tutorial', title: 'Tutorial'}]}/>

        <h1>Tutorial-Übersicht</h1>
        <Grid container spacing={2}>
          {tutorials.map((tutorial, i) => (
            <Grid item xs={12} sm={6} md={4} xl={3} key={i}>
              <Link to={`/tutorial/${i+1}`} style={{textDecoration: 'none', color: 'inherit'}}>
                <Paper style={{height: '150px', padding: '10px'}}>{tutorials[i].title}</Paper>
              </Link>
            </Grid>
          ))}
        </Grid>
      </div>
    );
  };
}

export default TutorialHome;
