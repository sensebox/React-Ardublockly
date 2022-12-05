import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setLanguage } from '../actions/generalActions';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { setBoard } from '../actions/boardAction';
import ReactCountryFlag from "react-country-flag";
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';

const theme = createTheme({
    overrides: {
        MuiSelect: {
            select: {
                '&:focus': {
                    backgroundColor: 'transparent',
                },
            },
        },
    },
});

class NavbarSettings extends Component {
    componentDidMount() {
        // Ensure that Blockly.setLocale is adopted in the component.
        // Otherwise, the text will not be displayed until the next update of the component.
        this.forceUpdate();
    }

    handleChange = (event) => {
        this.props.setLanguage(event.target.value);
    }


    render() {
        return (
            <div style={{ margin: "0 0 0 auto", display: "flex" }}>
                <div style={{ margin: "0 30px 0 auto", display: "flex" }}>
                    <MuiThemeProvider theme={theme}>
                        <Select
                            value={this.props.selectedBoard}
                            onChange={(e) => this.props.setBoard(e.target.value)}
                            disableUnderline={true}
                            style={{ backgroundColor: "transparent !important" }}
                            // IconComponent={() => <div />}
                        >
                            <MenuItem value="mcu">senseBox MCU</MenuItem>
                            <MenuItem value="mini">senseBox MCU mini</MenuItem>
                        </Select>
                    </MuiThemeProvider>
                </div>
                <div style={{ margin: "0 0 0 auto", display: "flex" }}>
                    <MuiThemeProvider theme={theme}>
                        <Select
                            value={this.props.language}
                            onChange={this.handleChange}
                            disableUnderline={true}
                            IconComponent={() => null}
                        >
                            <MenuItem value={'en_US'} >
                                <ReactCountryFlag
                                    countryCode="US"
                                    svg
                                    cdnSuffix="svg"
                                    title="US"
                                />
                            </MenuItem>
                            <MenuItem value={'de_DE'}>
                                <ReactCountryFlag
                                    countryCode="DE"
                                    svg
                                    cdnSuffix="svg"
                                    title="DE"
                                />
                            </MenuItem>
                        </Select>
                    </MuiThemeProvider>
                </div>
            </div >
        );
    }
}

const mapStateToProps = state => ({
    language: state.general.language,
    selectedBoard: state.board.board
});

export default connect(mapStateToProps, { setLanguage, setBoard })(NavbarSettings);
