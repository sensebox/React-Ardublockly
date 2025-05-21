import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from '@mui/material';

const ClassroomLogin = ({ onLogin }) => {
  const [classroomCode, setClassroomCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const history = useHistory(); 

  const handleSubmit = (event) => {
    event.preventDefault();
    if (classroomCode && nickname) {
      onLogin({ classroomCode, nickname });
      setError('');
      history.push('/user');
    } else {
      setError('Please enter both classroom code and nickname');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Classroom Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="classroomCode"
            label="Classroom Code"
            name="classroomCode"
            autoComplete="classroom-code"
            autoFocus
            value={classroomCode}
            onChange={(e) => setClassroomCode(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="nickname"
            label="Nickname"
            type="text"
            id="nickname"
            autoComplete="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          {error && <Alert severity="error">{error}</Alert>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

ClassroomLogin.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default ClassroomLogin;
