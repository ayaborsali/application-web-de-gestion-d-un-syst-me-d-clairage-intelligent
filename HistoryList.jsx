import React, { useEffect, useState } from 'react';
import {
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Chip,
} from '@mui/material';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase'; // adapte ce chemin si besoin
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const getStatusColor = (status) => {
  switch (status) {
    case 'Active': return 'success';
    case 'Inactive': return 'default';
    case 'Faulty': return 'error';
    default: return 'warning';
  }
};

const HistoryList = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'history'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLogs(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Paper sx={{ p: 3, mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        🔁 Historique des actions
      </Typography>

      {logs.length === 0 ? (
        <Typography>Aucune activité trouvée.</Typography>
      ) : (
        <List>
          {logs.map((log) => (
            <React.Fragment key={log.id}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight="bold">
                      {log.message}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Box display="flex" alignItems="center" gap={1} mt={1}>
                        <AccessTimeIcon fontSize="small" />
                        <Typography variant="body2">
                          {log.timestamp?.seconds
                            ? new Date(log.timestamp.seconds * 1000).toLocaleString()
                            : 'Date inconnue'}
                        </Typography>
                      </Box>

                      {log.user && (
                        <Box display="flex" alignItems="center" gap={1}>
                          <PersonIcon fontSize="small" />
                          <Typography variant="body2">{log.user}</Typography>
                        </Box>
                      )}

                      {log.location && (
                        <Box display="flex" alignItems="center" gap={1}>
                          <LocationOnIcon fontSize="small" />
                          <Typography variant="body2">{log.location}</Typography>
                        </Box>
                      )}

                      <Box mt={1}>
                        <Chip
                          label={log.status || 'Inconnu'}
                          color={getStatusColor(log.status)}
                          variant="outlined"
                          size="small"
                        />
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default HistoryList;
