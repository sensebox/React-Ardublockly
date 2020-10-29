import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 400,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

export default function LanguageSelector() {
    const classes = useStyles();
    const [renderer, setRenderer] = React.useState(window.localStorage.getItem('renderer'));

    const handleChange = (event) => {
        setRenderer(event.target.value);
        window.localStorage.setItem('renderer', event.target.value);
    };

    return (
        <div>
            <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">Renderer</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={renderer}
                    onChange={handleChange}

                >
                    <MenuItem value={'geras'}>Geras</MenuItem>
                    <MenuItem value={'zelos'}>Zelos</MenuItem>
                </Select>
            </FormControl>
            <p>Der Renderer bestimmt das aussehen der Blöcke</p>
        </div>
    );
}
