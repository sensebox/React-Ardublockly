import React, { Component } from 'react';

import axios from 'axios';
import { Link } from 'react-router-dom';

import Breadcrumbs from '../Breadcrumbs';
import BlocklyWindow from '../Blockly/BlocklyWindow';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';


class GalleryHome extends Component {

  state = {
    gallery: []
  }

  componentDidMount() {
    axios.get(`${process.env.REACT_APP_BLOCKLY_API}/gallery`)
      .then(res => {
        this.setState({ gallery: res.data.galleries });
      })
      .catch(err => {
        // TODO:
      });
  }

  render() {
    return (
      <div>
        <Breadcrumbs content={[{ link: '/gallery', title: 'Gallery' }]} />

        <h1>Gallery</h1>
        <Grid container spacing={2}>
          {this.state.gallery.map((gallery, i) => {
            return (
              <Grid item xs={12} sm={6} md={4} xl={3} key={i}>
                <Link to={`/gallery/${gallery._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Paper style={{ padding: '1rem', position: 'relative', overflow: 'hidden' }}>
                    <h3 style={{marginTop: 0}}>{gallery.title}</h3>
                    <Divider style={{marginTop: '1rem', marginBottom: '10px'}}/>
                    <BlocklyWindow
                      svg
                      blockDisabled
                      initialXml={gallery.xml}
                    />
                    <Typography variant='body2' style={{fontStyle: 'italic', margin: 0, marginTop: '-30px'}}>{gallery.description}</Typography>
                  </Paper>
                </Link>
              </Grid>
            )
          })}
        </Grid>
      </div>
    );
  };
}

export default GalleryHome;
