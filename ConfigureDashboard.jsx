import React, { useState } from 'react';
import { Typography, Paper, Switch, FormControlLabel } from '@mui/material';

const ConfigureDashboard = () => {
  const [showStats, setShowStats] = useState(true);
  const [showAlerts, setShowAlerts] = useState(true);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>Configurer le dashboard</Typography>
      <FormControlLabel
        control={<Switch checked={showStats} onChange={() => setShowStats(!showStats)} />}
        label="Afficher les statistiques"
      />
      <FormControlLabel
        control={<Switch checked={showAlerts} onChange={() => setShowAlerts(!showAlerts)} />}
        label="Afficher les alertes"
      />
      {/* Ajoute d'autres options selon besoins */}
    </Paper>
  );
};

export default ConfigureDashboard;
