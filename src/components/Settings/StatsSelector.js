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

export default function StatsSelector() {
    const classes = useStyles();
    const [stats, setStats] = React.useState(window.localStorage.getItem('stats'));

    const handleChange = (event) => {
        setStats(event.target.value);
        window.localStorage.setItem('stats', event.target.value);
    };

    return (
        <div>
            <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">Statistiken</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={stats}
                    onChange={handleChange}
                >
                    <MenuItem value={true}>On</MenuItem>
                    <MenuItem value={false}>Off</MenuItem>
                </Select>
            </FormControl>
            <p>Schaltet die Statistiken Oberhalb der Arbeitsfläche ein bzw. aus</p>
        </div>
    );
}
