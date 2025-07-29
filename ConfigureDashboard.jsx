import React from 'react';
import { Typography, Paper, Switch, FormControlLabel } from '@mui/material';
import { useSectionVisibility } from './SectionVisibilityContext';

const ConfigureDashboard = () => {
  const { showStats, setShowStats, showAlerts, setShowAlerts } = useSectionVisibility();

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
    </Paper>
  );
};

export default ConfigureDashboard;
