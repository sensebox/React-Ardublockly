import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { workspaceName } from '../../actions/workspaceActions';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Blockly from 'blockly/core';
import Snackbar from '../Snackbar';


const styles = (theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    iconButton: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        width: '40px',
        height: '40px',
        '&:hover': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
        }
    },
    button: {
        backgroundColor: theme.palette.button.copycode,
        color: theme.palette.primary.contrastText,
        '&:hover': {
            backgroundColor: theme.palette.button.copycode,
            color: theme.palette.primary.contrastText,
        }
    }
});


class CopyCode extends Component {

    constructor(props) {
        super(props);
        this.state = {
            snackbar: false,
        };
    }


    copyCode = () => {
        navigator.clipboard.writeText(this.props.arduino)
        this.setState({ snackbar: true, type: 'success', key: Date.now(), message: Blockly.Msg.messages_copy_code });
    }

    render() {
        return (
            <div style={{}}>
                {this.props.iconButton ?
                    <Tooltip title={Blockly.Msg.tooltip_copy_code} arrow style={{ marginRight: '5px' }}>
                        <IconButton
                            className={`copyCode ${this.props.classes.iconButton}`}
                            onClick={() => this.copyCode()}
                        >
                            <FontAwesomeIcon icon={faCopy} size="l" />
                        </IconButton>
                    </Tooltip>
                    :
                    <Button style={{ float: 'right', color: 'white' }} variant="contained" className={this.props.classes.button} onClick={() => this.copyCode()}>
                        <FontAwesomeIcon icon={faCopy} style={{ marginRight: '5px' }} /> Code kopieren
          </Button>
                }
                <Snackbar
                    open={this.state.snackbar}
                    message={this.state.message}
                    type={this.state.type}
                    key={this.state.key}
                />

            </div >
        );
    };
}

CopyCode.propTypes = {
    arduino: PropTypes.string.isRequired,
    name: PropTypes.string,
    workspaceName: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    arduino: state.workspace.code.arduino,
    name: state.workspace.name
});


export default connect(mapStateToProps, { workspaceName })(withStyles(styles, { withTheme: true })(CopyCode));
