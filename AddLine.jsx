import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper } from '@mui/material';
import { addDoc, collection } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../../firebase'; // chemin correct vers firebase.js

const AddLine = () => {
  const [lineName, setLineName] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!lineName.trim()) {
      setMessage('🚫 Veuillez saisir le nom de la ligne.');
      return;
    }

    if (!userId) {
      setMessage('🚫 Utilisateur non connecté. Veuillez vous connecter.');
      return;
    }

    const newLine = {
      name: lineName,
      description,
      createdAt: new Date().toISOString(),
      userId,
    };

    try {
      await addDoc(collection(db, 'lines'), newLine);
      setMessage(`✅ Ligne "${lineName}" ajoutée avec succès.`);
      setLineName('');
      setDescription('');
    } catch (error) {
      console.error('Erreur Firestore :', error);
      setMessage(`❌ Erreur lors de l'ajout : ${error.message}`);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>Ajouter une ligne</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nom de la ligne"
          value={lineName}
          onChange={(e) => setLineName(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Description (optionnelle)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={3}
        />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Ajouter
        </Button>
      </form>
      {message && <Typography sx={{ mt: 2 }}>{message}</Typography>}
    </Paper>
  );
};

export default AddLine;
