import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import * as Blockly from 'blockly/core';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

export default function LanguageSelector() {
    const classes = useStyles();
    const [lang, setLang] = React.useState(window.localStorage.getItem('locale'));

    const handleChange = (event) => {
        setLang(event.target.value);
        window.localStorage.setItem('locale', event.target.value);
    };

    return (
        <div>
            <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">{Blockly.Msg.settings_language}</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={lang}
                    onChange={handleChange}
                >
                    <MenuItem value={'de'}>Deutsch</MenuItem>
                    <MenuItem value={'en'}>Englisch</MenuItem>
                </Select>
            </FormControl>
        </div>
    );
}
