import React from 'react';
import { Typography, Paper } from '@mui/material';

const DeviceProfile = () => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Profil des appareils
      </Typography>
      <Typography variant="body1">Configuration et détails des profils des appareils.</Typography>
    </Paper>
  );
};

export default DeviceProfile;
