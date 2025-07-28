import React, { useEffect, useState } from 'react';
import { Typography, Paper, List, ListItem, ListItemText, Chip } from '@mui/material';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase'; // 🔁 adapter le chemin selon ton projet

const getSeverityColor = (severity) => {
  switch (severity) {
    case 'High':
      return 'error';
    case 'Medium':
      return 'warning';
    case 'Low':
      return 'info';
    default:
      return 'default';
  }
};

const AlertsNotifications = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'alerts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAlerts(data);
    });

    return () => unsubscribe(); // Clean on unmount
  }, []);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Alerts & Notifications
      </Typography>
      <List>
        {alerts.map((alert) => (
          <ListItem key={alert.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <ListItemText
              primary={alert.message}
              secondary={new Date(alert.createdAt?.seconds * 1000).toLocaleString()}
            />
            <Chip label={`Sévérité: ${alert.severity}`} color={getSeverityColor(alert.severity)} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default AlertsNotifications;
