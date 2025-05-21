import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers, updateUserRole } from '../../actions/adminActions';
import { Grid, Paper, Typography, Tooltip, IconButton, List, ListItem, ListItemText, Divider, Select, MenuItem, FormControl, InputLabel, Dialog, DialogActions, DialogContent, DialogContentText, Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEdit } from '@fortawesome/free-solid-svg-icons';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const users = useSelector(state => state.admin.users); // Fetch users from Redux store
  const loggedInUser = useSelector(state => state.auth.user); // Get the currently logged-in user from the auth state

  const [selectedRole, setSelectedRole] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);  // Manage confirmation dialog
  const [targetUser, setTargetUser] = useState(null);   // Store the user whose role is being changed

  useEffect(() => {
    dispatch(getUsers());  // Fetch users when component mounts
  }, [dispatch]);

  const handleRoleChange = (userId, newRole) => {
    // Prevent role change for the current logged-in user
    if (userId === loggedInUser._id) {
      return;
    }
    
    setSelectedRole(prev => ({
      ...prev,
      [userId]: newRole  // Update selected role for the specific user
    }));

    setTargetUser({ userId, newRole });
    if (newRole === 'admin' || newRole === 'user') {
      setDialogOpen(true);  // Open confirmation dialog if changing to/from 'admin'
    } else {
      updateUserRoleHandler(userId);  // Otherwise, directly update the role
    }
  };

  const updateUserRoleHandler = (userId) => {
    if (selectedRole[userId]) {
      dispatch(updateUserRole(userId, selectedRole[userId]));  // Dispatch action to update user role
    }
    setDialogOpen(false);  // Close confirmation dialog
  };

  const handleDialogClose = (confirmed) => {
    if (confirmed) {
      updateUserRoleHandler(targetUser.userId);  // If confirmed, proceed with role change
    }
    setDialogOpen(false);  // Close dialog regardless of confirmation
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
      <Grid container spacing={3}>
        {users.length > 0 ? users.map((user, i) => (
          <Grid item xs={12} md={6} lg={4} key={i}>
            <Paper elevation={3} style={{ padding: '16px' }}>
              <List>
                <ListItem>
                  <Tooltip title="User Name">
                    <FontAwesomeIcon icon={faUser} style={{ marginRight: '10px' }} />
                  </Tooltip>
                  <ListItemText primary={`Name: ${user.name}`} />
                </ListItem>

                <ListItem>
                  <Tooltip title="Email">
                    <FontAwesomeIcon icon={faUser} style={{ marginRight: '10px' }} />
                  </Tooltip>
                  <ListItemText primary={`Email: ${user.email}`} />
                </ListItem>

                <Divider style={{ margin: '10px 0' }} />
                {user.email === loggedInUser.email ? (
                <ListItem>
                  <FormControl fullWidth disabled>  {/* Disable form control for the logged-in user */}
                    <InputLabel id={`role-select-label-${i}`}>User Role</InputLabel>
                    <Select
                      labelId={`role-select-label-${i}`}
                      id={`role-select-${i}`}
                      value={selectedRole[user._id] || user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    >
                      <MenuItem value="user">User</MenuItem>
                      <MenuItem value="creator">Creator</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                    </Select>
                  </FormControl>
                </ListItem>) : (

                <ListItem>
                  <FormControl fullWidth>  {/* Disable form control for the logged-in user */}
                    <InputLabel id={`role-select-label-${i}`}>User Role</InputLabel>
                    <Select
                      labelId={`role-select-label-${i}`}
                      id={`role-select-${i}`}
                      value={selectedRole[user._id] || user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    >
                      <MenuItem value="user">User</MenuItem>
                      <MenuItem value="creator">Creator</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                    </Select>
                  </FormControl>
                  <Tooltip title="Change Role">
                    <IconButton 
                      onClick={() => handleRoleChange(user._id, selectedRole[user._id])} 
                      disabled={user._id === loggedInUser._id}  // Disable button for the logged-in user
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </IconButton>
                  </Tooltip>
                </ListItem>)}
              </List>
            </Paper>
          </Grid>
        )) : (
          <Typography>No users found.</Typography>  // Display message if no users found
        )}
      </Grid>

      {/* Confirmation Dialog for Changing Roles */}
      <Dialog
        open={dialogOpen}
        onClose={() => handleDialogClose(false)}
      >
        <DialogContent>
          <DialogContentText>
            Are you sure you want to change the role to {targetUser?.newRole === 'admin' ? 'Admin' : 'User'}? This will grant/revoke admin privileges.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogClose(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleDialogClose(true)} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

AdminDashboard.propTypes = {
  users: PropTypes.array.isRequired
};

export default AdminDashboard;
