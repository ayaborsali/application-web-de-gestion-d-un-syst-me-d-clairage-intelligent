import React from 'react';
import { Typography, Paper } from '@mui/material';

const AlertProject = () => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Alert Project
      </Typography>
      <Typography variant="body1">Gestion des alertes spécifiques au projet.</Typography>
    </Paper>
  );
};

export default AlertProject;
