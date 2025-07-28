import React from 'react';
import { Typography, Paper, Box } from '@mui/material';

const ProjectConfiguration = () => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Configuration du projet
      </Typography>
      <Box>
        <Typography variant="body1">Paramètres généraux et configuration du projet.</Typography>
        {/* Ajouter formulaire / options ici */}
      </Box>
    </Paper>
  );
};

export default ProjectConfiguration;
