import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import clsx from 'clsx';

import Breadcrumbs from '../Breadcrumbs';

// import gallery from './gallery.json';
// import tutorials from '../../data/tutorials.json';

import { Link } from 'react-router-dom';

import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import BlocklyWindow from '../Blockly/BlocklyWindow';
import Divider from '@material-ui/core/Divider';


const styles = (theme) => ({
    outerDiv: {
        position: 'absolute',
        right: '-30px',
        bottom: '-30px',
        width: '160px',
        height: '160px',
        color: fade(theme.palette.secondary.main, 0.6)
    },
    outerDivError: {
        stroke: fade(theme.palette.error.dark, 0.6),
        color: fade(theme.palette.error.dark, 0.6)
    },
    outerDivSuccess: {
        stroke: fade(theme.palette.primary.main, 0.6),
        color: fade(theme.palette.primary.main, 0.6)
    },
    outerDivOther: {
        stroke: fade(theme.palette.secondary.main, 0.6)
    },
    innerDiv: {
        width: 'inherit',
        height: 'inherit',
        display: 'table-cell',
        verticalAlign: 'middle',
        textAlign: 'center'
    }
});




class GalleryHome extends Component {

    state = {
        gallery: []
    }

    componentDidMount() {
        console.log(process.env.REACT_APP_BLOCKLY_API)
        fetch(process.env.REACT_APP_BLOCKLY_API + this.props.location.pathname)
            .then(res => res.json())
            .then((data) => {
                this.setState({ gallery: data })
            })
    }


    render() {
        return (
            <div>
                <Breadcrumbs content={[{ link: '/gallery', title: 'Gallery' }]} />

                <h1>Gallery</h1>
                <Grid container spacing={2}>
                    {this.state.gallery.map((gallery, i) => {
                        return (
                            <Grid item xs={12} sm={6} md={4} xl={3} key={i} style={{}}>
                                <Link to={`/gallery/${gallery.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <Paper style={{ height: '400px', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
                                        <h3>{gallery.title}</h3>
                                        <Divider />
                                        <BlocklyWindow
                                            svg
                                            readOnly
                                            initialXml={gallery.xml}
                                        />
                                        <p>{gallery.text}</p>
                                        <Divider />
                                        <p>{gallery.name}</p>

                                        <div className={clsx(this.props.classes.outerDiv)} style={{ width: '160px', height: '160px', border: 0 }}>
                                        </div>
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

GalleryHome.propTypes = {
    status: PropTypes.array.isRequired,
    change: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
    change: state.tutorial.change,
    status: state.tutorial.status
});

export default connect(mapStateToProps, null)(withStyles(styles, { withTheme: true })(GalleryHome));
