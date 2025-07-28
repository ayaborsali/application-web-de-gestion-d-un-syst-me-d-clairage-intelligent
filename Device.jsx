import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Paper,
  TextField
} from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const Device = () => {
  const [devices, setDevices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Charger les appareils depuis Firestore
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'devices'));
        const deviceList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDevices(deviceList);
      } catch (err) {
        console.error('Erreur lors du chargement des appareils :', err);
      }
    };

    fetchDevices();
  }, []);

  // Filtrer les appareils selon la recherche
  const filteredDevices = devices.filter(device =>
    device.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" mb={3}>
        Device List
      </Typography>

      <TextField
        label="Search devices"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
      />

      {filteredDevices.length === 0 ? (
        <Typography>No devices found.</Typography>
      ) : (
        <List>
          {filteredDevices.map((device) => (
            <ListItem
              key={device.id}
              sx={{
                borderBottom: '1px solid #ddd',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <ListItemText primary={device.name || 'Unnamed device'} />
              <Chip
                label={device.status || 'Inactive'}
                color={device.status?.toLowerCase() === 'active' ? 'success' : 'default'}
                variant="outlined"
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default Device;
