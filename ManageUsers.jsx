import React, { useState, useEffect } from 'react';
import {
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  IconButton,
  Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { db } from '../../firebase'; // adapte le chemin selon ton projet
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from 'firebase/firestore';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [newUserName, setNewUserName] = useState('');
  const [editUserId, setEditUserId] = useState(null);
  const [editUserName, setEditUserName] = useState('');

  const usersRef = collection(db, 'users');

  // Charger les utilisateurs depuis Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(usersRef);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    if (newUserName.trim() === '') return;

    const newUser = {
      name: newUserName.trim(),
    };

    try {
      const docRef = await addDoc(usersRef, newUser);
      setUsers([...users, { id: docRef.id, ...newUser }]);
      setNewUserName('');
    } catch (error) {
      console.error('Erreur ajout utilisateur :', error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteDoc(doc(usersRef, id));
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error('Erreur suppression utilisateur :', error);
    }
  };

  const handleEditUser = (user) => {
    setEditUserId(user.id);
    setEditUserName(user.name);
  };

  const handleSaveUser = async () => {
    try {
      const userRef = doc(usersRef, editUserId);
      await updateDoc(userRef, { name: editUserName.trim() });

      setUsers(
        users.map((user) =>
          user.id === editUserId ? { ...user, name: editUserName.trim() } : user
        )
      );
      setEditUserId(null);
      setEditUserName('');
    } catch (error) {
      console.error('Erreur mise à jour utilisateur :', error);
    }
  };

  const handleCancelEdit = () => {
    setEditUserId(null);
    setEditUserName('');
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Gérer les utilisateurs
      </Typography>

      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Nouveau utilisateur"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={handleAddUser}>
          Ajouter
        </Button>
      </Box>

      <List>
        {users.map((user) => (
          <ListItem
            key={user.id}
            secondaryAction={
              editUserId === user.id ? (
                <>
                  <IconButton edge="end" onClick={handleSaveUser}>
                    <SaveIcon />
                  </IconButton>
                  <IconButton edge="end" onClick={handleCancelEdit} sx={{ ml: 1 }}>
                    <CancelIcon />
                  </IconButton>
                </>
              ) : (
                <>
                  <IconButton edge="end" onClick={() => handleEditUser(user)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    onClick={() => handleDeleteUser(user.id)}
                    sx={{ ml: 1 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </>
              )
            }
          >
            {editUserId === user.id ? (
              <TextField
                value={editUserName}
                onChange={(e) => setEditUserName(e.target.value)}
                fullWidth
              />
            ) : (
              <ListItemText primary={user.name} />
            )}
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default ManageUsers;
