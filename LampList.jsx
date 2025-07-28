import React, { useEffect, useState } from 'react';
import { Typography, Paper, List, ListItem, ListItemText } from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase'; // adapte selon ton arborescence

const DeviceList = () => {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'devices'));
        const deviceData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDevices(deviceData);
      } catch (error) {
        console.error('❌ Erreur lors du chargement des devices :', error);
      }
    };

    fetchDevices();
  }, []);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>Liste des lampes (devices)</Typography>
      <List>
        {devices.map((device) => (
          <ListItem key={device.id}>
            <ListItemText
              primary={device.name}
              secondary={`Statut : ${device.status}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default DeviceList;
