import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import LanguageSelector from './LanguageSelector';
import RenderSelector from './RenderSelector';


class Settings extends Component {
    render() {
        return (
            <div>
                <Typography variant='h4' style={{ marginBottom: '5px' }}>Einstellungen</Typography>
                <LanguageSelector />
                <RenderSelector />
                <Button
                    style={{ marginTop: '20px' }}
                    variant="contained"
                    color="primary"
                    onClick={() => { this.props.history.push('/') }}
                >
                    Zurück zur Startseite
            </Button>
            </div>
        );
    };
}

export default withRouter(Settings);
