import React from 'react';
import { Typography, Paper } from '@mui/material';

const ConfigureThresholds = () => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>Configurer les seuils</Typography>
      <Typography>
        Ici, tu peux définir les seuils d’alerte, valeurs limites, etc.
      </Typography>
    </Paper>
  );
};

export default ConfigureThresholds;
