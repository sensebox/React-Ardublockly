import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { tutorialBadge, deleteProperty, setError, deleteError } from '../../../actions/tutorialBuilderActions';

import axios from 'axios';

import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const styles = (theme) => ({
  errorColor: {
    color: `${theme.palette.error.dark} !important`
  },
  errorColorShrink: {
    color: `rgba(0, 0, 0, 0.54) !important`
  },
  errorBorder: {
    borderColor: `${theme.palette.error.dark} !important`
  }
});

class Badge extends Component {

  constructor(props){
    super(props);
    this.state={
      checked: props.badge ? true : false,
      badgeName: '',
      filteredBadges: [],
      badges: []
    };
  }

  componentDidMount(){
    this.getBadges();
  }

  componentDidUpdate(props){
    if(props.badge !== this.props.badge){
      this.setState({ checked: this.props.badge !== undefined ? true : false, badgeName: this.props.badge ? this.state.badges.filter(badge => badge._id === this.props.badge)[0].name : '' });
    }
  }

  getBadges = () => {
    axios.get(`${process.env.REACT_APP_MYBADGES_API}/badge`)
      .then(res => {
        this.setState({badges: res.data.badges, badgeName: this.props.badge ? res.data.badges.filter(badge => badge._id === this.props.badge)[0].name : '' });
      })
      .catch(err => {
        console.log(err);
      });
  };

  deleteBadge = () => {
    this.setState({ filteredBadges: [], badgeName: '' });
    this.props.tutorialBadge(null);
    this.props.setError(this.props.index, 'badge');
  };

  setBadge = (badge) => {
    this.setState({ filteredBadges: [] });
    this.props.tutorialBadge(badge._id);
    this.props.deleteError(this.props.index, 'badge');
  };

  onChange = e => {
    this.setState({ badgeName: e.target.value });
  };

  onChangeBadge = e => {
    if(e.target.value && this.props.badge === null){
      var filteredBadges = this.state.badges.filter(badge => new RegExp(e.target.value, 'i').test(badge.name));
      if(filteredBadges.length < 1){
        filteredBadges = ['Keine Übereinstimmung gefunden.'];
      }
      this.setState({filteredBadges: filteredBadges});
    }
    else {
      this.setState({filteredBadges: []});
    }
  };

  onChangeSwitch = (value) => {
    var oldValue = this.state.checked;
    this.setState({checked: value});
    if(oldValue !== value){
      if(value){
        this.props.setError(this.props.index, 'badge');
        this.props.tutorialBadge(null);
      } else {
        this.props.deleteError(this.props.index, 'badge');
        this.props.tutorialBadge(undefined);
      }
    }
  }

  render() {
    return (
      <div style={{marginBottom: '10px', padding: '18.5px 14px', borderRadius: '25px', border: '1px solid lightgrey', width: 'calc(100% - 28px)'}}>
        <FormControlLabel
          labelPlacement="end"
          label={"Badge"}
          control={
            <Switch
              checked={this.state.checked}
              onChange={(e) => this.onChangeSwitch(e.target.checked)}
              color="primary"
            />
          }
        />
        {this.state.checked ?
          <div style={{marginTop: '10px'}}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel
                htmlFor={'badge'}
                classes={{shrink: this.props.error ? this.props.classes.errorColorShrink : null}}
              >
                {'Badge'}
              </InputLabel>
              <OutlinedInput
                style={{borderRadius: '25px'}}
                classes={{notchedOutline: this.props.error ? this.props.classes.errorBorder : null}}
                error={this.props.error}
                value={this.state.badgeName}
                label={'Badge'}
                id={'badge'}
                disabled={this.props.badge}
                onChange={(e) => this.onChange(e)}
                onInput={(e) => this.onChangeBadge(e)}
                fullWidth={true}
                endAdornment={
                      <IconButton
                        onClick={this.deleteBadge}
                        edge="end"
                      >
                        <FontAwesomeIcon size='xs' icon={faTimes} />
                      </IconButton>
                    }
              />
              {this.props.error && this.state.filteredBadges.length === 0 ?
              <FormHelperText className={this.props.classes.errorColor}>Wähle ein Badge aus.</FormHelperText>
              : null}
            </FormControl>
            <List style={{paddingTop: 0}}>
            {this.state.filteredBadges.map((badge, i) => (
              badge === 'Keine Übereinstimmung gefunden.' ?
                <ListItem button key={i} onClick={this.deleteBadge} style={{border: '1px solid rgba(0, 0, 0, 0.23)', borderRadius: '25px'}}>
                  <ListItemText>{badge}</ListItemText>
                </ListItem>
              :
              <ListItem button key={i} onClick={() => {this.setBadge(badge)}} style={{border: '1px solid rgba(0, 0, 0, 0.23)', borderRadius: '25px'}}>
                <ListItemText>{`${badge.name}`}</ListItemText>
              </ListItem>
            ))}
            </List>
          </div>
        : null}
      </div>
    );
  };
}

Badge.propTypes = {
  tutorialBadge: PropTypes.func.isRequired,
  deleteProperty: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
  deleteError: PropTypes.func.isRequired,
  badge: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  badge: state.builder.badge,
  change: state.builder.change
});


export default connect(mapStateToProps, { tutorialBadge, deleteProperty, setError, deleteError })(withStyles(styles, {withTheme: true})(Badge));
