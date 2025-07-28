import React, { useState } from 'react';
import { TextField, Button, Paper, Typography } from '@mui/material';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../firebase'; // adapte le chemin selon ton projet

const AddPost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      setMessage('❗️Veuillez remplir tous les champs');
      return;
    }

    try {
      await addDoc(collection(db, 'posts'), {
        title,
        content,
        author: auth.currentUser?.email || 'Anonyme',
        createdAt: serverTimestamp(),
      });

      setMessage('✅ Post ajouté avec succès');
      setTitle('');
      setContent('');
    } catch (error) {
      setMessage(`❌ Erreur : ${error.message}`);
    }
  };

  return (
    <Paper sx={{ p: 3, mt: 4 }}>
      <Typography variant="h6" gutterBottom>Ajouter un nouveau Post</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Contenu"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          fullWidth
          multiline
          rows={4}
          margin="normal"
          required
        />
        <Button variant="contained" type="submit" sx={{ mt: 2 }}>
          Publier
        </Button>
      </form>
      {message && <Typography sx={{ mt: 2 }}>{message}</Typography>}
    </Paper>
  );
};

export default AddPost;
