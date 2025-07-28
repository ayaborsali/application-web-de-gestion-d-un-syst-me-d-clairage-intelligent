import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
} from '@mui/material';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import MainApp from '../MainApp';
const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      
      navigate('/mainapp');
    } catch (error) {
      setError('Email ou mot de passe incorrect.');
      console.error(error);
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={8} p={3} boxShadow={3} borderRadius={2}>
      <Typography variant="h5" mb={3} textAlign="center">
        Se connecter
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Mot de passe"
          type="password"
          fullWidth
          margin="normal"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          type="submit"
          sx={{ mt: 2 }}
        >
          Se connecter
        </Button>
      </form>

      <Box
        mt={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        fontSize="0.9rem"
      >
        <Link component={RouterLink} to="/forget-password" underline="hover">
          Mot de passe oublié ?
        </Link>
        <Link component={RouterLink} to="/signup" underline="hover">
          S'inscrire
        </Link>
      </Box>
    </Box>
  );
};

export default SignIn;
