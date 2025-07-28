import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  MenuItem,
} from '@mui/material';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

const postes = [
  { label: "Administrateur", collection: "Administrateurs" },
  { label: "Superviseur", collection: "Superviseurs" },
  { label: "Directeur Local", collection: "DirecteursLocaux" },
  { label: "Directeur Régional", collection: "DirecteursRegionaux" },
  { label: "Dr Général", collection: "DrGeneraux" },
  { label: "Ingénieur", collection: "Ingenieurs" },
];

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [nom, setNom] = useState('');
  const [password, setPassword] = useState('');
  const [poste, setPoste] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!poste) {
      setError("Veuillez sélectionner un poste.");
      return;
    }

    try {
      // Création du compte utilisateur
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Envoi email de vérification
      await sendEmailVerification(user);

      // Trouver la collection associée au poste
      const posteObj = postes.find(p => p.label === poste);
      if (!posteObj) {
        setError("Poste invalide.");
        return;
      }

      // Enregistrement dans Firestore
      await setDoc(doc(db, posteObj.collection, user.uid), {
        uid: user.uid,
        email: user.email,
        nom,
        poste,
      });

      setMessage("Inscription réussie. Un email de vérification vous a été envoyé.");
      // Réinitialiser le formulaire
      setEmail('');
      setNom('');
      setPassword('');
      setPoste('');
    } catch (err) {
      console.error("Erreur signup:", err);
      setError(err.message || "Erreur lors de l'inscription.");
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={8} p={3} boxShadow={3} borderRadius={2}>
      <Typography variant="h5" mb={3} textAlign="center">Créer un compte</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

      <form onSubmit={handleSignUp}>
        <TextField
          label="Nom"
          fullWidth
          margin="normal"
          required
          value={nom}
          onChange={(e) => setNom(e.target.value)}
        />

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

        <TextField
          select
          label="Poste"
          fullWidth
          margin="normal"
          required
          value={poste}
          onChange={(e) => setPoste(e.target.value)}
        >
          {postes.map((p) => (
            <MenuItem key={p.label} value={p.label}>
              {p.label}
            </MenuItem>
          ))}
        </TextField>

        <Button variant="contained" color="primary" fullWidth type="submit" sx={{ mt: 2 }}>
          S'inscrire
        </Button>
      </form>
    </Box>
  );
}
 